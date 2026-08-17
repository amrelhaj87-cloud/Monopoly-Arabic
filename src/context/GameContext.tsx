import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Player, TileData, TradeOffer, GameSettings, PlayerTokenId } from '../types/game';
import { Room, RoomMember } from '../types/room';
import { GameEngine } from '../services/gameEngine';
import { RoomService } from '../services/roomService';
import { AIService } from '../services/aiService';
import { audioService } from '../services/audioService';
import { BOARD_TILES } from '../constants/boardData';
import { useAuth } from './AuthContext';

interface GameContextType {
  room: Room | null;
  gameState: GameState | null;
  isHost: boolean;
  isMyTurn: boolean;
  currentPlayer: Player | null;
  myPlayer: Player | null;
  selectedTileDetail: TileData | null;
  setSelectedTileDetail: (tile: TileData | null) => void;
  // Room Actions
  createRoom: (settings: GameSettings) => Promise<Room>;
  joinRoom: (roomId: string) => Promise<Room>;
  leaveRoom: () => void;
  toggleReady: () => Promise<void>;
  addBotToRoom: (difficulty: 'easy' | 'medium' | 'hard') => Promise<void>;
  removeMemberFromRoom: (memberId: string) => Promise<void>;
  updateCustomization: (token: PlayerTokenId, color: string) => Promise<void>;
  sendChatMessage: (text: string) => Promise<void>;
  startRoomGame: () => Promise<void>;
  startSinglePlayerGame: (botCount: number, botDifficulty: 'easy' | 'medium' | 'hard', settings: GameSettings) => void;
  // Game In-Play Actions
  rollDice: () => void;
  buyCurrentProperty: () => void;
  declineCurrentProperty: () => void;
  placeBid: (amount: number) => void;
  passBid: () => void;
  executeActiveCardAction: () => void;
  payJailBail: () => void;
  useJailCard: () => void;
  buildHouseOnTile: (tileId: number) => void;
  sellHouseOnTile: (tileId: number) => void;
  mortgageTile: (tileId: number) => void;
  unmortgageTile: (tileId: number) => void;
  proposeTrade: (offer: TradeOffer) => void;
  respondToTrade: (offerId: string, accept: boolean) => void;
  endCurrentTurn: () => void;
  declareBankruptcy: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserStats } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedTileDetail, setSelectedTileDetail] = useState<TileData | null>(null);

  const botActionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const turnTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to Room updates
  useEffect(() => {
    if (!room?.id) return;

    const unsub = RoomService.subscribeToRoom(room.id, (updatedRoom) => {
      setRoom(updatedRoom);
      if (updatedRoom.gameState) {
        setGameState(updatedRoom.gameState);
      }
    });

    return () => unsub();
  }, [room?.id]);

  const isHost = Boolean(room && user && room.hostId === user.uid);
  const currentPlayer = gameState ? gameState.players[gameState.currentTurnIndex] : null;
  const myPlayer = gameState && user ? gameState.players.find(p => p.id === user.uid) || null : null;
  const isMyTurn = Boolean(gameState && currentPlayer && user && currentPlayer.id === user.uid && !currentPlayer.isBot);

  // Helper to apply and broadcast game state
  const updateAndBroadcastState = useCallback(async (newState: GameState) => {
    setGameState(newState);
    if (room) {
      await RoomService.syncGameState(room.id, newState);
    }
  }, [room]);

  // Handle Game Over stats
  useEffect(() => {
    if (gameState?.phase === 'game_over' && gameState.winnerId && user) {
      audioService.playVictory();
      const isWinner = gameState.winnerId === user.uid;
      const myP = gameState.players.find(p => p.id === user.uid);
      const netWorth = myP ? GameEngine.calculateNetWorth(myP) : 0;
      updateUserStats(isWinner, netWorth, myP?.properties.length || 0);
    }
  }, [gameState?.phase, gameState?.winnerId]);

  // Automated Turn Timer Countdown
  useEffect(() => {
    if (!gameState || gameState.phase === 'game_over' || gameState.isPaused) return;
    if (gameState.settings.turnTimeSeconds === 0) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        if (!prev || prev.phase === 'game_over' || prev.remainingTurnTime <= 0) return prev;
        const newTime = prev.remainingTurnTime - 1;
        if (newTime <= 0) {
          // Time expired, auto end turn or pass
          if (prev.phase === 'auction') {
            const passedState = GameEngine.passAuction(prev, prev.players[prev.currentTurnIndex].id);
            if (room) RoomService.syncGameState(room.id, passedState);
            return passedState;
          } else if (prev.phase === 'tile_action' && prev.pendingBuyTileId) {
            const declined = GameEngine.declineProperty(prev, prev.pendingBuyTileId);
            if (room) RoomService.syncGameState(room.id, declined);
            return declined;
          } else {
            const ended = GameEngine.endTurn(prev);
            if (room) RoomService.syncGameState(room.id, ended);
            return ended;
          }
        }
        return { ...prev, remainingTurnTime: newTime };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState?.currentTurnIndex, gameState?.phase, room]);

  // Automated AI Bot Loop
  useEffect(() => {
    if (!gameState || gameState.phase === 'game_over' || !currentPlayer?.isBot) return;

    if (botActionTimeoutRef.current) clearTimeout(botActionTimeoutRef.current);

    botActionTimeoutRef.current = setTimeout(() => {
      handleBotTurnStep();
    }, 1200);

    return () => {
      if (botActionTimeoutRef.current) clearTimeout(botActionTimeoutRef.current);
    };
  }, [gameState?.phase, gameState?.currentTurnIndex, gameState?.hasRolled, gameState?.pendingBuyTileId, gameState?.activeAuction]);

  const handleBotTurnStep = () => {
    if (!gameState || !currentPlayer || !currentPlayer.isBot) return;

    // 1. In Jail
    if (currentPlayer.inJail && gameState.phase === 'jail_decision') {
      const decision = AIService.decideJailAction(currentPlayer);
      if (decision === 'use_card' && currentPlayer.getOutOfJailCards > 0) {
        audioService.playCardDraw();
        const s = GameEngine.useJailCard(gameState, currentPlayer.id);
        updateAndBroadcastState(s);
      } else if (decision === 'pay' && currentPlayer.cash >= 50) {
        audioService.playCash();
        const s = GameEngine.payJailBail(gameState, currentPlayer.id);
        updateAndBroadcastState(s);
      } else {
        // Roll to escape
        audioService.playDiceRoll();
        const s = GameEngine.rollDice(gameState);
        updateAndBroadcastState(s);
      }
      return;
    }

    // 2. Needs to Roll
    if (gameState.phase === 'roll_dice' && !gameState.hasRolled) {
      audioService.playDiceRoll();
      const s = GameEngine.rollDice(gameState);
      updateAndBroadcastState(s);
      return;
    }

    // 3. Landed on Unowned Property
    if (gameState.phase === 'tile_action' && gameState.pendingBuyTileId !== null) {
      const tile = BOARD_TILES.find(t => t.id === gameState.pendingBuyTileId);
      if (tile) {
        const wantsToBuy = AIService.shouldBuyProperty(currentPlayer, tile, gameState);
        if (wantsToBuy) {
          audioService.playPropertyBuy();
          const s = GameEngine.buyProperty(gameState, currentPlayer.id, tile.id);
          updateAndBroadcastState(s);
        } else {
          const s = GameEngine.declineProperty(gameState, tile.id);
          updateAndBroadcastState(s);
        }
      }
      return;
    }

    // 4. In Auction
    if (gameState.phase === 'auction' && gameState.activeAuction) {
      const bid = AIService.decideAuctionBid(currentPlayer, gameState.activeAuction.tileId, gameState.activeAuction.currentBid);
      if (bid !== null) {
        audioService.playBid();
        const s = GameEngine.placeAuctionBid(gameState, currentPlayer.id, bid);
        updateAndBroadcastState(s);
      } else {
        const s = GameEngine.passAuction(gameState, currentPlayer.id);
        updateAndBroadcastState(s);
      }
      return;
    }

    // 5. Active Card Draw
    if (gameState.phase === 'tile_action' && gameState.activeCard) {
      audioService.playCardDraw();
      const s = GameEngine.executeActiveCard(gameState);
      updateAndBroadcastState(s);
      return;
    }

    // 6. Idle Phase: Build houses if possible & End turn
    if (gameState.phase === 'idle') {
      const builds = AIService.getHousesToBuild(currentPlayer);
      if (builds.length > 0) {
        audioService.playBuildHouse();
        let currState = gameState;
        builds.forEach(b => {
          currState = GameEngine.buildHouse(currState, currentPlayer.id, b.tileId);
        });
        const endedState = GameEngine.endTurn(currState);
        updateAndBroadcastState(endedState);
      } else {
        const s = GameEngine.endTurn(gameState);
        updateAndBroadcastState(s);
      }
    }
  };

  // --- Room Operations ---

  const createRoom = async (settings: GameSettings): Promise<Room> => {
    if (!user) throw new Error('يجب اختيار اسم المستخدم أولاً');
    const hostMember: RoomMember = {
      id: user.uid,
      name: user.displayName,
      avatar: user.photoURL || '👳‍♂️',
      token: user.selectedToken || 'falcon',
      color: '#3b82f6',
      isHost: true,
      isReady: true,
      isBot: false
    };
    const newRoom = await RoomService.createRoom(hostMember, settings);
    setRoom(newRoom);
    return newRoom;
  };

  const joinRoom = async (roomId: string): Promise<Room> => {
    if (!user) throw new Error('يجب اختيار اسم المستخدم أولاً');
    const member: RoomMember = {
      id: user.uid,
      name: user.displayName,
      avatar: user.photoURL || '🤵',
      token: user.selectedToken || 'car',
      color: '#ef4444',
      isHost: false,
      isReady: false,
      isBot: false
    };
    const updatedRoom = await RoomService.joinRoom(roomId, member);
    setRoom(updatedRoom);
    return updatedRoom;
  };

  const leaveRoom = () => {
    if (room && user) {
      RoomService.removeMember(room.id, user.uid);
    }
    setRoom(null);
    setGameState(null);
  };

  const toggleReady = async () => {
    if (room && user) {
      const updated = await RoomService.toggleReady(room.id, user.uid);
      setRoom(updated);
    }
  };

  const addBotToRoom = async (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!room) return;
    const botIndex = room.members.filter(m => m.isBot).length + 1;
    const botNames = ['أبو فهد (الهامور)', 'شهاب التاجر', 'ليلى المستثمرة', 'طارق الحذر', 'سارة الدبلوماسية', 'سلطان القلعة'];
    const botAvatars = ['👳‍♂️', '🤵', '👩‍💼', '🕵️‍♂️', '🧕', '🤴'];
    const botTokens: PlayerTokenId[] = ['falcon', 'car', 'ring', 'camel', 'dallah', 'crown'];
    const botColors = ['#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

    const name = botNames[botIndex % botNames.length];
    const botMember: RoomMember = {
      id: `bot_${Date.now()}_${botIndex}`,
      name,
      avatar: botAvatars[botIndex % botAvatars.length],
      token: botTokens[botIndex % botTokens.length],
      color: botColors[botIndex % botColors.length],
      isHost: false,
      isReady: true,
      isBot: true,
      botDifficulty: difficulty
    };

    const updated = await RoomService.addBot(room.id, botMember);
    setRoom(updated);
  };

  const removeMemberFromRoom = async (memberId: string) => {
    if (room) {
      const updated = await RoomService.removeMember(room.id, memberId);
      setRoom(updated);
    }
  };

  const updateCustomization = async (token: PlayerTokenId, color: string) => {
    if (room && user) {
      const updated = await RoomService.updateMemberCustomization(room.id, user.uid, token, color);
      setRoom(updated);
    }
  };

  const sendChatMessage = async (text: string) => {
    if (room && user && text.trim()) {
      await RoomService.sendMessage(room.id, user.uid, user.displayName, text.trim());
    }
  };

  const startRoomGame = async () => {
    if (!room || room.members.length < 1) return;
    const initialGameState = GameEngine.createInitialGameState(room.id, room.members, room.settings);
    audioService.playCash();
    await updateAndBroadcastState(initialGameState);
  };

  const startSinglePlayerGame = (botCount: number, botDifficulty: 'easy' | 'medium' | 'hard', settings: GameSettings) => {
    const hostUser = user || {
      uid: 'player_local_1',
      displayName: 'أنت',
      photoURL: '👳‍♂️',
      selectedToken: 'falcon'
    };

    const members: RoomMember[] = [
      {
        id: hostUser.uid,
        name: hostUser.displayName,
        avatar: hostUser.photoURL || '👳‍♂️',
        token: (hostUser.selectedToken as PlayerTokenId) || 'falcon',
        color: '#3b82f6',
        isHost: true,
        isReady: true,
        isBot: false
      }
    ];

    const botProfiles = [
      { name: 'أبو فهد (الهامور)', avatar: '👳‍♂️', token: 'falcon', color: '#ef4444' },
      { name: 'شهاب التاجر', avatar: '🤵', token: 'car', color: '#10b981' },
      { name: 'ليلى المستثمرة', avatar: '👩‍💼', token: 'ring', color: '#f59e0b' },
      { name: 'طارق الحذر', avatar: '🕵️‍♂️', token: 'camel', color: '#8b5cf6' },
      { name: 'سارة الدبلوماسية', avatar: '🧕', token: 'dallah', color: '#ec4899' }
    ];

    for (let i = 0; i < botCount; i++) {
      const p = botProfiles[i % botProfiles.length];
      members.push({
        id: `bot_solo_${i + 1}`,
        name: p.name,
        avatar: p.avatar,
        token: p.token as PlayerTokenId,
        color: p.color,
        isHost: false,
        isReady: true,
        isBot: true,
        botDifficulty
      });
    }

    const roomId = 'SOLO-' + Math.floor(1000 + Math.random() * 9000);
    const soloRoom: Room = {
      id: roomId,
      hostId: hostUser.uid,
      status: 'in_game',
      members,
      settings,
      createdAt: Date.now(),
      messages: []
    };

    const initial = GameEngine.createInitialGameState(roomId, members, settings);
    soloRoom.gameState = initial;
    setRoom(soloRoom);
    setGameState(initial);
    audioService.playCash();
  };

  // --- In-Game Player Actions ---

  const rollDice = () => {
    if (!gameState || !isMyTurn || gameState.hasRolled) return;
    audioService.playDiceRoll();
    const newState = GameEngine.rollDice(gameState);
    updateAndBroadcastState(newState);
  };

  const buyCurrentProperty = () => {
    if (!gameState || !myPlayer || gameState.pendingBuyTileId === null) return;
    audioService.playPropertyBuy();
    const newState = GameEngine.buyProperty(gameState, myPlayer.id, gameState.pendingBuyTileId);
    updateAndBroadcastState(newState);
  };

  const declineCurrentProperty = () => {
    if (!gameState || gameState.pendingBuyTileId === null) return;
    const newState = GameEngine.declineProperty(gameState, gameState.pendingBuyTileId);
    updateAndBroadcastState(newState);
  };

  const placeBid = (amount: number) => {
    if (!gameState || !user) return;
    audioService.playBid();
    const newState = GameEngine.placeAuctionBid(gameState, user.uid, amount);
    updateAndBroadcastState(newState);
  };

  const passBid = () => {
    if (!gameState || !user) return;
    const newState = GameEngine.passAuction(gameState, user.uid);
    updateAndBroadcastState(newState);
  };

  const executeActiveCardAction = () => {
    if (!gameState) return;
    audioService.playCardDraw();
    const newState = GameEngine.executeActiveCard(gameState);
    updateAndBroadcastState(newState);
  };

  const payJailBail = () => {
    if (!gameState || !myPlayer) return;
    audioService.playCash();
    const newState = GameEngine.payJailBail(gameState, myPlayer.id);
    updateAndBroadcastState(newState);
  };

  const useJailCard = () => {
    if (!gameState || !myPlayer) return;
    audioService.playCardDraw();
    const newState = GameEngine.useJailCard(gameState, myPlayer.id);
    updateAndBroadcastState(newState);
  };

  const buildHouseOnTile = (tileId: number) => {
    if (!gameState || !myPlayer) return;
    audioService.playBuildHouse();
    const newState = GameEngine.buildHouse(gameState, myPlayer.id, tileId);
    updateAndBroadcastState(newState);
  };

  const sellHouseOnTile = (tileId: number) => {
    if (!gameState || !myPlayer) return;
    audioService.playCash();
    const newState = GameEngine.sellHouse(gameState, myPlayer.id, tileId);
    updateAndBroadcastState(newState);
  };

  const mortgageTile = (tileId: number) => {
    if (!gameState || !myPlayer) return;
    audioService.playCash();
    const newState = GameEngine.mortgageProperty(gameState, myPlayer.id, tileId);
    updateAndBroadcastState(newState);
  };

  const unmortgageTile = (tileId: number) => {
    if (!gameState || !myPlayer) return;
    audioService.playPropertyBuy();
    const newState = GameEngine.unmortgageProperty(gameState, myPlayer.id, tileId);
    updateAndBroadcastState(newState);
  };

  const proposeTrade = (offer: TradeOffer) => {
    if (!gameState) return;
    audioService.playClick();
    const newState = GameEngine.proposeTrade(gameState, offer);
    updateAndBroadcastState(newState);
  };

  const respondToTrade = (offerId: string, accept: boolean) => {
    if (!gameState) return;
    if (accept) audioService.playCash();
    const newState = GameEngine.respondToTrade(gameState, offerId, accept);
    updateAndBroadcastState(newState);
  };

  const endCurrentTurn = () => {
    if (!gameState || !isMyTurn) return;
    audioService.playClick();
    const newState = GameEngine.endTurn(gameState);
    updateAndBroadcastState(newState);
  };

  const declareBankruptcy = () => {
    if (!gameState || !myPlayer) return;
    audioService.playJail();
    const newState = GameEngine.handleBankruptcy(gameState, myPlayer.id);
    updateAndBroadcastState(newState);
  };

  return (
    <GameContext.Provider
      value={{
        room,
        gameState,
        isHost,
        isMyTurn,
        currentPlayer,
        myPlayer,
        selectedTileDetail,
        setSelectedTileDetail,
        createRoom,
        joinRoom,
        leaveRoom,
        toggleReady,
        addBotToRoom,
        removeMemberFromRoom,
        updateCustomization,
        sendChatMessage,
        startRoomGame,
        startSinglePlayerGame,
        rollDice,
        buyCurrentProperty,
        declineCurrentProperty,
        placeBid,
        passBid,
        executeActiveCardAction,
        payJailBail,
        useJailCard,
        buildHouseOnTile,
        sellHouseOnTile,
        mortgageTile,
        unmortgageTile,
        proposeTrade,
        respondToTrade,
        endCurrentTurn,
        declareBankruptcy
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
