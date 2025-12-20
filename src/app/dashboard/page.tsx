"use client";

import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, TrendingUp, Award, Calendar, Heart, AlertTriangle, Crown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getUserStats } from "@/lib/donation-tracker";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Subscription, getDaysUntilExpiry, isSubscriptionExpired } from "@/types/subscription";

const translations = {
  vi: {
    title: "Dashboard",
    subtitle: "Tổng quan về hoạt động của bạn",
    stats: {
      total: "Tổng donate",
      count: "Số lần",
      thisMonth: "Tháng này",
      remaining: "Còn lại",
    },
    quickActions: "Thao tác nhanh",
    viewHistory: "Xem lịch sử",
    settings: "Cài đặt",
    donateNow: "Donate ngay",
    subscription: {
      title: "Gói đăng ký",
      active: "Đang hoạt động",
      expired: "Đã hết hạn",
      noSubscription: "Chưa có gói đăng ký",
      expiresIn: "Hết hạn sau",
      days: "ngày",
      lifetime: "Vĩnh viễn",
      renewNow: "Gia hạn ngay",
      expiresSoon: "Sắp hết hạn",
    },
  },
  en: {
    title: "Dashboard",
    subtitle: "Overview of your activity",
    stats: {
      total: "Total Donated",
      count: "Times",
      thisMonth: "This Month",
      remaining: "Remaining",
    },
    quickActions: "Quick Actions",
    viewHistory: "View History",
    settings: "Settings",
    donateNow: "Donate now",
    subscription: {
      title: "Subscription",
      active: "Active",
      expired: "Expired",
      noSubscription: "No active subscription",
      expiresIn: "Expires in",
      days: "days",
      lifetime: "Lifetime",
      renewNow: "Renew Now",
      expiresSoon: "Expires Soon",
    },
  },
};

export default function DashboardPage() {
  const { user, userData } = useAuth();
  const [language, setLanguage] = React.useState<"vi" | "en">("vi");
  const [stats, setStats] = React.useState(getUserStats());
  const [subscription, setSubscription] = React.useState<Subscription | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const savedLang = localStorage.getItem("language") as "vi" | "en" | null;
    if (savedLang) setLanguage(savedLang);
    
    // Refresh stats
    setStats(getUserStats());
  }, []);

  React.useEffect(() => {
    async function fetchSubscription() {
      if (!user) return;
      
      try {
        const subscriptionsRef = collection(db, "subscriptions");
        const q = query(
          subscriptionsRef,
          where("userId", "==", user.uid),
          where("status", "==", "active")
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const subData = snapshot.docs[0].data();
          setSubscription({
            id: snapshot.docs[0].id,
            ...subData,
            startDate: subData.startDate instanceof Timestamp ? subData.startDate.toDate() : subData.startDate,
            endDate: subData.endDate instanceof Timestamp ? subData.endDate.toDate() : subData.endDate,
            createdAt: subData.createdAt instanceof Timestamp ? subData.createdAt.toDate() : subData.createdAt,
            updatedAt: subData.updatedAt instanceof Timestamp ? subData.updatedAt.toDate() : subData.updatedAt,
          } as Subscription);
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [user]);

  const t = translations[language];

  if (!user) return null;

  const daysUntilExpiry = subscription ? getDaysUntilExpiry(subscription) : null;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            {t.quickActions}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/history">
              <Button variant="outline" className="gap-2">
                <Award className="w-4 h-4" />
                {t.viewHistory}
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                {t.settings}
              </Button>
            </Link>
            <Link href="/#donate">
              <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <TrendingUp className="w-4 h-4" />
                {t.donateNow}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Status */}
      <Card className={isExpiringSoon ? "border-orange-500 dark:border-orange-400" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            {t.subscription.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-500">{language === "vi" ? "Đang tải..." : "Loading..."}</p>
          ) : subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{subscription.tierName.includes("🎁") ? "🎁" : subscription.tierName.includes("⭐") ? "⭐" : subscription.tierName.includes("☕") ? "☕" : subscription.tierName.includes("🍕") ? "🍕" : subscription.tierName.includes("🌟") ? "🌟" : subscription.tierName.includes("👑") ? "👑" : ""}</span>
                    <h3 className="text-lg font-semibold">
                      {language === "vi" ? subscription.tierName : subscription.tierNameEn}
                    </h3>
                    <Badge variant={isSubscriptionExpired(subscription) ? "destructive" : "default"}>
                      {isSubscriptionExpired(subscription) ? t.subscription.expired : t.subscription.active}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      maximumFractionDigits: 0,
                    }).format(subscription.price)}
                  </p>
                </div>
              </div>
              
              {isExpiringSoon && (
                <div className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">{t.subscription.expiresSoon}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    {language === "vi" ? "Bắt đầu:" : "Started:"}
                  </span>
                  <span className="font-medium">
                    {subscription.startDate instanceof Date 
                      ? subscription.startDate.toLocaleDateString("vi-VN")
                      : (subscription.startDate as any)?.toDate?.().toLocaleDateString("vi-VN") || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    {subscription.period === "lifetime" 
                      ? (language === "vi" ? "Hết hạn:" : "Expires:")
                      : (language === "vi" ? "Hết hạn:" : "Expires:")}
                  </span>
                  <span className="font-medium">
                    {subscription.period === "lifetime" ? (
                      <Badge variant="secondary">{t.subscription.lifetime}</Badge>
                    ) : subscription.endDate ? (
                      <>
                        {subscription.endDate instanceof Date 
                          ? subscription.endDate.toLocaleDateString("vi-VN")
                          : (subscription.endDate as any)?.toDate?.().toLocaleDateString("vi-VN") || "N/A"}
                        {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
                          <span className="ml-2 text-xs text-slate-500">
                            ({t.subscription.expiresIn} {daysUntilExpiry} {t.subscription.days})
                          </span>
                        )}
                      </>
                    ) : "N/A"}
                  </span>
                </div>
              </div>
              
              {isExpiringSoon && (
                <Link href="/#donate">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    {t.subscription.renewNow}
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-500 dark:text-slate-400 mb-4">{t.subscription.noSubscription}</p>
              <Link href="/#donate">
                <Button variant="outline">{t.donateNow}</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Tên hiển thị:</span>
              <p className="font-medium">{userData?.displayName || user.email}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Email:</span>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

