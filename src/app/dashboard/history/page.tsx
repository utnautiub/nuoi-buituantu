"use client";

import * as React from "react";
import { History, TrendingUp, Award, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getUserStats,
  getUserDonationHistory,
  cleanupOldDonations,
  type UserDonation,
} from "@/lib/donation-tracker";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    donateNow: "Donate now",
  },
};

export default function HistoryPage() {
  const [language, setLanguage] = React.useState<"vi" | "en">("vi");
  const [stats, setStats] = React.useState(getUserStats());
  const [history, setHistory] = React.useState<UserDonation[]>([]);

  React.useEffect(() => {
    const savedLang = localStorage.getItem("language") as "vi" | "en" | null;
    if (savedLang) setLanguage(savedLang);

    // Cleanup old donations first
    cleanupOldDonations();
    
    // Load fresh data
    setStats(getUserStats());
    setHistory(getUserDonationHistory());
  }, []);

  const t = translations[language];

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <History className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          {t.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">{t.subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t.stats.total}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {formatCurrency(stats.totalAmount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t.stats.count}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalDonations}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t.stats.thisMonth}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.thisMonthDonations}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t.stats.remaining}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.remainingThisMonth}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly limit info */}
      {stats.thisMonthDonations > 0 && (
        <Card>
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
      )}

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            {t.history}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              <Link href="/#donate">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  {t.donateNow}
                </Button>
              </Link>
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
      </Card>
    </div>
  );
}

