import { GameSettings, PlayerTokenId, GameState } from './game';

export interface RoomMember {
  id: string;
  name: string;
  avatar: string;
  token: PlayerTokenId;
  color: string;
  isHost: boolean;
  isReady: boolean;
  isBot: boolean;
  botDifficulty?: 'easy' | 'medium' | 'hard';
  startingCashOverride?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface Room {
  id: string; // 6-digit uppercase code e.g. ARB-892 or 654321
  hostId: string;
  status: 'waiting' | 'in_game' | 'finished';
  members: RoomMember[];
  settings: GameSettings;
  createdAt: number;
  gameState?: GameState;
  messages: ChatMessage[];
}
