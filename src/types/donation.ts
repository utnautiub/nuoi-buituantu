/**
 * Type definitions for donations
 */

import { Timestamp } from "firebase/firestore";

export interface Donation {
  id: string;
  transactionId: string;
  amount: number;
  description: string;
  donorName?: string;
  gateway: "sepay" | "manual";
  bankAccount: string;
  bankName: string;
  status: "pending" | "completed" | "failed";
  transactionDate?: string; // Original datetime string from SePay (VN time)
  createdAt: Date | Timestamp; // Support both Date and Firestore Timestamp
  metadata?: Record<string, any>;
}

export interface SePayWebhook {
  id: string;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code: string | null;
  content: string;
  transferType: string;
  transferAmount: number;
  accumulated: number;
  referenceCode: string;
  description: string;
}

export interface DonationStats {
  totalAmount: number;
  totalDonations: number;
  recentDonations: Donation[];
}
