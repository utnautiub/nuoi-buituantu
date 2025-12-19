/**
 * Deep Linking utilities for opening banking apps
 */

import { Bank } from "./banks";

/**
 * Detect if user is on iOS
 */
export function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Detect if user is on Android
 */
export function isAndroid(): boolean {
  if (typeof window === "undefined") return false;
  return /Android/.test(navigator.userAgent);
}

/**
 * Detect mobile platform
 */
export function getMobilePlatform(): "ios" | "android" | "other" {
  if (isIOS()) return "ios";
  if (isAndroid()) return "android";
  return "other";
}

/**
 * Try to open banking app with deep link
 * Returns true if successfully opened, false otherwise
 */
export async function openBankingApp(bank: Bank): Promise<boolean> {
  const platform = getMobilePlatform();

  if (platform === "other") {
    console.warn("Deep linking only works on mobile devices");
    return false;
  }

  try {
    if (platform === "ios") {
      // Try universal link first (better UX)
      if (bank.universalLink) {
        window.location.href = bank.universalLink;
        return true;
      }
      
      // Fallback to URL scheme
      if (bank.iosScheme) {
        window.location.href = bank.iosScheme;
        
        // Check if app opened (timeout fallback)
        return await new Promise((resolve) => {
          const timeout = setTimeout(() => {
            resolve(false);
          }, 2000);

          // If page is hidden, app probably opened
          const handleVisibilityChange = () => {
            if (document.hidden) {
              clearTimeout(timeout);
              resolve(true);
            }
          };

          document.addEventListener("visibilitychange", handleVisibilityChange);

          // Clean up
          setTimeout(() => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
          }, 2100);
        });
      }
    } else if (platform === "android") {
      // Try intent URL for Android
      if (bank.androidPackage) {
        const intentUrl = `intent://#Intent;scheme=${bank.code.toLowerCase()};package=${bank.androidPackage};end`;
        window.location.href = intentUrl;
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Failed to open banking app:", error);
    return false;
  }
}

/**
 * Get Play Store URL for Android app
 */
export function getPlayStoreUrl(packageName: string): string {
  return `https://play.google.com/store/apps/details?id=${packageName}`;
}

/**
 * Get App Store URL for iOS app
 */
export function getAppStoreUrl(appId: string): string {
  return `https://apps.apple.com/app/id${appId}`;
}

/**
 * Open app store to download banking app
 */
export function openAppStore(bank: Bank): void {
  const platform = getMobilePlatform();
  
  if (platform === "android" && bank.androidPackage) {
    window.location.href = getPlayStoreUrl(bank.androidPackage);
  } else if (platform === "ios") {
    // Fallback to Google search for the app
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(bank.shortName + " ios app")}`;
  } else {
    // Desktop fallback
    window.open(`https://www.google.com/search?q=${encodeURIComponent(bank.shortName + " mobile app")}`, "_blank");
  }
}

