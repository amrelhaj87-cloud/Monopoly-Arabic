import { Player, GameState, TileData, TradeOffer } from '../types/game';
import { BOARD_TILES, COLOR_GROUP_TILES } from '../constants/boardData';

export type BotPersonalityType = 
  | 'aggressive_tycoon'   // أبو فهد (الهامور)
  | 'dealmaker_trader'    // شهاب التاجر
  | 'strategic_investor'  // ليلى المستثمرة
  | 'conservative_cautious' // طارق الحذر
  | 'diplomat_collaborator'; // سارة الدبلوماسية

export class AIService {
  /**
   * Resolve specific bot personality from player name or difficulty
   */
  public static getBotPersonality(bot: Player): BotPersonalityType {
    const name = bot.name.toLowerCase();
    if (name.includes('فهد') || name.includes('هامور')) return 'aggressive_tycoon';
    if (name.includes('شهاب') || name.includes('تاجر')) return 'dealmaker_trader';
    if (name.includes('ليلى') || name.includes('مستثمر')) return 'strategic_investor';
    if (name.includes('طارق') || name.includes('حذر')) return 'conservative_cautious';
    if (name.includes('سارة') || name.includes('دبلوماس')) return 'diplomat_collaborator';

    // Fallback based on difficulty
    if (bot.botDifficulty === 'hard') return 'aggressive_tycoon';
    if (bot.botDifficulty === 'easy') return 'conservative_cautious';
    return 'dealmaker_trader';
  }

  /**
   * Decide whether the bot wants to buy the unowned property it landed on
   */
  public static shouldBuyProperty(bot: Player, tile: TileData, state: GameState): boolean {
    if (!tile.price || bot.cash < tile.price) return false;

    const personality = this.getBotPersonality(bot);
    const remainingCash = bot.cash - tile.price;
    const isMonopolyPiece = this.isCompletingMonopoly(bot, tile);

    // If it completes a color set monopoly, almost everyone buys
    if (isMonopolyPiece) {
      if (personality === 'conservative_cautious') {
        return remainingCash >= 30; // Conservative still buys if not totally broke
      }
      return true; // All other personalities buy monopoly piece 100%
    }

    switch (personality) {
      case 'aggressive_tycoon': // أبو فهد (الهامور)
        // Aggressive: Buys almost everything, keeps minimum buffer of 20
        return remainingCash >= 20;

      case 'dealmaker_trader': // شهاب التاجر
        // Loves railroads, utilities, and high-traffic sets (orange, red, yellow)
        if (tile.type === 'railroad' || tile.type === 'utility') return remainingCash >= 40;
        if (['orange', 'red', 'yellow'].includes(tile.group)) return remainingCash >= 50;
        return remainingCash >= 80;

      case 'strategic_investor': // ليلى المستثمرة
        // Strategic: High ROI sets (light blue, orange, red, yellow), maintains 120 buffer
        if (['light_blue', 'orange', 'red'].includes(tile.group)) return remainingCash >= 70;
        return remainingCash >= 130;

      case 'conservative_cautious': // طارق الحذر
        // Cautious: Only buys if wealthy and keeps 220+ cash reserve
        if (tile.price <= 100 && remainingCash >= 120) return true;
        return remainingCash >= 220;

      case 'diplomat_collaborator': // سارة الدبلوماسية
        // Balanced: Standard moderate buffer
        return remainingCash >= 75;

      default:
        return remainingCash >= 100;
    }
  }

  /**
   * Decide action when in Jail (pay bail, use card, roll doubles)
   */
  public static decideJailAction(bot: Player, state?: GameState): 'use_card' | 'pay' | 'roll' {
    if (bot.getOutOfJailCards > 0) return 'use_card';
    
    const personality = this.getBotPersonality(bot);

    // Check board development: are there lots of enemy hotels/houses?
    let enemyHousesCount = 0;
    let unownedPropertiesCount = 0;
    if (state) {
      for (const p of state.players) {
        if (p.id !== bot.id && !p.isBankrupt) {
          enemyHousesCount += Object.values(p.houses).reduce((sum, h) => sum + h, 0);
        }
      }
      unownedPropertiesCount = BOARD_TILES.filter(t => t.price && !state.players.some(p => p.properties.includes(t.id))).length;
    }

    switch (personality) {
      case 'aggressive_tycoon': // أبو فهد: يريد الخروج فوراً للشراء ومواصلة الهجوم
        if (bot.cash >= 50) return 'pay';
        return 'roll';

      case 'conservative_cautious': // طارق: إذا كانت اللوحة مليئة بمباني الخصوم يفضل البقاء في السجن لتفادي الإيجار!
        if (enemyHousesCount >= 6 && unownedPropertiesCount === 0) {
          return 'roll'; // Stay safe in jail!
        }
        if (bot.jailTurns >= 2 && bot.cash >= 50) return 'pay';
        return 'roll';

      case 'strategic_investor': // ليلى: تحسب هل توجد عقارات حرة متبقية
        if (unownedPropertiesCount > 4 && bot.cash >= 150) return 'pay';
        if (enemyHousesCount >= 8) return 'roll'; // Safe inside jail
        if (bot.jailTurns >= 2 && bot.cash >= 50) return 'pay';
        return 'roll';

      default:
        if (bot.jailTurns >= 2 && bot.cash >= 50) return 'pay';
        if (bot.cash >= 500) return 'pay';
        return 'roll';
    }
  }

