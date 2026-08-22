import { GameState, Player, TileData, Card, TradeOffer, AuctionState, GameLog, GameSettings } from '../types/game';
import { RoomMember } from '../types/room';
import { BOARD_TILES, COLOR_GROUP_TILES } from '../constants/boardData';
import { CHANCE_CARDS, COMMUNITY_CARDS } from '../constants/cardsData';
import { AIService } from './aiService';

export class GameEngine {
  /**
   * Initialize a new game state from room members and settings
   */
  public static createInitialGameState(roomId: string, members: RoomMember[], settings: GameSettings, hostActivePerks?: string[]): GameState {
    const players: Player[] = members.map(m => ({
      id: m.id,
      name: m.name,
      avatar: m.avatar,
      token: m.token,
      color: m.color,
      isBot: m.isBot,
      botDifficulty: m.botDifficulty,
      cash: m.startingCashOverride !== undefined ? m.startingCashOverride : settings.startingCash,
      position: 0,
      inJail: false,
      jailTurns: 0,
      getOutOfJailCards: 0,
      isBankrupt: false,
      properties: [],
      houses: {},
      mortgaged: {},
      stats: {
        totalRentCollected: 0,
        totalRentPaid: 0,
        propertiesBought: 0,
        doublesRolled: 0
      },
      activePerks: m.isHost ? hostActivePerks : undefined
    }));

    // Quick Mode: Distribute 2 random unowned properties to each player if enabled
    if (settings.quickMode) {
      const buyableTiles = BOARD_TILES.filter(t => t.price && t.type === 'property').map(t => t.id);
      // Shuffle
      const shuffled = [...buyableTiles].sort(() => Math.random() - 0.5);
      players.forEach(p => {
        const assigned = shuffled.splice(0, 2);
        assigned.forEach(tileId => {
          p.properties.push(tileId);
        });
      });
    }

    return {
      roomId,
      players,
      currentTurnIndex: 0,
      phase: 'roll_dice',
      dice: [1, 1],
      consecutiveDoubles: 0,
      hasRolled: false,
      remainingTurnTime: settings.turnTimeSeconds || 60,
      freeParkingPool: 0,
      activeCard: null,
      activeAuction: null,
      activeTrade: null,
      pendingBuyTileId: null,
      winnerId: null,
      logs: [
        {
          id: `log_${Date.now()}_0`,
          timestamp: Date.now(),
          type: 'system',
          message: `بدأت لعبة أملاك وعقارات! الدور الآن عند ${players[0].name}.`
        }
      ],
      settings,
      isPaused: false,
      version: 1
    };
  }

  /**
   * Apply Time Shield Perk (adds 20 seconds to current turn)
   */
  public static applyTimeShield(state: GameState, playerId: string): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    
    if (player && player.activePerks?.includes('timeShield') && !player.hasUsedTimeShield && newState.currentTurnIndex === newState.players.indexOf(player)) {
      player.hasUsedTimeShield = true;
      newState.remainingTurnTime += 20;
      this.addLog(newState, 'system', `قام ${player.name} باستخدام درع الوقت! (+20 ثانية)`);
    }
    
