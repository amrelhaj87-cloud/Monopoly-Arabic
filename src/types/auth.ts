import { PlayerTokenId } from './game';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL: string | null;
  isGuest: boolean;
  selectedToken: PlayerTokenId;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    highestNetWorth: number;
    propertiesMonopolized: number;
  };
  createdAt: number;
  updatedAt: number;
}

export interface FirebaseConfigOptions {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}
