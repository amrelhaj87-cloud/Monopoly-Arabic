import { Room, RoomMember, ChatMessage } from '../types/room';
import { GameSettings, GameState, PlayerTokenId } from '../types/game';
import { firebaseService } from './firebase';
import { doc, setDoc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';

export class RoomService {
  private static localRooms: Map<string, Room> = new Map();
  private static listeners: Map<string, (room: Room) => void> = new Map();

  static {
    // Listen for broadcast messages across browser tabs
    const bc = firebaseService.getBroadcastChannel();
    if (bc) {
      bc.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'ROOM_UPDATE') {
          const room = payload as Room;
          this.localRooms.set(room.id, room);
          const callback = this.listeners.get(room.id);
          if (callback) callback(room);
        }
      };
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('monopoly_room_') && e.newValue) {
          try {
            const room = JSON.parse(e.newValue) as Room;
            this.localRooms.set(room.id, room);
            const callback = this.listeners.get(room.id);
            if (callback) callback(room);
          } catch (err) {}
        }
      });
    }
  }

  /**
   * Generate 6-char unique room code
   */
  public static generateRoomCode(): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Create a new multiplayer room
   */
  public static async createRoom(hostMember: RoomMember, settings: GameSettings): Promise<Room> {
    const roomId = this.generateRoomCode();
    const room: Room = {
      id: roomId,
      hostId: hostMember.id,
      status: 'waiting',
      members: [hostMember],
      settings,
      createdAt: Date.now(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: 'system',
          senderName: 'النظام',
          text: `تم إنشاء الغرفة (${roomId}) بنجاح! شارك الكود مع أصدقائك للانضمام.`,
          timestamp: Date.now(),
          isSystem: true
        }
      ]
    };

    // Save to Firestore if available
    const db = firebaseService.getDbInstance();
    if (db && firebaseService.hasValidCloudConfig()) {
      try {
        await setDoc(doc(db, 'rooms', roomId), room);
      } catch (err) {
        console.warn('Firestore room write fallback:', err);
      }
    }

    // Save locally and broadcast
    this.localRooms.set(roomId, room);
    localStorage.setItem(`monopoly_room_${roomId}`, JSON.stringify(room));
    this.broadcastUpdate(room);

    return room;
  }

  /**
   * Join an existing room by code
   */
  public static async joinRoom(roomId: string, member: RoomMember): Promise<Room> {
    const cleanId = roomId.trim().toUpperCase();
    let room: Room | null = null;

    // Check Cloud first
    const db = firebaseService.getDbInstance();
    if (db && firebaseService.hasValidCloudConfig()) {
      try {
        const snap = await getDoc(doc(db, 'rooms', cleanId));
        if (snap.exists()) {
          room = snap.data() as Room;
        }
      } catch (e) {
        console.warn('Firestore fetch failed:', e);
      }
    }

    // Check local
    if (!room) {
      const local = this.localRooms.get(cleanId) || localStorage.getItem(`monopoly_room_${cleanId}`);
      if (local) {
        room = typeof local === 'string' ? JSON.parse(local) : local;
      }
    }

    if (!room) {
      throw new Error(`الغرفة برمز (${cleanId}) غير موجودة.`);
    }

    if (room.status !== 'waiting') {
      throw new Error('المباراة في هذه الغرفة بدأت بالفعل.');
    }

    if (room.members.length >= room.settings.maxPlayers) {
      throw new Error('الغرفة ممتلئة بالكامل.');
    }

    // Check if already in room
    const exists = room.members.find(m => m.id === member.id);
    if (!exists) {
      // Pick non-conflicting token and color if taken
      const takenTokens = room.members.map(m => m.token);
      if (takenTokens.includes(member.token)) {
        const available: PlayerTokenId[] = ['car', 'falcon', 'camel', 'dallah', 'dhow', 'ring', 'castle', 'crown'];
        const free = available.find(t => !takenTokens.includes(t));
        if (free) member.token = free;
      }

      room.members.push(member);
      room.messages.push({
        id: `msg_${Date.now()}`,
        senderId: 'system',
        senderName: 'النظام',
        text: `انضم ${member.name} إلى الغرفة! 🎉`,
        timestamp: Date.now(),
        isSystem: true
      });

      await this.saveRoom(room);
    }

    return room;
  }

  /**
   * Add a Bot member to the room
   */
  public static async addBot(roomId: string, botMember: RoomMember): Promise<Room> {
    const room = await this.getRoom(roomId);
    if (!room) throw new Error('الغرفة غير موجودة');

    if (room.members.length >= room.settings.maxPlayers) {
      throw new Error('الغرفة ممتلئة بالكامل');
    }

    room.members.push(botMember);
    room.messages.push({
      id: `msg_${Date.now()}`,
      senderId: 'system',
      senderName: 'النظام',
      text: `تمت إضافة الروبوت الذكي (${botMember.name}) إلى الغرفة. 🤖`,
      timestamp: Date.now(),
      isSystem: true
    });

    await this.saveRoom(room);
    return room;
  }

  /**
   * Remove member or bot
   */
  public static async removeMember(roomId: string, memberId: string): Promise<Room> {
    const room = await this.getRoom(roomId);
    if (!room) throw new Error('الغرفة غير موجودة');

    const removed = room.members.find(m => m.id === memberId);
    room.members = room.members.filter(m => m.id !== memberId);

    if (removed) {
      room.messages.push({
        id: `msg_${Date.now()}`,
        senderId: 'system',
        senderName: 'النظام',
        text: `غادر ${removed.name} الغرفة.`,
        timestamp: Date.now(),
        isSystem: true
      });
    }

    await this.saveRoom(room);
    return room;
  }

  /**
   * Toggle Ready state of a member
   */
  public static async toggleReady(roomId: string, memberId: string): Promise<Room> {
    const room = await this.getRoom(roomId);
    if (!room) throw new Error('الغرفة غير موجودة');

    const m = room.members.find(mem => mem.id === memberId);
    if (m) {
      m.isReady = !m.isReady;
      await this.saveRoom(room);
    }
    return room;
  }

  /**
   * Update Member token / color
   */
  public static async updateMemberCustomization(roomId: string, memberId: string, token: PlayerTokenId, color: string): Promise<Room> {
    const room = await this.getRoom(roomId);
    if (!room) throw new Error('الغرفة غير موجودة');

    const m = room.members.find(mem => mem.id === memberId);
    if (m) {
      m.token = token;
      m.color = color;
      await this.saveRoom(room);
    }
    return room;
  }

  /**
   * Send a chat message
   */
  public static async sendMessage(roomId: string, senderId: string, senderName: string, text: string): Promise<void> {
    const room = await this.getRoom(roomId);
    if (!room) return;

    room.messages.push({
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId,
      senderName,
      text,
      timestamp: Date.now()
    });

    if (room.messages.length > 50) room.messages.shift();
    await this.saveRoom(room);
  }

  /**
   * Update Room Game Settings (Host only)
   */
  public static async updateRoomSettings(roomId: string, newSettings: Partial<GameSettings>): Promise<Room | null> {
    const room = await this.getRoom(roomId);
    if (!room) return null;

    room.settings = { ...room.settings, ...newSettings };
    await this.saveRoom(room);
    return room;
  }

  /**
   * Sync Game State into Room
   */
  public static async syncGameState(roomId: string, gameState: GameState): Promise<void> {
    const room = await this.getRoom(roomId);
    if (!room) return;

    room.gameState = gameState;
    room.status = gameState.winnerId ? 'finished' : 'in_game';
    await this.saveRoom(room);
  }

  /**
   * Subscribe to real-time room updates
   */
  public static subscribeToRoom(roomId: string, callback: (room: Room) => void): () => void {
    const cleanId = roomId.trim().toUpperCase();
    this.listeners.set(cleanId, callback);

    let unsubFirestore: (() => void) | null = null;
    const db = firebaseService.getDbInstance();

    if (db && firebaseService.hasValidCloudConfig()) {
      try {
        unsubFirestore = onSnapshot(doc(db, 'rooms', cleanId), (snap) => {
          if (snap.exists()) {
            const room = snap.data() as Room;
            this.localRooms.set(cleanId, room);
            callback(room);
          }
        });
      } catch (e) {
        console.warn('Firestore subscription fallback:', e);
      }
    }

    // Immediate initial callback with local state
    const current = this.localRooms.get(cleanId);
    if (current) callback(current);

    return () => {
      this.listeners.delete(cleanId);
      if (unsubFirestore) unsubFirestore();
    };
  }

  private static async getRoom(roomId: string): Promise<Room | null> {
    const cleanId = roomId.trim().toUpperCase();
    const db = firebaseService.getDbInstance();
    if (db && firebaseService.hasValidCloudConfig()) {
      try {
        const snap = await getDoc(doc(db, 'rooms', cleanId));
        if (snap.exists()) return snap.data() as Room;
      } catch (e) {}
    }
    const local = this.localRooms.get(cleanId) || localStorage.getItem(`monopoly_room_${cleanId}`);
    return local ? (typeof local === 'string' ? JSON.parse(local) : local) : null;
  }

  private static async saveRoom(room: Room): Promise<void> {
    const db = firebaseService.getDbInstance();
    if (db && firebaseService.hasValidCloudConfig()) {
      try {
        await setDoc(doc(db, 'rooms', room.id), room, { merge: true });
      } catch (err) {
        console.warn('Error saving room to Firestore:', err);
      }
    }

    this.localRooms.set(room.id, room);
    localStorage.setItem(`monopoly_room_${room.id}`, JSON.stringify(room));
    this.broadcastUpdate(room);

    const cb = this.listeners.get(room.id);
    if (cb) cb(room);
  }

  private static broadcastUpdate(room: Room) {
    const bc = firebaseService.getBroadcastChannel();
    if (bc) {
      bc.postMessage({ type: 'ROOM_UPDATE', payload: room });
    }
  }
}
