/**
 * Donation tracking utilities
 * Uses localStorage to track user's donations (for anonymous users)
 */

export interface UserDonation {
  id: string;
  transactionId?: string; // SePay transaction ID for matching
  amount: number;
  description: string;
  timestamp: number;
  month: string; // Format: "YYYY-MM"
}

const STORAGE_KEY = "user_donations";
const MONTHLY_LIMIT = 50;

/**
 * Get current month in YYYY-MM format
 */
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Get all user donations from localStorage
 */
export function getUserDonations(): UserDonation[] {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get user donations:", error);
    return [];
  }
}

/**
 * Get donations for current month
 */
export function getCurrentMonthDonations(): UserDonation[] {
  const allDonations = getUserDonations();
  const currentMonth = getCurrentMonth();
  return allDonations.filter((d) => d.month === currentMonth);
}

/**
 * Get donation count for current month
 */
export function getCurrentMonthDonationCount(): number {
  return getCurrentMonthDonations().length;
}

/**
 * Check if user can donate more this month
 */
export function canDonateThisMonth(): boolean {
  return getCurrentMonthDonationCount() < MONTHLY_LIMIT;
}

/**
 * Get remaining donations for current month
 */
export function getRemainingDonations(): number {
  return Math.max(0, MONTHLY_LIMIT - getCurrentMonthDonationCount());
}

/**
 * Add a new donation record
 */
export function addDonation(donation: Omit<UserDonation, "timestamp" | "month">): boolean {
  if (!canDonateThisMonth()) {
    return false;
  }

  try {
    const donations = getUserDonations();
    const newDonation: UserDonation = {
      ...donation,
      timestamp: Date.now(),
      month: getCurrentMonth(),
    };
    
    donations.push(newDonation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
    return true;
  } catch (error) {
    console.error("Failed to add donation:", error);
    return false;
  }
}

/**
 * Get user's donation history (all time)
 */
export function getUserDonationHistory(): UserDonation[] {
  return getUserDonations().sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Get user's total donated amount
 */
export function getTotalDonated(): number {
  const donations = getUserDonations();
  return donations.reduce((sum, d) => sum + d.amount, 0);
}

/**
 * Check if a donation ID belongs to current user
 */
export function isUserDonation(donationId: string): boolean {
  const donations = getUserDonations();
  return donations.some((d) => d.id === donationId);
}

/**
 * Check if a donation (by transactionId) belongs to current user
 */
export function isUserDonationByTransactionId(transactionId: string): boolean {
  const donations = getUserDonations();
  return donations.some((d) => d.transactionId === transactionId);
}

/**
 * Get all transaction IDs tracked by user
 */
export function getUserTransactionIds(): string[] {
  const donations = getUserDonations();
  return donations
    .map((d) => d.transactionId)
    .filter((id): id is string => !!id);
}

/**
 * Get donation stats for current user
 */
export function getUserStats() {
  const allDonations = getUserDonations();
  const currentMonthDonations = getCurrentMonthDonations();
  
  return {
    totalDonations: allDonations.length,
    totalAmount: getTotalDonated(),
    thisMonthDonations: currentMonthDonations.length,
    thisMonthAmount: currentMonthDonations.reduce((sum, d) => sum + d.amount, 0),
    remainingThisMonth: getRemainingDonations(),
    canDonate: canDonateThisMonth(),
  };
}

/**
 * Clean up old donations (older than 12 months)
 */
export function cleanupOldDonations(): void {
  try {
    const donations = getUserDonations();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const filtered = donations.filter((d) => d.timestamp > twelveMonthsAgo.getTime());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to cleanup old donations:", error);
  }
}

