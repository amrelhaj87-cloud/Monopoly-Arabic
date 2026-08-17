export type TileGroup = 
  | 'brown' 
  | 'light_blue' 
  | 'pink' 
  | 'orange' 
  | 'red' 
  | 'yellow' 
  | 'green' 
  | 'dark_blue' 
  | 'railroad' 
  | 'utility' 
  | 'special';

export type TileType = 
  | 'property' 
  | 'railroad' 
  | 'utility' 
  | 'chance' 
  | 'community' 
  | 'tax' 
  | 'go' 
  | 'jail' 
  | 'free_parking' 
  | 'go_to_jail';

export interface TileData {
  id: number;
  name: string;
  englishName?: string;
  type: TileType;
  group: TileGroup;
  price?: number;
  baseRent?: number;
  rentTiers?: [number, number, number, number, number, number]; // [Base, 1 House, 2 Houses, 3 Houses, 4 Houses, Hotel]
  houseCost?: number;
  mortgageValue?: number;
  taxAmount?: number;
  icon?: string;
  description?: string;
}

export type PlayerTokenId = 'car' | 'falcon' | 'camel' | 'dallah' | 'dhow' | 'ring' | 'castle' | 'crown';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  token: PlayerTokenId;
  color: string;
  isBot: boolean;
  botDifficulty?: 'easy' | 'medium' | 'hard';
  cash: number;
  position: number;
  inJail: boolean;
  jailTurns: number;
  getOutOfJailCards: number;
  isBankrupt: boolean;
  properties: number[]; // Tile IDs
  houses: { [tileId: number]: number }; // 1-4: houses, 5: hotel
  mortgaged: { [tileId: number]: boolean };
  stats: {
    totalRentCollected: number;
    totalRentPaid: number;
    propertiesBought: number;
    doublesRolled: number;
  };
}

export interface Card {
  id: string;
  type: 'chance' | 'community';
  title: string;
  description: string;
  icon: string;
  action: {
    type: 
      | 'receive_cash' 
      | 'pay_cash' 
      | 'move_to' 
      | 'move_steps' 
      | 'go_to_jail' 
      | 'get_out_of_jail' 
      | 'collect_from_all' 
      | 'pay_to_all' 
      | 'repair_properties'
      | 'advance_to_nearest_railroad'
      | 'advance_to_nearest_utility';
    amount?: number;
    tileId?: number;
    steps?: number;
    houseCost?: number;
    hotelCost?: number;
  };
}

export type GamePhase = 
  | 'idle' 
  | 'roll_dice' 
  | 'moving' 
  | 'tile_action' 
  | 'auction' 
  | 'trade' 
  | 'jail_decision' 
  | 'game_over';

export interface TradeOffer {
  id: string;
  fromPlayerId: string;
  toPlayerId: string;
  offeredCash: number;
  offeredProperties: number[]; // Tile IDs
  requestedCash: number;
  requestedProperties: number[]; // Tile IDs
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
}

export interface AuctionState {
  tileId: number;
  currentBid: number;
  highestBidderId: string | null;
  activePlayerIds: string[];
  currentTurnIndex: number;
  timeLeftSeconds: number;
}

export interface GameSettings {
  startingCash: number;
  maxPlayers: number;
  turnTimeSeconds: number; // 0 for unlimited
  enableTrading: boolean;
  enableAuctions: boolean;
  doubleCashOnGoLanding: boolean; // House rule: 400 if landed directly on GO
  freeParkingJackpot: boolean; // Taxes pooled in Free Parking
  quickMode: boolean; // Random properties dealt at start
}

export interface GameLog {
  id: string;
  timestamp: number;
  type: 'system' | 'roll' | 'buy' | 'rent' | 'card' | 'jail' | 'trade' | 'bankruptcy' | 'house';
  playerId?: string;
  message: string;
  extra?: any;
}

export interface GameState {
  roomId: string;
  players: Player[];
  currentTurnIndex: number;
  phase: GamePhase;
  dice: [number, number];
  consecutiveDoubles: number;
  hasRolled: boolean;
  remainingTurnTime: number;
  freeParkingPool: number;
  activeCard: Card | null;
  activeAuction: AuctionState | null;
  activeTrade: TradeOffer | null;
  pendingBuyTileId: number | null;
  winnerId: string | null;
  logs: GameLog[];
  settings: GameSettings;
  isPaused: boolean;
  version: number; // for sync detection
}
