"use client";

import * as React from "react";
import { AlertCircle, History, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserStats, canDonateThisMonth } from "@/lib/donation-tracker";

interface DonationLimitBannerProps {
  language: "vi" | "en";
  onViewHistory: () => void;
}

const translations = {
  vi: {
    limitReached: "Đã đạt giới hạn donate tháng này",
    limitReachedDesc: "Bạn đã donate {count}/50 lần trong tháng này. Vui lòng quay lại tháng sau!",
    viewHistory: "Xem lịch sử",
    remaining: "Còn {count} lần donate trong tháng này",
    myDonations: "Donate của tôi",
    total: "Tổng: {amount}",
  },
  en: {
    limitReached: "Monthly donation limit reached",
    limitReachedDesc: "You've donated {count}/50 times this month. Please come back next month!",
    viewHistory: "View History",
    remaining: "{count} donations remaining this month",
    myDonations: "My Donations",
    total: "Total: {amount}",
  },
};

export function DonationLimitBanner({ language, onViewHistory }: DonationLimitBannerProps) {
  const t = translations[language];
  const [stats, setStats] = React.useState(getUserStats());
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Refresh stats
    setStats(getUserStats());
  }, []);

  if (!mounted) return null;

  const canDonate = canDonateThisMonth();

  return (
    <div className="space-y-4">
      {/* User Stats Button */}
      {stats.totalDonations > 0 && (
        <Button
          onClick={onViewHistory}
          variant="outline"
          className="w-full border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 group"
        >
          <History className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
          <span className="flex-1 text-left">
            {t.myDonations}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              {stats.totalDonations}
            </Badge>
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
        </Button>
      )}

      {/* Limit Warning */}
      {!canDonate && (
        <div className="p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">
                {t.limitReached}
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                {t.limitReachedDesc.replace("{count}", String(stats.thisMonthDonations))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Remaining Count */}
      {canDonate && stats.thisMonthDonations > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
            {t.remaining.replace("{count}", String(stats.remainingThisMonth))}
          </p>
        </div>
      )}
    </div>
  );
}

