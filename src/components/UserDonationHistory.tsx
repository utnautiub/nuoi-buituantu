"use client";

import * as React from "react";
import { History, TrendingUp, Award, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getUserStats,
  getUserDonationHistory,
  cleanupOldDonations,
  type UserDonation,
} from "@/lib/donation-tracker";
import { formatCurrency } from "@/lib/utils";

interface UserDonationHistoryProps {
  language: "vi" | "en";
  isOpen: boolean;
  onClose: () => void;
}

const translations = {
  vi: {
    title: "Lịch sử donate của bạn",
    subtitle: "Cảm ơn bạn đã ủng hộ! 💝",
    stats: {
      total: "Tổng donate",
      count: "Số lần",
      thisMonth: "Tháng này",
      remaining: "Còn lại",
      limit: "Giới hạn",
    },
    history: "Các lần donate",
    empty: "Bạn chưa donate lần nào",
    emptyDesc: "Mỗi đóng góp của bạn đều được ghi nhận và trân trọng!",
    close: "Đóng",
    donateNow: "Donate ngay",
  },
  en: {
    title: "Your Donation History",
    subtitle: "Thank you for your support! 💝",
    stats: {
      total: "Total Donated",
      count: "Times",
      thisMonth: "This Month",
      remaining: "Remaining",
      limit: "Limit",
    },
    history: "Donation History",
    empty: "No donations yet",
    emptyDesc: "Every contribution is appreciated and valued!",
    close: "Close",
    donateNow: "Donate now",
  },
};

export function UserDonationHistory({ language, isOpen, onClose }: UserDonationHistoryProps) {
  const t = translations[language];
  const [stats, setStats] = React.useState(getUserStats());
  const [history, setHistory] = React.useState<UserDonation[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      // Cleanup old donations first
      cleanupOldDonations();
      
      // Load fresh data
      setStats(getUserStats());
      setHistory(getUserDonationHistory());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <History className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                {t.title}
              </CardTitle>
              <CardDescription className="mt-2">{t.subtitle}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 border-b">
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {formatCurrency(stats.totalAmount)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {t.stats.total}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalDonations}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {t.stats.count}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.thisMonthDonations}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {t.stats.thisMonth}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.remainingThisMonth}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {t.stats.remaining}
            </div>
          </div>
        </div>

        {/* Monthly limit info */}
        {stats.thisMonthDonations > 0 && (
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.stats.limit}: {stats.thisMonthDonations}/50
                </span>
              </div>
              <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                  style={{ width: `${(stats.thisMonthDonations / 50) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* History List */}
        <CardContent className="flex-1 overflow-y-auto p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            {t.history}
          </h3>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium mb-2">
                {t.empty}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                {t.emptyDesc}
              </p>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {t.donateNow}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((donation, index) => (
                <div
                  key={donation.id}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white border-0"
                        >
                          #{history.length - index}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(donation.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {donation.description || (language === "vi" ? "Không có ghi chú" : "No note")}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                        {formatCurrency(donation.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="border-t p-4 bg-slate-50 dark:bg-slate-900/50">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            {t.close}
          </Button>
        </div>
      </Card>
    </div>
  );
}