    return newState;
  }

  /**
   * Prepare a dice roll: evaluates dice, consecutive doubles, jail escape, and returns step distance
   */
  public static prepareRoll(state: GameState, customDice?: [number, number]): {
    state: GameState;
    stepsToMove: number;
    wentToJail: boolean;
    stayedInJail: boolean;
  } {
    const newState = this.clone(state);
    const player = newState.players[newState.currentTurnIndex];

    const d1 = customDice ? customDice[0] : Math.floor(Math.random() * 6) + 1;
    const d2 = customDice ? customDice[1] : Math.floor(Math.random() * 6) + 1;
    newState.dice = [d1, d2];
    const isDouble = d1 === d2;

    if (isDouble) {
      player.stats.doublesRolled += 1;
      newState.consecutiveDoubles += 1;
    } else {
      newState.consecutiveDoubles = 0;
    }

    newState.hasRolled = true;

    this.addLog(newState, 'roll', `🎲 رمى ${player.name} النرد وحصل على (${d1} + ${d2} = ${d1 + d2})${isDouble ? ' 🔥 دبل!' : ''}`, player.id);

    // If 3 consecutive doubles -> Go to Jail!
    if (newState.consecutiveDoubles >= 3) {
      this.addLog(newState, 'jail', `🚨 رمى ${player.name} الدبل 3 مرات متتالية! أُرسل مباشرة إلى السجن بتهمة السرعة الزائدة!`, player.id);
      const jailState = this.sendToJail(newState, player.id);
      return { state: jailState, stepsToMove: 0, wentToJail: true, stayedInJail: false };
    }

    // If player is currently in Jail
    if (player.inJail) {
      if (isDouble) {
        player.inJail = false;
        player.jailTurns = 0;
        newState.consecutiveDoubles = 0; // cannot roll again on escape double
        newState.phase = 'moving';
        this.addLog(newState, 'jail', `🎉 نجح ${player.name} في رمي الدبل وخرج من السجن حراً!`, player.id);
        return { state: newState, stepsToMove: d1 + d2, wentToJail: false, stayedInJail: false };
      } else {
        player.jailTurns += 1;
        if (player.jailTurns >= 3) {
          // Force bail
          if (player.cash >= 50) {
            player.cash -= 50;
            player.inJail = false;
            player.jailTurns = 0;
            newState.phase = 'moving';
            this.addLog(newState, 'jail', `🚪 أمضى ${player.name} 3 أدوار في السجن ودفع 50 كفالة إجبارية وخرج.`, player.id);
            return { state: newState, stepsToMove: d1 + d2, wentToJail: false, stayedInJail: false };
          } else {
            const bankruptState = this.handleBankruptcy(newState, player.id);
            return { state: bankruptState, stepsToMove: 0, wentToJail: false, stayedInJail: true };
          }
        } else {
          this.addLog(newState, 'jail', `🔒 فشل ${player.name} في رمي الدبل، ويبقى في السجن (الدور ${player.jailTurns}/3).`, player.id);
          newState.phase = 'idle';
          return { state: newState, stepsToMove: 0, wentToJail: false, stayedInJail: true };
        }
      }
    }

    // Normal Movement
    newState.phase = 'moving';
    return { state: newState, stepsToMove: d1 + d2, wentToJail: false, stayedInJail: false };
  }

  /**
   * Step player forward by 1 tile (used for animated pawn hopping)
   */
  public static stepPlayerForward(state: GameState, playerId: string): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    if (!player) return newState;

    const oldPos = player.position;
    const newPos = (oldPos + 1) % 40;
    player.position = newPos;

    // Passed or landed on GO
    if (newPos === 0) {
      const goAmount = newState.settings.doubleCashOnGoLanding ? 400 : 200;
      player.cash += goAmount;
      this.addLog(newState, 'rent', `🚀 مر ${player.name} على خانة انطلق واستلم ${goAmount} مكافأة!`, player.id);
    }

    return newState;
  }

  /**
   * Step player backward by 1 tile (for Chance card "تراجع 3 خطوات")
   */
  public static stepPlayerBackward(state: GameState, playerId: string): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    if (!player) return newState;

    const oldPos = player.position;
    const newPos = (oldPos - 1 + 40) % 40;
    player.position = newPos;

    return newState;
  }

  /**
   * Complete movement and execute landing action on destination tile
   */
  public static finishPlayerLanding(state: GameState, playerId: string): GameState {
    return this.handleTileLanding(state, playerId);
  }

  /**
   * Roll the two dice (synchronous complete fallback)
   */
  public static rollDice(state: GameState, customDice?: [number, number]): GameState {
    const prep = this.prepareRoll(state, customDice);
    if (prep.wentToJail || prep.stayedInJail || prep.stepsToMove === 0) {
      return prep.state;
    }
    return this.movePlayer(prep.state, prep.state.players[prep.state.currentTurnIndex].id, prep.stepsToMove);
  }

  /**
   * Move player token forward by steps
   */
  public static movePlayer(state: GameState, playerId: string, steps: number): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    if (!player) return newState;

    const oldPos = player.position;
    let newPos = (oldPos + steps + 40) % 40;
    player.position = newPos;

    // Passed or landed on GO
    if (steps > 0 && newPos < oldPos) {
      const goAmount = (newPos === 0 && newState.settings.doubleCashOnGoLanding) ? 400 : 200;
      player.cash += goAmount;
      this.addLog(newState, 'rent', `🚀 مر ${player.name} على خانة انطلق واستلم ${goAmount} مكافأة!`, player.id);
    } else if (newPos === 0 && steps === 0) {
      player.cash += 200;
      this.addLog(newState, 'rent', `🚀 هبط ${player.name} على خانة انطلق واستلم 200!`, player.id);
    }

    return this.handleTileLanding(newState, player.id);
  }

  /**
   * Handle the landing logic for current tile
   */
  public static handleTileLanding(state: GameState, playerId: string): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    if (!player) return newState;

    const tile = BOARD_TILES.find(t => t.id === player.position);
    if (!tile) return newState;

    // Special tiles
    if (tile.type === 'go_to_jail') {
      this.addLog(newState, 'jail', `👮‍♂️ هبط ${player.name} على خانة (اذهب إلى السجن)!`, player.id);
      return this.sendToJail(newState, player.id);
    }

    if (tile.type === 'go') {
      newState.phase = 'idle';
      return newState;
    }

    if (tile.type === 'jail') {
      this.addLog(newState, 'system', `👀 ${player.name} في زيارة عادية للسجن.`, player.id);
      newState.phase = 'idle';
      return newState;
    }

    if (tile.type === 'free_parking') {
      if (newState.settings.freeParkingJackpot && newState.freeParkingPool > 0) {
        const pool = newState.freeParkingPool;
        player.cash += pool;
        newState.freeParkingPool = 0;
        this.addLog(newState, 'rent', `🅿️ هبط ${player.name} على الموقف المجاني وفاز بحوض الضرائب التراكمي بقيمة ${pool}!`, player.id);
      } else {
        this.addLog(newState, 'system', `🅿️ استراحة مجانية لـ ${player.name} في الموقف المجاني.`, player.id);
      }
      newState.phase = 'idle';
      return newState;
    }

    if (tile.type === 'tax') {
      const tax = tile.taxAmount || 100;
      this.addLog(newState, 'rent', `💰 هبط ${player.name} على ${tile.name} ودفع ${tax} ضرائب.`, player.id);
      if (newState.settings.freeParkingJackpot) {
        newState.freeParkingPool += tax;
      }
      if (player.cash >= tax) {
        player.cash -= tax;
      } else {
        return this.handleDebt(newState, player.id, tax);
      }
      newState.phase = 'idle';
      return newState;
    }

    if (tile.type === 'chance' || tile.type === 'community') {
      return this.triggerCardDraw(newState, playerId, tile.type);
    }

    // Property / Railroad / Utility
    if (tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility') {
      const owner = newState.players.find(p => p.properties.includes(tile.id));

      if (!owner) {
        // Unowned property: Prompt to buy or start auction
        newState.pendingBuyTileId = tile.id;
        newState.phase = 'tile_action';
        return newState;
      } else if (owner.id === player.id) {
        // Landed on own property
        this.addLog(newState, 'system', `🏰 هبط ${player.name} على عقاره الخاص (${tile.name}).`, player.id);
        newState.phase = 'idle';
        return newState;
      } else {
        // Landed on other player's property -> Pay Rent
        if (owner.mortgaged[tile.id]) {
          this.addLog(newState, 'system', `🛡️ العقار (${tile.name}) مرهون حالياً، لا يوجد إيجار مستحق!`, player.id);
          newState.phase = 'idle';
          return newState;
        }

        const rent = this.calculateRent(tile, owner, newState.dice[0] + newState.dice[1], newState.players);
        this.addLog(newState, 'rent', `💸 هبط ${player.name} على (${tile.name}) المملوك لـ ${owner.name} وعليه دفع إيجار قدره ${rent}.`, player.id);

        if (player.cash >= rent) {
          player.cash -= rent;
          owner.cash += rent;
          player.stats.totalRentPaid += rent;
          owner.stats.totalRentCollected += rent;
          newState.phase = 'idle';
          return newState;
        } else {
          return this.handleDebtToPlayer(newState, player.id, owner.id, rent);
        }
      }
    }

    newState.phase = 'idle';
    return newState;
  }

  /**
   * Calculate rent for a tile
   */
  public static calculateRent(tile: TileData, owner: Player, diceSum: number, allPlayers: Player[]): number {
    if (tile.type === 'property' && tile.rentTiers) {
      const houseCount = owner.houses[tile.id] || 0;
      if (houseCount > 0) {
        return tile.rentTiers[houseCount]; // 1-4 houses, 5 hotel
      }
      // Check if owner has monopoly over color group
      const groupTiles = COLOR_GROUP_TILES[tile.group] || [];
      const hasMonopoly = groupTiles.every(id => owner.properties.includes(id));
      const baseRent = tile.baseRent || tile.rentTiers[0] || 10;
      return hasMonopoly ? baseRent * 2 : baseRent;
    }

    if (tile.type === 'railroad') {
      const railroadIds = COLOR_GROUP_TILES['railroad'] || [5, 15, 25, 35];
      const count = railroadIds.filter(id => owner.properties.includes(id)).length;
      const rents = [25, 50, 100, 200];
      return rents[Math.max(0, Math.min(3, count - 1))];
    }

    if (tile.type === 'utility') {
      const utilityIds = COLOR_GROUP_TILES['utility'] || [12, 28];
      const count = utilityIds.filter(id => owner.properties.includes(id)).length;
      const multiplier = count === 2 ? 10 : 4;
      return diceSum * multiplier;
    }

    return 0;
  }

  /**
   * Buy unowned property
   */
  public static buyProperty(state: GameState, playerId: string, tileId: number): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);

    if (!player || !tile || !tile.price || player.cash < tile.price) return newState;

    player.cash -= tile.price;
    player.properties.push(tileId);
    player.stats.propertiesBought += 1;
    newState.pendingBuyTileId = null;
    newState.phase = 'idle';

    this.addLog(newState, 'buy', `🏷️ اشترى ${player.name} عقار (${tile.name}) مقابل ${tile.price}!`, player.id);
    return newState;
  }

  /**
   * Decline to buy property -> Starts Auction if enabled
   */
  public static declineProperty(state: GameState, tileId: number): GameState {
    const newState = this.clone(state);
    newState.pendingBuyTileId = null;

    if (newState.settings.enableAuctions) {
      return this.startAuction(newState, tileId);
    } else {
      newState.phase = 'idle';
      return newState;
    }
  }

  /**
   * Start an Auction for a tile
   */
  public static startAuction(state: GameState, tileId: number): GameState {
    const newState = this.clone(state);
    const tile = BOARD_TILES.find(t => t.id === tileId);
    if (!tile) return newState;

    const activePlayerIds = newState.players.filter(p => !p.isBankrupt).map(p => p.id);

    newState.activeAuction = {
      tileId,
      currentBid: 10,
      highestBidderId: null,
      activePlayerIds,
      currentTurnIndex: 0,
      timeLeftSeconds: 15
    };

    newState.phase = 'auction';
    this.addLog(newState, 'system', `📢 بدأ مزاد علني على (${tile.name}) بسعر افتتاحي 10 $!`);
    return newState;
  }

  /**
   * Bid in active auction
   */
  public static placeAuctionBid(state: GameState, playerId: string, amount: number): GameState {
    const newState = this.clone(state);
    const auction = newState.activeAuction;
    if (!auction) return newState;

    const player = newState.players.find(p => p.id === playerId);
    if (!player || player.cash < amount || amount <= auction.currentBid) return newState;

    auction.currentBid = amount;
    auction.highestBidderId = playerId;
    auction.timeLeftSeconds = 15;

    this.addLog(newState, 'buy', `🔨 رفع ${player.name} المزايدة إلى ${amount} $!`, playerId);
    return newState;
  }

  /**
   * Pass / Withdraw from auction
   */
  public static passAuction(state: GameState, playerId: string): GameState {
    const newState = this.clone(state);
    const auction = newState.activeAuction;
    if (!auction) return newState;

    auction.activePlayerIds = auction.activePlayerIds.filter(id => id !== playerId);

    const player = newState.players.find(p => p.id === playerId);
    if (player) {
      this.addLog(newState, 'system', `✋ انسحب ${player.name} من المزاد.`, playerId);
    }

    if (auction.activePlayerIds.length <= 1) {
      return this.resolveAuction(newState);
    }

    return newState;
  }

  /**
   * Tick auction timer down by 1 second
   */
  public static tickAuctionTimer(state: GameState): GameState {
    const newState = this.clone(state);
    if (!newState.activeAuction || newState.phase !== 'auction') return newState;

    if (newState.activeAuction.timeLeftSeconds > 1) {
      newState.activeAuction.timeLeftSeconds -= 1;
      return newState;
    } else {
      // Time expired: resolve and conclude auction
      return this.resolveAuction(newState);
    }
  }

  /**
   * Tick regular turn timer down by 1 second
   */
  public static tickTurnTimer(state: GameState): GameState {
    const newState = this.clone(state);
    if (newState.phase === 'game_over' || newState.phase === 'auction') return newState;
    if (newState.settings.turnTimeSeconds <= 0) return newState;

    if (newState.remainingTurnTime > 1) {
      newState.remainingTurnTime -= 1;
      return newState;
    } else {
      newState.remainingTurnTime = 0;
      return this.endTurn(newState);
    }
  }

  /**
   * Resolve and finish auction
   */
  public static resolveAuction(state: GameState): GameState {
    const newState = this.clone(state);
    const auction = newState.activeAuction;
    if (!auction) return newState;

    const tile = BOARD_TILES.find(t => t.id === auction.tileId);
    const winner = auction.highestBidderId ? newState.players.find(p => p.id === auction.highestBidderId) : null;

    if (winner && tile && winner.cash >= auction.currentBid) {
      winner.cash -= auction.currentBid;
      winner.properties.push(auction.tileId);
      winner.stats.propertiesBought += 1;
      this.addLog(newState, 'buy', `🏆 فاز ${winner.name} بالمزاد واشترى (${tile.name}) بمبلغ ${auction.currentBid} $!`, winner.id);
    } else if (tile) {
      this.addLog(newState, 'system', `❌ انتهى المزاد على (${tile.name}) دون مشتري.`);
    }

    newState.activeAuction = null;
    newState.phase = 'idle';
    return newState;
  }

  /**
   * Draw a Chance or Community Chest card
   */
  public static triggerCardDraw(state: GameState, playerId: string, type: 'chance' | 'community'): GameState {
    const newState = this.clone(state);
    const deck = type === 'chance' ? CHANCE_CARDS : COMMUNITY_CARDS;
    const card = deck[Math.floor(Math.random() * deck.length)];

    newState.activeCard = card;
    newState.phase = 'tile_action';

    const player = newState.players.find(p => p.id === playerId);
    this.addLog(newState, 'card', `🎴 سحب ${player?.name} بطاقة (${card.title}): "${card.description}"`, playerId);

    return newState;
  }

  /**
   * Execute action of the active card
   */
  public static executeActiveCard(state: GameState): GameState {
    const newState = this.clone(state);
    const card = newState.activeCard;
    const player = newState.players[newState.currentTurnIndex];

    if (!card || !player) {
      newState.activeCard = null;
      newState.phase = 'idle';
      return newState;
    }

    const { action } = card;

    switch (action.type) {
      case 'receive_cash':
        player.cash += action.amount || 0;
        break;

      case 'pay_cash': {
        const amount = action.amount || 0;
        if (player.cash >= amount) {
          player.cash -= amount;
          if (newState.settings.freeParkingJackpot) newState.freeParkingPool += amount;
        } else {
          return this.handleDebt(newState, player.id, amount);
        }
        break;
      }

      case 'move_to':
        if (action.tileId !== undefined) {
          const oldPos = player.position;
          const target = action.tileId;
          player.position = target;
          if (target < oldPos && target !== 0) {
            player.cash += 200;
            this.addLog(newState, 'rent', `🚀 مر ${player.name} على خانة انطلق واستلم 200!`, player.id);
          }
          newState.activeCard = null;
          return this.handleTileLanding(newState, player.id);
        }
        break;

      case 'move_steps':
        if (action.steps) {
          newState.activeCard = null;
          return this.movePlayer(newState, player.id, action.steps);
        }
        break;

      case 'go_to_jail':
        newState.activeCard = null;
        return this.sendToJail(newState, player.id);

      case 'get_out_of_jail':
        player.getOutOfJailCards += 1;
        break;

      case 'collect_from_all': {
        const amt = action.amount || 10;
        newState.players.forEach(p => {
          if (p.id !== player.id && !p.isBankrupt) {
            const pay = Math.min(p.cash, amt);
            p.cash -= pay;
            player.cash += pay;
          }
        });
        break;
      }

      case 'pay_to_all': {
        const amt = action.amount || 50;
        newState.players.forEach(p => {
          if (p.id !== player.id && !p.isBankrupt) {
            if (player.cash >= amt) {
              player.cash -= amt;
              p.cash += amt;
            }
          }
        });
        break;
      }

      case 'repair_properties': {
        let total = 0;
        Object.entries(player.houses).forEach(([_, count]) => {
          if (count === 5) {
            total += action.hotelCost || 100;
          } else if (count > 0) {
            total += count * (action.houseCost || 25);
          }
        });
        if (player.cash >= total) {
          player.cash -= total;
        } else {
          return this.handleDebt(newState, player.id, total);
        }
        break;
      }

      case 'advance_to_nearest_railroad': {
        const railroads = [5, 15, 25, 35];
        const nextRail = railroads.find(r => r > player.position) ?? 5;
        player.position = nextRail;
        newState.activeCard = null;
        return this.handleTileLanding(newState, player.id);
      }

      case 'advance_to_nearest_utility': {
        const utilities = [12, 28];
        const nextUtil = utilities.find(u => u > player.position) ?? 12;
        player.position = nextUtil;
        newState.activeCard = null;
        return this.handleTileLanding(newState, player.id);
      }
    }

    newState.activeCard = null;
    newState.phase = 'idle';
    return newState;
  }

  /**
   * Send player directly to Jail
   */
  public static sendToJail(state: GameState, playerId: string): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    if (!player) return newState;

    const jailTile = BOARD_TILES.find(t => t.type === 'jail');
    player.position = jailTile ? jailTile.id : 14;
    player.inJail = true;
    player.jailTurns = 0;
    newState.consecutiveDoubles = 0;
    newState.phase = 'idle';
    return newState;
  }

  /**
   * Pay 50 to get out of Jail immediately
   */
  public static payJailBail(state: GameState, playerId: string): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    if (!player || player.cash < 50) return newState;

    player.cash -= 50;
    player.inJail = false;
    player.jailTurns = 0;
    this.addLog(newState, 'jail', `🔓 دفع ${player.name} كفالة 50 وخرج من السجن.`, playerId);
    newState.phase = 'roll_dice';
    return newState;
  }

  /**
   * Use a 'Get Out of Jail Free' card
   */
  public static useJailCard(state: GameState, playerId: string): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    if (!player || player.getOutOfJailCards <= 0) return newState;

    player.getOutOfJailCards -= 1;
    player.inJail = false;
    player.jailTurns = 0;
    this.addLog(newState, 'jail', `📜 استخدم ${player.name} بطاقة عفو ملكي وخرج من السجن مجاناً!`, playerId);
    newState.phase = 'roll_dice';
    return newState;
  }

  /**
   * Build a house or hotel on a property
   */
  public static buildHouse(state: GameState, playerId: string, tileId: number): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);

    if (!player || !tile || !tile.houseCost || player.cash < tile.houseCost) return newState;

    // Check monopoly and even building
    const groupTiles = COLOR_GROUP_TILES[tile.group] || [];
    const ownsAll = groupTiles.every(id => player.properties.includes(id) && !player.mortgaged[id]);
    if (!ownsAll) return newState;

    const currentHouses = player.houses[tileId] || 0;
    if (currentHouses >= 5) return newState; // already hotel

    // Check even building rule
    const minInGroup = Math.min(...groupTiles.map(id => player.houses[id] || 0));
    if (currentHouses > minInGroup) return newState;

    player.cash -= tile.houseCost;
    player.houses[tileId] = currentHouses + 1;

    const isHotel = player.houses[tileId] === 5;
    this.addLog(newState, 'house', `🏗️ بنى ${player.name} ${isHotel ? 'فندقاً فاخراً 🏨' : 'منزلاً 🏠'} على عقار (${tile.name})!`, playerId);

    return newState;
  }

  /**
   * Sell house on property with even selling rule
   */
  public static sellHouse(state: GameState, playerId: string, tileId: number): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);

    if (!player || !tile || !tile.houseCost) return newState;
    const currentHouses = player.houses[tileId] || 0;
    if (currentHouses <= 0) return newState;

    // Check even selling rule: cannot sell from a property if it has fewer houses than other properties in group
    const groupTiles = COLOR_GROUP_TILES[tile.group] || [];
    const maxInGroup = Math.max(...groupTiles.map(id => player.houses[id] || 0));
    if (currentHouses < maxInGroup) return newState;

    const refund = Math.floor(tile.houseCost / 2);
    player.cash += refund;
    player.houses[tileId] = currentHouses - 1;

    this.addLog(newState, 'house', `🔨 باع ${player.name} منزلاً من (${tile.name}) واسترجع ${refund} $.`, playerId);
    return newState;
  }

  /**
   * Build 1 house across all properties in a color group (even building shortcut)
   */
  public static buildGroupHouses(state: GameState, playerId: string, group: string): GameState {
    let currentState = state;
    const groupTiles = COLOR_GROUP_TILES[group] || [];
    if (groupTiles.length === 0) return state;

    for (const tileId of groupTiles) {
      currentState = this.buildHouse(currentState, playerId, tileId);
    }
    return currentState;
  }

  /**
   * Mortgage property for cash
   */
  public static mortgageProperty(state: GameState, playerId: string, tileId: number): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);

    if (!player || !tile || !tile.mortgageValue || player.mortgaged[tileId]) return newState;

    // Cannot mortgage if houses exist in color group
    const groupTiles = COLOR_GROUP_TILES[tile.group] || [];
    const hasHouses = groupTiles.some(id => (player.houses[id] || 0) > 0);
    if (hasHouses) return newState;

    player.mortgaged[tileId] = true;
    player.cash += tile.mortgageValue;

    this.addLog(newState, 'rent', `📜 قام ${player.name} برهن عقار (${tile.name}) وحصل على ${tile.mortgageValue}.`, playerId);
    return newState;
  }

  /**
   * Unmortgage property
   */
  public static unmortgageProperty(state: GameState, playerId: string, tileId: number): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);

    if (!player || !tile || !tile.mortgageValue || !player.mortgaged[tileId]) return newState;

    const cost = Math.floor(tile.mortgageValue * 1.1); // 10% interest
    if (player.cash < cost) return newState;

    player.cash -= cost;
    player.mortgaged[tileId] = false;

    this.addLog(newState, 'buy', `✨ فك ${player.name} رهن عقار (${tile.name}) مقابل ${cost}.`, playerId);
    return newState;
  }

  /**
   * Handle Trade Proposals
   */
  public static proposeTrade(state: GameState, offer: TradeOffer): GameState {
    const newState = this.clone(state);
    newState.activeTrade = offer;
    const fromP = newState.players.find(p => p.id === offer.fromPlayerId);
    const toP = newState.players.find(p => p.id === offer.toPlayerId);

    this.addLog(newState, 'trade', `🤝 قدّم ${fromP?.name} عرض مقايضة وتجارة إلى ${toP?.name}.`, fromP?.id);
    return newState;
  }

  public static respondToTrade(state: GameState, offerId: string, accept: boolean): GameState {
    const newState = this.clone(state);
    const trade = newState.activeTrade;
    if (!trade || trade.id !== offerId) return newState;

    const fromP = newState.players.find(p => p.id === trade.fromPlayerId);
    const toP = newState.players.find(p => p.id === trade.toPlayerId);

    if (!fromP || !toP) {
      newState.activeTrade = null;
      return newState;
    }

    if (accept) {
      // Transfer cash
      if (fromP.cash >= trade.offeredCash && toP.cash >= trade.requestedCash) {
        fromP.cash = fromP.cash - trade.offeredCash + trade.requestedCash;
        toP.cash = toP.cash - trade.requestedCash + trade.offeredCash;

        // Transfer properties
        trade.offeredProperties.forEach(id => {
          fromP.properties = fromP.properties.filter(pId => pId !== id);
          if (!toP.properties.includes(id)) toP.properties.push(id);
        });

        trade.requestedProperties.forEach(id => {
          toP.properties = toP.properties.filter(pId => pId !== id);
          if (!fromP.properties.includes(id)) fromP.properties.push(id);
        });

        this.addLog(newState, 'trade', `✅ تمت الصفقة بنجاح بين ${fromP.name} و ${toP.name}!`);
      } else {
        this.addLog(newState, 'trade', `❌ فشلت الصفقة بسبب نقص السيولة النقدية.`);
      }
    } else {
      this.addLog(newState, 'trade', `❌ رفض ${toP.name} عرض المقايضة.`);
    }

    newState.activeTrade = null;
    return newState;
  }

  /**
   * End current player's turn and pass to next
   */
  public static endTurn(state: GameState): GameState {
    const newState = this.clone(state);
    const activePlayers = newState.players.filter(p => !p.isBankrupt);

    if (activePlayers.length <= 1) {
      return this.checkWinCondition(newState);
    }

    // Check if player had rolled a double and can roll again (max 2 doubles before jail)
    const currentPlayer = newState.players[newState.currentTurnIndex];
    if (newState.dice[0] === newState.dice[1] && newState.consecutiveDoubles > 0 && !currentPlayer.inJail && !currentPlayer.isBankrupt) {
      newState.phase = 'roll_dice';
      newState.hasRolled = false;
      newState.remainingTurnTime = newState.settings.turnTimeSeconds || 60;
      this.addLog(newState, 'system', `🎲 حصل ${currentPlayer.name} على دبل ويستحق رمية نرد إضافية!`, currentPlayer.id);
      return newState;
    }

    // Advance to next active player
    let nextIndex = (newState.currentTurnIndex + 1) % newState.players.length;
    while (newState.players[nextIndex].isBankrupt) {
      nextIndex = (nextIndex + 1) % newState.players.length;
    }

    newState.currentTurnIndex = nextIndex;
    newState.consecutiveDoubles = 0;
    newState.hasRolled = false;
    newState.activeCard = null;
    newState.activeAuction = null;
    newState.pendingBuyTileId = null;
    newState.phase = newState.players[nextIndex].inJail ? 'jail_decision' : 'roll_dice';
    newState.remainingTurnTime = newState.settings.turnTimeSeconds || 60;

    const nextPlayer = newState.players[nextIndex];
    this.addLog(newState, 'system', `👉 انتقل الدور إلى ${nextPlayer.name}.`, nextPlayer.id);

    return newState;
  }

  /**
   * Debt handling
   */
  private static handleDebt(state: GameState, playerId: string, amount: number): GameState {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return state;

    // Check total net worth
    const totalWealth = this.calculateNetWorth(player);
    if (totalWealth < amount) {
      return this.handleBankruptcy(state, playerId);
    } else {
      // Auto mortgage if bot
      if (player.isBot) {
        const toMortgage = AIService.getPropertiesToMortgage(player, amount - player.cash);
        toMortgage.forEach(id => {
          const tile = BOARD_TILES.find(t => t.id === id);
          if (tile && tile.mortgageValue) {
            player.mortgaged[id] = true;
            player.cash += tile.mortgageValue;
          }
        });
        if (player.cash >= amount) {
          player.cash -= amount;
          return state;
        }
      }
      return state;
    }
  }

  private static handleDebtToPlayer(state: GameState, debtorId: string, creditorId: string, amount: number): GameState {
    const debtor = state.players.find(p => p.id === debtorId);
    const creditor = state.players.find(p => p.id === creditorId);
    if (!debtor || !creditor) return state;

    const totalWealth = this.calculateNetWorth(debtor);
    if (totalWealth < amount) {
      return this.handleBankruptcy(state, debtorId, creditorId);
    } else {
      if (debtor.isBot) {
        const toMortgage = AIService.getPropertiesToMortgage(debtor, amount - debtor.cash);
        toMortgage.forEach(id => {
          const tile = BOARD_TILES.find(t => t.id === id);
          if (tile && tile.mortgageValue) {
            debtor.mortgaged[id] = true;
            debtor.cash += tile.mortgageValue;
          }
        });
        const paid = Math.min(debtor.cash, amount);
        debtor.cash -= paid;
        creditor.cash += paid;
      }
      return state;
    }
  }

  /**
   * Declare bankruptcy for a player
   */
  public static handleBankruptcy(state: GameState, playerId: string, creditorId?: string): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    if (!player || player.isBankrupt) return newState;

    if (player.activePerks?.includes('secondChance') && !player.hasUsedRevival) {
      player.hasUsedRevival = true;
      player.cash = Math.max(0, player.cash) + 500;
      this.addLog(newState, 'system', `✨ استخدم ${player.name} بطاقة الفرصة الثانية! نجا من الإفلاس وحصل على 500 كاش.`, player.id);
      return newState;
    }

    player.isBankrupt = true;
    player.cash = 0;

    const creditor = creditorId ? newState.players.find(p => p.id === creditorId) : null;

    if (creditor) {
      // Transfer remaining assets to creditor
      player.properties.forEach(tileId => {
        if (!creditor.properties.includes(tileId)) {
          creditor.properties.push(tileId);
        }
      });
      creditor.getOutOfJailCards += player.getOutOfJailCards;
      this.addLog(newState, 'bankruptcy', `💥 أعلن ${player.name} إفلاسه وتم تحويل جميع ممتلكاته إلى دائنِه ${creditor.name}!`, player.id);
    } else {
      // Return assets to bank
      this.addLog(newState, 'bankruptcy', `💥 أعلن ${player.name} إفلاسه وتمت تصفية ممتلكاته وعودتها للبنك!`, player.id);
    }

    player.properties = [];
    player.houses = {};
    player.mortgaged = {};

    return this.checkWinCondition(newState);
  }

  /**
   * Check if only 1 player remains active
   */
  public static checkWinCondition(state: GameState): GameState {
    const newState = this.clone(state);
    const activePlayers = newState.players.filter(p => !p.isBankrupt);

    if (activePlayers.length === 1) {
      newState.winnerId = activePlayers[0].id;
      newState.phase = 'game_over';
      this.addLog(newState, 'system', `👑 فاز ${activePlayers[0].name} ببطولة أملاك وعقارات وأصبح ملك العقار! 🏆🎉`, activePlayers[0].id);
    }

    return newState;
  }

  public static calculateNetWorth(player: Player): number {
    let worth = player.cash;
    player.properties.forEach(tileId => {
      const tile = BOARD_TILES.find(t => t.id === tileId);
      if (tile && tile.price) {
        worth += player.mortgaged[tileId] ? Math.floor(tile.price / 2) : tile.price;
        const count = player.houses[tileId] || 0;
        if (count > 0 && tile.houseCost) {
          worth += count * tile.houseCost;
        }
      }
    });
    return worth;
  }

  private static addLog(state: GameState, type: GameLog['type'], message: string, playerId?: string) {
    state.logs.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      type,
      message,
      playerId
    });
    if (state.logs.length > 80) state.logs.pop();
    state.version += 1;
  }

  private static clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Add extra time to the current turn (Time Shield)
   */
  public static addTurnTime(state: GameState, seconds: number): GameState {
    const newState = this.clone(state);
    if (newState.phase === 'game_over' || newState.phase === 'auction') return newState;
    
    newState.remainingTurnTime += seconds;
    const player = newState.players[newState.currentTurnIndex];
    if (player) {
      this.addLog(newState, 'system', `⏳ تم شحن وقت إضافي! +${seconds} ثانية لدور ${player.name}.`, player.id);
    }
    return newState;
  }

  /**
   * Grant a Second Chance Revival to a player
   */
  public static grantRevival(state: GameState, playerId: string, amount: number): GameState {
    const newState = this.clone(state);
    const player = newState.players.find(p => p.id === playerId);
    
    if (player && !player.hasUsedRevival) {
      player.hasUsedRevival = true;
      player.cash += amount;
      this.addLog(newState, 'system', `💰 البنك يتدخل! تم منح ${player.name} قرض إنقاذ طارئ بقيمة ${amount} $.`, playerId);
    }
    
    return newState;
  }
}
