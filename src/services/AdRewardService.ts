const REWARD_KEY = 'monopoly_ad_rewards';

export type RewardType = 'timeShield' | 'bankBoost' | 'revival';

interface RewardData {
  userId: string;
  claimedToday: RewardType[];
  activePerks: RewardType[];
  lastResetDate: string;
}

export class AdRewardService {
  private static getTodayDateString(): string {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  private static getStoredData(userId: string): RewardData {
    const defaultData: RewardData = {
      userId,
      claimedToday: [],
      activePerks: [],
      lastResetDate: this.getTodayDateString(),
    };

    try {
      const stored = localStorage.getItem(`${REWARD_KEY}_${userId}`);
      if (!stored) return defaultData;

      const parsed = JSON.parse(stored) as RewardData;
      
      // Reset if date changed
      if (parsed.lastResetDate !== this.getTodayDateString()) {
        return defaultData;
      }
      
      return parsed;
    } catch (e) {
      console.warn("Failed to parse ad rewards from local storage.");
      return defaultData;
    }
  }

  private static saveData(userId: string, data: RewardData) {
    localStorage.setItem(`${REWARD_KEY}_${userId}`, JSON.stringify(data));
  }

  /**
   * Get list of rewards already claimed today to disable buttons
   */
  public static getClaimedToday(userId: string): RewardType[] {
    const data = this.getStoredData(userId);
    return data.claimedToday;
  }

  /**
   * Claims a reward. Returns false if already claimed today.
   */
  public static claimReward(userId: string, perk: RewardType): boolean {
    const data = this.getStoredData(userId);
    
    if (data.claimedToday.includes(perk)) {
      return false; // Already claimed today
    }
    
    data.claimedToday.push(perk);
    if (!data.activePerks.includes(perk)) {
      data.activePerks.push(perk);
    }
    
    this.saveData(userId, data);
    return true;
  }

  /**
   * Consumes active perks (moves them out of active state so they can be used in game).
   * Usually called right before starting a Solo match.
   */
  public static consumeActivePerks(userId: string): RewardType[] {
    const data = this.getStoredData(userId);
    const perks = [...data.activePerks];
    
    // Clear active perks after they are transferred to the game match
    data.activePerks = [];
    this.saveData(userId, data);
    
    return perks;
  }
}
