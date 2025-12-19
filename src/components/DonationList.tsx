"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Donation } from "@/types/donation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

// Format Vietnam date string directly (no timezone conversion)
function formatVNDate(dateString: string): string {
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
  itemsPerPage?: number;
}

const translations = {
  vi: {
    empty: "Chưa có donate",
    anonymous: "Ẩn danh",
    prev: "Trước",
    next: "Sau",
  },
  en: {
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
  itemsPerPage = 10,
}: DonationListProps) {
  const t = translations[language];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-in fade-in duration-300" style={{ animationDelay: `${i * 50}ms` }}>
            <Card className="p-4 border-slate-200 dark:border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-4 w-20 bg-slate-200 dark:bg-slate-800" />
                  <Skeleton className="h-3 w-full bg-slate-200 dark:bg-slate-800" />
                  <Skeleton className="h-3 w-24 bg-slate-200 dark:bg-slate-800" />
                </div>
                <Skeleton className="h-6 w-24 bg-slate-200 dark:bg-slate-800" />
              </div>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <span className="text-2xl">💝</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">{t.empty}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {donations.map((donation, index) => (
          <div
            key={donation.id}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <Card 
              className="group p-4 bg-gradient-to-br from-green-50/80 via-emerald-50/50 to-green-50/80 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-green-950/30 border-green-200/60 dark:border-green-900/40 hover:shadow-lg hover:scale-[1.01] hover:border-green-300 dark:hover:border-green-800 transition-all duration-300 cursor-pointer overflow-hidden relative"
            >
              {/* Animated gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none z-0" />
              
              {/* Hover background overlay */}
              <div className="absolute inset-0 bg-green-100/50 dark:bg-green-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
              
              <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant="secondary" 
                      className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200 font-semibold px-2.5 py-0.5"
                    >
                      #{(currentPage - 1) * itemsPerPage + index + 1}
                    </Badge>
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {donation.donorName || t.anonymous}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {donation.description}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {donation.transactionDate 
                      ? formatVNDate(donation.transactionDate)
                      : formatDate(donation.createdAt)}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent whitespace-nowrap group-hover:scale-110 transition-transform duration-200">
                    {formatCurrency(donation.amount)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 animate-in fade-in duration-500 delay-300">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-slate-300 dark:border-slate-700 hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-500 dark:hover:border-green-400 disabled:opacity-50 transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t.prev}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {currentPage}
            </span>
            <span className="text-sm text-slate-400">/</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-slate-300 dark:border-slate-700 hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-500 dark:hover:border-green-400 disabled:opacity-50 transition-all duration-200"
          >
            {t.next}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
