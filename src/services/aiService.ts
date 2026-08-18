import { Player, GameState, TileData, TradeOffer } from '../types/game';
import { BOARD_TILES, COLOR_GROUP_TILES } from '../constants/boardData';

export class AIService {
  /**
   * Decide whether the bot wants to buy the unowned property it landed on
   */
  public static shouldBuyProperty(bot: Player, tile: TileData, state: GameState): boolean {
    if (!tile.price || bot.cash < tile.price) return false;

    const remainingCash = bot.cash - tile.price;
    const isMonopolyPiece = this.isCompletingMonopoly(bot, tile);

    // If it completes a color group, almost always buy!
    if (isMonopolyPiece) return true;

    // Based on difficulty & personality
    const minReserve = bot.botDifficulty === 'easy' ? 50 : bot.botDifficulty === 'medium' ? 120 : 180;
    
    // Always buy cheap properties if reserve is safe
    if (tile.price <= 140 && remainingCash >= 50) return true;

    // For expensive properties, ensure reserve cash
    if (remainingCash >= minReserve) return true;

    return remainingCash > 50 && Math.random() > 0.3;
  }

  /**
   * Decide action when in Jail (pay bail, use card, roll doubles)
   */
  public static decideJailAction(bot: Player): 'use_card' | 'pay' | 'roll' {
    if (bot.getOutOfJailCards > 0) return 'use_card';
    
    // If rich or late turns in jail, pay 50
    if (bot.jailTurns >= 2 && bot.cash >= 50) return 'pay';
    if (bot.cash >= 600) return 'pay';

    return 'roll';
  }

  /**
   * Decide next bid in an active auction
   */
  public static decideAuctionBid(bot: Player, tileId: number, currentBid: number): number | null {
    const tile = BOARD_TILES.find(t => t.id === tileId);
    if (!tile || !tile.price) return null;

    const completesMonopoly = this.isCompletingMonopoly(bot, tile);
    const maxValuation = completesMonopoly ? tile.price * 1.5 : tile.price * 1.1;
    const maxAffordable = Math.min(bot.cash - 50, maxValuation);

    const minNextBid = currentBid + 10;
    if (minNextBid <= maxAffordable && minNextBid < bot.cash) {
      return minNextBid;
    }
    return null; // Pass / fold
  }

  /**
   * Check if bot can and should build houses/hotels
   */
  public static getHousesToBuild(bot: Player): { tileId: number; count: number }[] {
    const builds: { tileId: number; count: number }[] = [];
    let availableCash = bot.cash - 200; // Keep reserve

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
        let minHouses = 5;
        let targetTileId = -1;

        for (const id of tileIds) {
          const count = bot.houses[id] || 0;
          if (count < 5 && count < minHouses) {
            minHouses = count;
            targetTileId = id;
          }
        }

        if (targetTileId !== -1 && minHouses < 5 && availableCash >= cost) {
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
    let availableCash = bot.cash - 250; // Keep safe reserve
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
    let offeredValue = offer.offeredCash;
    let requestedValue = offer.requestedCash;

    for (const tileId of offer.offeredProperties) {
      const tile = BOARD_TILES.find(t => t.id === tileId);
      if (tile && tile.price) {
        let val = tile.price;
        if (this.isCompletingMonopolyWithTile(bot, tileId)) val *= 3; // Huge bonus
        offeredValue += val;
      }
    }

    for (const tileId of offer.requestedProperties) {
      const tile = BOARD_TILES.find(t => t.id === tileId);
      if (tile && tile.price) {
        let val = tile.price;
        if (this.isBreakingMonopoly(bot, tileId)) val *= 3.5; // Do not break monopoly easily!
        requestedValue += val;
      }
    }

    return offeredValue >= requestedValue * 1.1; // Accept if profitable
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