  /**
   * Decide next bid in an active auction
   */
  public static decideAuctionBid(bot: Player, tileId: number, currentBid: number): number | null {
    const tile = BOARD_TILES.find(t => t.id === tileId);
    if (!tile || !tile.price) return null;

    const personality = this.getBotPersonality(bot);
    const completesMonopoly = this.isCompletingMonopoly(bot, tile);

    let maxMultiplier = 1.0;
    let minCashBuffer = 60;

    switch (personality) {
      case 'aggressive_tycoon': // يزايد بشراسة
        maxMultiplier = completesMonopoly ? 1.8 : 1.35;
        minCashBuffer = 30;
        break;

      case 'dealmaker_trader': // يزايد باعتدال
        maxMultiplier = completesMonopoly ? 1.5 : 1.15;
        minCashBuffer = 60;
        break;

      case 'strategic_investor': // حسابات دقيقة
        maxMultiplier = completesMonopoly ? 1.4 : 1.05;
        minCashBuffer = 100;
        break;

      case 'conservative_cautious': // لا يزايد إلا بخصم كبير
        maxMultiplier = completesMonopoly ? 1.1 : 0.85;
        minCashBuffer = 180;
        break;

      case 'diplomat_collaborator':
        maxMultiplier = completesMonopoly ? 1.3 : 1.0;
        minCashBuffer = 70;
        break;
    }

    const maxValuation = Math.floor(tile.price * maxMultiplier);
    const maxAffordable = Math.min(bot.cash - minCashBuffer, maxValuation);

    const minNextBid = currentBid + 10;
    if (minNextBid <= maxAffordable && minNextBid < bot.cash) {
      return minNextBid;
    }
    return null; // Fold / pass
  }

  /**
   * Check if bot can and should build houses/hotels
   */
  public static getHousesToBuild(bot: Player): { tileId: number; count: number }[] {
    const builds: { tileId: number; count: number }[] = [];
    const personality = this.getBotPersonality(bot);

    // Reserve buffer based on personality
    let reserveBuffer = 150;
    let maxTargetHouses = 5; // Hotel

    switch (personality) {
      case 'aggressive_tycoon': // يبني حتى الفندق بسرعة وباحتياطي منخفض
        reserveBuffer = 40;
        maxTargetHouses = 5;
        break;

      case 'strategic_investor': // ليلى: تركز على 3 منازل (أعلى نقطة عائد استثماري)
        reserveBuffer = 150;
        maxTargetHouses = 3;
        break;

      case 'conservative_cautious': // حذر جداً: لا يبني إلا إذا توفرت سيولة ضخمة
        reserveBuffer = 300;
        maxTargetHouses = 3;
        break;

      case 'dealmaker_trader':
      case 'diplomat_collaborator':
        reserveBuffer = 120;
        maxTargetHouses = 4;
        break;
    }

    let availableCash = bot.cash - reserveBuffer;

    for (const [groupName, tileIds] of Object.entries(COLOR_GROUP_TILES)) {
      if (groupName === 'railroad' || groupName === 'utility') continue;

      // Check if bot owns all tiles in this group and none are mortgaged
      const ownsAll = tileIds.every(id => bot.properties.includes(id) && !bot.mortgaged[id]);
      if (!ownsAll) continue;

      const firstTile = BOARD_TILES.find(t => t.id === tileIds[0]);
      if (!firstTile || !firstTile.houseCost) continue;

      const cost = firstTile.houseCost;

      // Build houses evenly
      let canBuildMore = true;
      while (canBuildMore && availableCash >= cost) {
        let minHouses = maxTargetHouses;
        let targetTileId = -1;

        for (const id of tileIds) {
          const count = bot.houses[id] || 0;
          if (count < maxTargetHouses && count < minHouses) {
            minHouses = count;
            targetTileId = id;
          }
        }

        if (targetTileId !== -1 && minHouses < maxTargetHouses && availableCash >= cost) {
          builds.push({ tileId: targetTileId, count: 1 });
          availableCash -= cost;
        } else {
          canBuildMore = false;
        }
      }
    }

    return builds;
  }

