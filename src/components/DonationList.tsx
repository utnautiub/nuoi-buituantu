"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Donation } from "@/types/donation";
import { formatCurrency, formatDate } from "@/lib/utils";

// Format Vietnam date string directly (no timezone conversion)
function formatVNDate(dateString: string): string {
  // Input: "2025-12-19 23:36:00"
  // Output: "23:36 19/12/2025"
  const [datePart, timePart] = dateString.split(' ');
  const [year, month, day] = datePart.split('-');
  const [hour, minute] = timePart.split(':');
  return `${hour}:${minute} ${day}/${month}/${year}`;
}

interface DonationListProps {
  donations: Donation[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  language: "vi" | "en";
}

const translations = {
  vi: {
    title: "Danh sách donate",
    empty: "Chưa có donate",
    anonymous: "Ẩn danh",
    prev: "Trước",
    next: "Sau",
  },
  en: {
    title: "Donation List",
    empty: "No donations yet",
    anonymous: "Anonymous",
    prev: "Prev",
    next: "Next",
  },
};

export function DonationList({
  donations,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  language,
}: DonationListProps) {
  const t = translations[language];

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t.title}
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t.title}
        </h2>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {t.empty}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {t.title} ({donations.length})
      </h2>

      <div className="space-y-2 mb-4">
        {donations.map((donation, index) => (
          <div
            key={donation.id}
            className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 border border-green-100 dark:border-gray-600 rounded-lg"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex-shrink-0 text-[10px] font-bold text-green-700 dark:text-green-400 bg-green-200 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                    #{(currentPage - 1) * 10 + index + 1}
                  </span>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {donation.donorName || t.anonymous}
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                  {donation.description}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-base text-green-600 dark:text-green-400 whitespace-nowrap">
                  {formatCurrency(donation.amount)}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-green-200 dark:border-gray-600">
              {donation.transactionDate 
                ? formatVNDate(donation.transactionDate)
                : formatDate(donation.createdAt)
              }
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {t.prev}
          </button>

          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentPage}/{totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t.next}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
