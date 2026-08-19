import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, FirebaseConfigOptions } from '../types/auth';
import { PlayerTokenId } from '../types/game';
import { firebaseService } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isFirebaseCloudConfigured: boolean;
  loginAsGuest: (name: string, avatar: string, token: PlayerTokenId) => Promise<UserProfile>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserStats: (won: boolean, netWorth: number, monopolies: number) => Promise<void>;
  updateProfileCustomization: (name: string, avatar: string, token: PlayerTokenId) => Promise<void>;
  saveCustomFirebaseConfig: (config: FirebaseConfigOptions) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirebaseCloudConfigured, setIsFirebaseCloudConfigured] = useState<boolean>(
    firebaseService.hasValidCloudConfig()
  );

  useEffect(() => {
    // Check saved guest or local user first
    const savedUser = localStorage.getItem('monopoly_arabic_current_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    // Check Firebase Auth if configured
    const auth = firebaseService.getAuthInstance();
    if (auth) {
      const unsub = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (firebaseUser) {
          const profile = await firebaseService.getUserProfile(firebaseUser.uid);
          if (profile) {
            setUser(profile);
            localStorage.setItem('monopoly_arabic_current_user', JSON.stringify(profile));
          } else {
            const newProf: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'لاعب محترف',
              photoURL: firebaseUser.photoURL,
              isGuest: false,
              selectedToken: 'falcon',
              stats: {
                gamesPlayed: 0,
                gamesWon: 0,
                highestNetWorth: 1500,
                propertiesMonopolized: 0
              },
              createdAt: Date.now(),
              updatedAt: Date.now()
            };
            await firebaseService.saveUserProfile(newProf);
            setUser(newProf);
            localStorage.setItem('monopoly_arabic_current_user', JSON.stringify(newProf));
          }
        }
        setIsLoading(false);
      });
      return () => unsub();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginAsGuest = async (name: string, avatar: string, token: PlayerTokenId): Promise<UserProfile> => {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const guestProfile: UserProfile = {
      uid: guestId,
      email: null,
      displayName: name.trim() || 'زائر كريم',
      photoURL: null,
      isGuest: true,
      selectedToken: token,
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        highestNetWorth: 1500,
        propertiesMonopolized: 0
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setUser(guestProfile);
    localStorage.setItem('monopoly_arabic_current_user', JSON.stringify(guestProfile));
    return guestProfile;
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const fbUser = await firebaseService.loginWithGoogle();
      if (fbUser) {
        let profile = await firebaseService.getUserProfile(fbUser.uid);
        if (!profile) {
          profile = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'لاعب جوجل',
            photoURL: fbUser.photoURL,
            isGuest: false,
            selectedToken: 'crown',
            stats: {
              gamesPlayed: 0,
              gamesWon: 0,
              highestNetWorth: 1500,
              propertiesMonopolized: 0
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          await firebaseService.saveUserProfile(profile);
        }
        setUser(profile);
        localStorage.setItem('monopoly_arabic_current_user', JSON.stringify(profile));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const fbUser = await firebaseService.loginWithEmail(email, pass);
      if (fbUser) {
        const profile = await firebaseService.getUserProfile(fbUser.uid);
        if (profile) {
          setUser(profile);
          localStorage.setItem('monopoly_arabic_current_user', JSON.stringify(profile));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setIsLoading(true);
    try {
      const fbUser = await firebaseService.registerWithEmail(email, pass, name);
      if (fbUser) {
        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: name,
          photoURL: null,
          isGuest: false,
          selectedToken: 'car',
          stats: {
            gamesPlayed: 0,
            gamesWon: 0,
            highestNetWorth: 1500,
            propertiesMonopolized: 0
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        await firebaseService.saveUserProfile(profile);
        setUser(profile);
        localStorage.setItem('monopoly_arabic_current_user', JSON.stringify(profile));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await firebaseService.logout();
    setUser(null);
    localStorage.removeItem('monopoly_arabic_current_user');
  };

  const updateUserStats = async (won: boolean, netWorth: number, monopolies: number) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      stats: {
        gamesPlayed: user.stats.gamesPlayed + 1,
        gamesWon: user.stats.gamesWon + (won ? 1 : 0),
        highestNetWorth: Math.max(user.stats.highestNetWorth, netWorth),
        propertiesMonopolized: user.stats.propertiesMonopolized + monopolies
      },
      updatedAt: Date.now()
    };
    setUser(updated);
    await firebaseService.saveUserProfile(updated);
  };

  const updateProfileCustomization = async (name: string, color: string, token: PlayerTokenId) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      displayName: name,
      color: color,
      selectedToken: token,
      updatedAt: Date.now()
    };
    setUser(updated);
    await firebaseService.saveUserProfile(updated);
  };

  const saveCustomFirebaseConfig = (config: FirebaseConfigOptions) => {
    firebaseService.saveConfig(config);
    setIsFirebaseCloudConfigured(firebaseService.hasValidCloudConfig());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isFirebaseCloudConfigured,
        loginAsGuest,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        updateUserStats,
        updateProfileCustomization,
        saveCustomFirebaseConfig
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
