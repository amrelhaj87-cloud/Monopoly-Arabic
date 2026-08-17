import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  updateProfile,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  collection,
  Firestore,
  serverTimestamp
} from 'firebase/firestore';
import { UserProfile, FirebaseConfigOptions } from '../types/auth';
import { Room } from '../types/room';
import { GameState } from '../types/game';

// Default demo configuration or user-defined configuration from localStorage
const DEFAULT_FIREBASE_CONFIG: FirebaseConfigOptions = {
  apiKey: "AIzaSyDemo-MonopolyArabicKeyPlaceholder001",
  authDomain: "monopoly-arabic-demo.firebaseapp.com",
  projectId: "monopoly-arabic-demo",
  storageBucket: "monopoly-arabic-demo.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef12345678"
};

class FirebaseService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private db: Firestore | null = null;
  private isConfigured: boolean = false;
  private broadcastChannel: BroadcastChannel | null = null;

  constructor() {
    this.initBroadcast();
    this.init();
  }

  private initBroadcast() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('monopoly_arabic_channel');
    }
  }

  public getBroadcastChannel(): BroadcastChannel | null {
    return this.broadcastChannel;
  }

  public init(customConfig?: FirebaseConfigOptions) {
    try {
      const savedConfig = localStorage.getItem('monopoly_arabic_firebase_config');
      const config = customConfig || (savedConfig ? JSON.parse(savedConfig) : DEFAULT_FIREBASE_CONFIG);
      
      const isPlaceholder = config.apiKey.includes('Placeholder');
      if (!isPlaceholder && config.apiKey && config.projectId) {
        if (!getApps().length) {
          this.app = initializeApp(config);
        } else {
          this.app = getApps()[0];
        }
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
        this.isConfigured = true;
      } else {
        this.isConfigured = false;
      }
    } catch (err) {
      console.warn('Firebase initialization in offline/local mode:', err);
      this.isConfigured = false;
    }
  }

  public saveConfig(config: FirebaseConfigOptions) {
    localStorage.setItem('monopoly_arabic_firebase_config', JSON.stringify(config));
    this.init(config);
  }

  public getSavedConfig(): FirebaseConfigOptions | null {
    const saved = localStorage.getItem('monopoly_arabic_firebase_config');
    return saved ? JSON.parse(saved) : null;
  }

  public hasValidCloudConfig(): boolean {
    return this.isConfigured && this.auth !== null && this.db !== null;
  }

  public getAuthInstance(): Auth | null {
    return this.auth;
  }

  public getDbInstance(): Firestore | null {
    return this.db;
  }

  // --- Auth Handlers ---
  public async loginWithGoogle(): Promise<User | null> {
    if (!this.hasValidCloudConfig() || !this.auth) {
      throw new Error('لم يتم ضبط مفاتيح Firebase السحابية بعد. يمكنك اللعب كزائر أو تسجيل الدخول التجريبي.');
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    return result.user;
  }

  public async loginWithEmail(email: string, pass: string): Promise<User | null> {
    if (!this.hasValidCloudConfig() || !this.auth) {
      throw new Error('لم يتم ضبط مفاتيح Firebase السحابية بعد. يمكنك الدخول كزائر فوراً.');
    }
    const res = await signInWithEmailAndPassword(this.auth, email, pass);
    return res.user;
  }

  public async registerWithEmail(email: string, pass: string, name: string): Promise<User | null> {
    if (!this.hasValidCloudConfig() || !this.auth) {
      throw new Error('لم يتم ضبط مفاتيح Firebase السحابية بعد. يمكنك الدخول كزائر فوراً.');
    }
    const res = await createUserWithEmailAndPassword(this.auth, email, pass);
    await updateProfile(res.user, { displayName: name });
    return res.user;
  }

  public async logout(): Promise<void> {
    if (this.auth) {
      await signOut(this.auth);
    }
  }

  // --- Profile Management ---
  public async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (this.db) {
      try {
        const snap = await getDoc(doc(this.db, 'users', uid));
        if (snap.exists()) {
          return snap.data() as UserProfile;
        }
      } catch (e) {
        console.warn('Error fetching user profile from Firestore:', e);
      }
    }
    const local = localStorage.getItem(`monopoly_profile_${uid}`);
    return local ? JSON.parse(local) : null;
  }

  public async saveUserProfile(profile: UserProfile): Promise<void> {
    localStorage.setItem(`monopoly_profile_${profile.uid}`, JSON.stringify(profile));
    if (this.db) {
      try {
        await setDoc(doc(this.db, 'users', profile.uid), {
          ...profile,
          updatedAt: Date.now()
        }, { merge: true });
      } catch (e) {
        console.warn('Error saving profile to Firestore:', e);
      }
    }
  }
}

export const firebaseService = new FirebaseService();
