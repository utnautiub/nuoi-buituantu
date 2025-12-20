"use client";

import * as React from "react";
import { Trophy, TrendingUp, Flame, Gift } from "lucide-react";
import { Donation } from "@/types/donation";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Timestamp } from "firebase/firestore";

interface HallOfFameStatsProps {
  donations: Donation[];
  language: "vi" | "en";
}

const translations = {
  vi: {
    topDonors: "Top Donors",
    recentLarge: "Donate Lớn Gần Đây",
    monthlyTrend: "Xu Hướng Tháng",
    topStreak: "Đóng Góp Thường Xuyên",
    donations: "lần",
    noData: "Chưa có dữ liệu",
    viewAll: "Xem tất cả",
  },
  en: {
    topDonors: "Top Donors",
    recentLarge: "Recent Large Donations",
    monthlyTrend: "Monthly Trend",
    topStreak: "Top Streak",
    donations: "donations",
    noData: "No data yet",
    viewAll: "View all",
  },
};

export function HallOfFameStats({ donations, language }: HallOfFameStatsProps) {
  const t = translations[language];

  // Calculate top donors
  const topDonors = React.useMemo(() => {
    const donorMap = new Map<string, { name: string; total: number; count: number }>();
    
    donations.forEach((d) => {
      const name = d.donorName || "Ẩn danh";
      const existing = donorMap.get(name);
      if (existing) {
        existing.total += d.amount;
        existing.count += 1;
      } else {
        donorMap.set(name, { name, total: d.amount, count: 1 });
      }
    });
    
    return Array.from(donorMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
  }, [donations]);

  // Get recent large donations (>= 100k)
  const recentLarge = React.useMemo(() => {
    return donations
      .filter((d) => d.amount >= 100000)
      .slice(0, 3);
  }, [donations]);

  // Calculate monthly trend
  const monthlyData = React.useMemo(() => {
    const monthMap = new Map<string, number>();
    
    donations.forEach((d) => {
      const date = d.createdAt instanceof Timestamp 
        ? d.createdAt.toDate() 
        : new Date(d.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
    });
    
    return Array.from(monthMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 6)
      .reverse();
  }, [donations]);

  // Calculate streak (donors with most consistent donations)
  const streakLeaders = React.useMemo(() => {
    const donorMonthsMap = new Map<string, Set<string>>();
    
    donations.forEach((d) => {
      const name = d.donorName || "Ẩn danh";
      const date = d.createdAt instanceof Timestamp 
        ? d.createdAt.toDate() 
        : new Date(d.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      
      if (!donorMonthsMap.has(name)) {
        donorMonthsMap.set(name, new Set());
      }
      donorMonthsMap.get(name)!.add(monthKey);
    });
    
    return Array.from(donorMonthsMap.entries())
      .map(([name, months]) => ({ name, streak: months.size }))
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 3);
  }, [donations]);

  const maxMonthly = Math.max(...monthlyData.map(([_, count]) => count), 1);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Top 3 Donors Podium */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          {t.topDonors}
        </h3>
        
        {topDonors.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {topDonors.map((donor, index) => {
              const medals = ["🥇", "🥈", "🥉"];
              const colors = [
                "from-yellow-500 to-orange-500",
                "from-slate-400 to-slate-500",
                "from-orange-600 to-orange-700",
              ];
              
              return (
                <Card
                  key={index}
                  className={`relative p-3 sm:p-4 text-center border-2 ${
                    index === 0 ? "border-yellow-400 scale-105" : "border-slate-200 dark:border-slate-800"
                  } transition-all hover:scale-110`}
                >
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${colors[index]} flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg`}>
                    {index + 1}
                  </div>
                  <div className="text-3xl sm:text-4xl mb-2 mt-2">{medals[index]}</div>
                  <p className="font-semibold text-xs sm:text-sm truncate mb-1">
                    {donor.name}
                  </p>
                  <p className="text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {formatCurrency(donor.total)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {donor.count} {t.donations}
                  </p>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">{t.noData}</p>
        )}
      </div>

      {/* Recent Large Donations & Monthly Trend */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Recent Large Donations */}
        <div>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Gift className="w-4 h-4 text-pink-500" />
            {t.recentLarge}
          </h3>
          <div className="space-y-2">
            {recentLarge.length > 0 ? (
              recentLarge.map((donation, index) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg border border-pink-200 dark:border-pink-900/30"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs sm:text-sm truncate">
                      {donation.donorName || "Ẩn danh"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {donation.description}
                    </p>
                  </div>
                  <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white border-0 ml-2 flex-shrink-0">
                    {formatCurrency(donation.amount)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4 text-xs">{t.noData}</p>
            )}
          </div>
        </div>

        {/* Monthly Trend */}
        <div>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            {t.monthlyTrend}
          </h3>
          <div className="space-y-2">
            {monthlyData.length > 0 ? (
              monthlyData.map(([month, count]) => (
                <div key={month} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">{month}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                      style={{ width: `${(count / maxMonthly) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4 text-xs">{t.noData}</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Streak */}
      <div>
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          {t.topStreak}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {streakLeaders.length > 0 ? (
            streakLeaders.map((leader, index) => (
              <div
                key={index}
                className="p-2 sm:p-3 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border border-orange-200 dark:border-orange-900/30 text-center"
              >
                <div className="text-2xl mb-1">🔥</div>
                <p className="font-semibold text-xs truncate">{leader.name}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 font-bold">
                  {leader.streak} {language === "vi" ? "tháng" : "months"}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-slate-500 dark:text-slate-400 py-4 text-xs">
              {t.noData}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

