import { Capacitor } from '@capacitor/core';

export const MONETAG_REWARD_URL = "https://omg10.com/4/11626921";

/**
 * Checks if the app is running natively on a mobile device (Android/iOS).
 * Returns true if running in Capacitor native context, false if in web browser.
 */
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Handles showing the reward ad (Direct Link) and calling the callback.
 * Only executes if on the web platform.
 */
export const handleRewardAd = (callback: () => void) => {
  if (isNativePlatform()) {
    console.warn("Ads are disabled on native platforms.");
    return;
  }

  // Open the Direct Link in a new tab
  const adWindow = window.open(MONETAG_REWARD_URL, '_blank');
  
  // Since we can't strictly track if they watched it on a direct link without backend S2S,
  // we simulate a reward grant after a short delay (e.g. 2 seconds).
  setTimeout(() => {
    callback();
  }, 2000);
};

/**
 * Injects the Monetag In-Page Push banner script into the document body.
 * Only executes if on the web platform.
 */
export const injectInPagePushBanner = () => {
  if (isNativePlatform()) return;
  
  // Check if already injected
  if (document.querySelector(`script[data-zone="11626918"]`)) return;

  const script = document.createElement('script');
  script.dataset.zone = '11626918';
  script.src = 'https://nap5k.com/tag.min.js';

  const targetNode = document.body || document.documentElement;
  if (targetNode) {
    targetNode.appendChild(script);
  }
};
