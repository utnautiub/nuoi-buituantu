import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timestamp } from "firebase/firestore"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency to Vietnamese Dong
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Format date to Vietnamese format with timezone
 * Supports Date, Timestamp, and string
 */
export function formatDate(date: Date | Timestamp | string): string {
  let d: Date;
  
  if (date instanceof Timestamp) {
    d = date.toDate();
  } else if (typeof date === "string") {
    d = new Date(date);
  } else {
    d = date;
  }
  
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(d);
}

/**
 * Format VN datetime string from SePay
 * "2025-12-19 23:36:00" → "23:36 19/12/2025"
 */
export function formatVNDate(dateString: string): string {
  const [datePart, timePart] = dateString.split(' ');
  const [year, month, day] = datePart.split('-');
  const [hour, minute] = timePart.split(':');
  return `${hour}:${minute} ${day}/${month}/${year}`;
}
