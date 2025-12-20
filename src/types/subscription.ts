/**
 * Type definitions for subscriptions
 */

import { Timestamp } from "firebase/firestore";

export interface Subscription {
  id: string;
  userId: string;
  tierId: string; // e.g., "coffee", "pizza", "trial-7d"
  tierName: string;
  tierNameEn: string;
  price: number;
  period: "day" | "month" | "year" | "lifetime";
  periodDays?: number;
  
  // Subscription dates
  startDate: Date | Timestamp;
  endDate: Date | Timestamp | null; // null for lifetime
  
  // Status
  status: "active" | "expired" | "cancelled";
  
  // Related donation
  donationId: string;
  transactionId: string;
  
  // Metadata
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export function calculateEndDate(
  startDate: Date,
  period: "day" | "month" | "year" | "lifetime",
  periodDays?: number
): Date | null {
  if (period === "lifetime") {
    return null; // Never expires
  }
  
  const endDate = new Date(startDate);
  
  if (period === "day" && periodDays) {
    endDate.setDate(endDate.getDate() + periodDays);
  } else if (period === "month") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (period === "year") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  
  return endDate;
}

export function isSubscriptionExpired(subscription: Subscription): boolean {
  if (subscription.period === "lifetime" || !subscription.endDate) {
    return false;
  }
  
  const endDate = subscription.endDate instanceof Date 
    ? subscription.endDate 
    : subscription.endDate.toDate();
  
  return endDate < new Date();
}

export function getDaysUntilExpiry(subscription: Subscription): number | null {
  if (subscription.period === "lifetime" || !subscription.endDate) {
    return null; // Never expires
  }
  
  const endDate = subscription.endDate instanceof Date 
    ? subscription.endDate 
    : subscription.endDate.toDate();
  
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

