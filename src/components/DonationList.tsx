"use client";

import * as React from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Donation } from "@/types/donation";
import { formatCurrency, formatDate } from "@/lib/utils";

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
    title: "Sao kê donation",
    empty: "Chưa có donation nào",
    beFirst: "Hãy là người đầu tiên!",
    anonymous: "Ẩn danh",
    page: "Trang",
    of: "của",
  },
  en: {
    title: "Donation Statement",
    empty: "No donations yet",
    beFirst: "Be the first one!",
    anonymous: "Anonymous",
    page: "Page",
    of: "of",
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
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          {t.title}
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          {t.title}
        </h3>
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">{t.empty}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            {t.beFirst} 💚
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <Heart className="w-6 h-6 text-red-500" />
        {t.title} ({donations.length})
      </h3>

      <div className="space-y-3 mb-6">
        {donations.map((donation, index) => (
          <div
            key={donation.id}
            className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 border border-green-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                    #{(currentPage - 1) * 10 + index + 1}
                  </span>
                  <div className="font-semibold text-lg text-gray-800 dark:text-white">
                    {donation.donorName || t.anonymous}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {donation.description}
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="font-bold text-xl text-primary dark:text-green-400 whitespace-nowrap">
                  {formatCurrency(donation.amount)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {donation.bankName}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-green-200 dark:border-gray-600">
              <span className="font-mono">#{donation.transactionId}</span>
              <span>{formatDate(donation.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {language === "vi" ? "Trước" : "Previous"}
          </button>

          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t.page} {currentPage} {t.of} {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {language === "vi" ? "Sau" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