  /**
   * Decide which properties to mortgage when needing emergency cash
   */
  public static getPropertiesToMortgage(bot: Player, neededAmount: number): number[] {
    const toMortgage: number[] = [];
    let raised = 0;

    // Prioritize non-monopoly single properties, sorted by lowest value
    const unmortgaged = bot.properties.filter(id => !bot.mortgaged[id]);
    
    // Don't mortgage monopoly tiles if single tiles are available
    const singleTiles = unmortgaged.filter(id => {
      const tile = BOARD_TILES.find(t => t.id === id);
      if (!tile) return false;
      const groupIds = COLOR_GROUP_TILES[tile.group] || [];
      return !groupIds.every(gid => bot.properties.includes(gid));
    });

    for (const id of [...singleTiles, ...unmortgaged]) {
      if (raised >= neededAmount) break;
      if (toMortgage.includes(id)) continue;

      const tile = BOARD_TILES.find(t => t.id === id);
      if (tile && tile.mortgageValue) {
        toMortgage.push(id);
        raised += tile.mortgageValue;
      }
    }

    return toMortgage;
  }

  /**
   * Check if bot has surplus cash to unmortgage properties and collect rent again
   */
  public static getPropertiesToUnmortgage(bot: Player): number[] {
    const toUnmortgage: number[] = [];
    const personality = this.getBotPersonality(bot);
    const reserve = personality === 'aggressive_tycoon' ? 80 : personality === 'conservative_cautious' ? 300 : 180;

    let availableCash = bot.cash - reserve;
    const mortgaged = bot.properties.filter(id => bot.mortgaged[id]);

    for (const id of mortgaged) {
      const tile = BOARD_TILES.find(t => t.id === id);
      if (!tile || !tile.mortgageValue) continue;
      const cost = Math.floor(tile.mortgageValue * 1.1);
      if (availableCash >= cost) {
        toUnmortgage.push(id);
        availableCash -= cost;
      }
    }
    return toUnmortgage;
  }

  /**
   * Evaluate a trade offer sent to the bot
   */
  public static evaluateTradeOffer(bot: Player, offer: TradeOffer, state: GameState): boolean {
    const personality = this.getBotPersonality(bot);
    let offeredValue = offer.offeredCash;
    let requestedValue = offer.requestedCash;

    for (const tileId of offer.offeredProperties) {
      const tile = BOARD_TILES.find(t => t.id === tileId);
      if (tile && tile.price) {
        let val = tile.price;
        if (this.isCompletingMonopolyWithTile(bot, tileId)) val *= 3.2; // Huge bonus for completing set
        offeredValue += val;
      }
    }

    for (const tileId of offer.requestedProperties) {
      const tile = BOARD_TILES.find(t => t.id === tileId);
      if (tile && tile.price) {
        let val = tile.price;
        if (this.isBreakingMonopoly(bot, tileId)) val *= 3.8; // Never break monopoly easily
        requestedValue += val;
      }
    }

    // Acceptance ratio based on personality
    let requiredRatio = 1.1; // Default
    switch (personality) {
      case 'diplomat_collaborator': // سارة: تقبل الصفقات العادلة (0.95 متكافئة)
        requiredRatio = 0.95;
        break;
      case 'dealmaker_trader': // شهاب: يقبل التبادل المتوازن
        requiredRatio = 1.05;
        break;
      case 'strategic_investor': // ليلى: تشترط ربحاً واضحاً
        requiredRatio = 1.2;
        break;
      case 'aggressive_tycoon': // أبو فهد: يرفض إلا إذا كانت لصالحه بشدة
        requiredRatio = 1.25;
        break;
      case 'conservative_cautious': // طارق: يشكك في الصفقات
        requiredRatio = 1.35;
        break;
    }

    return offeredValue >= requestedValue * requiredRatio;
  }

  private static isCompletingMonopoly(player: Player, tile: TileData): boolean {
    const groupTiles = COLOR_GROUP_TILES[tile.group];
    if (!groupTiles || groupTiles.length <= 1) return false;

    const ownedInGroup = groupTiles.filter(id => id !== tile.id && player.properties.includes(id));
    return ownedInGroup.length === groupTiles.length - 1;
  }

  private static isCompletingMonopolyWithTile(player: Player, tileId: number): boolean {
    const tile = BOARD_TILES.find(t => t.id === tileId);
    if (!tile) return false;
    return this.isCompletingMonopoly(player, tile);
  }

  private static isBreakingMonopoly(player: Player, tileId: number): boolean {
    const tile = BOARD_TILES.find(t => t.id === tileId);
    if (!tile) return false;
    const groupTiles = COLOR_GROUP_TILES[tile.group];
    if (!groupTiles) return false;
    return groupTiles.every(id => player.properties.includes(id));
  }
}
