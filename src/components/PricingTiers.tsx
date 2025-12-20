"use client";

import * as React from "react";
import { Check, Sparkles, Zap, Crown, Heart, Coffee, Pizza, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PricingTier {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  period: "day" | "month" | "year" | "lifetime";
  periodDays?: number; // Number of days for day period
  icon: React.ReactNode;
  color: string;
  gradient: string;
  popular?: boolean;
  features: string[];
  featuresEn: string[];
  perks: string[];
  perksEn: string[];
  emoji: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "trial-7d",
    name: "Thử Nghiệm 7 Ngày 🎁",
    nameEn: "7-Day Trial 🎁",
    price: 20000,
    period: "day",
    periodDays: 7,
    icon: <Sparkles className="w-6 h-6" />,
    emoji: "🎁",
    color: "from-green-500 to-emerald-500",
    gradient: "from-green-500/20 to-emerald-500/20",
    features: [
      "Donate 20k cho 7 ngày",
      "Trải nghiệm đầy đủ quyền lợi",
      "Tên hiển thị trên Hall of Fame",
      "Badge thử nghiệm",
    ],
    featuresEn: [
      "20k for 7 days",
      "Full benefits experience",
      "Name on Hall of Fame",
      "Trial badge",
    ],
    perks: [
      "🎯 Trải nghiệm tất cả tính năng",
      "💬 Tham gia community",
      "📧 Newsletter",
    ],
    perksEn: [
      "🎯 Experience all features",
      "💬 Join community",
      "📧 Newsletter",
    ],
  },
  {
    id: "trial-14d",
    name: "Thử Nghiệm 14 Ngày ⭐",
    nameEn: "14-Day Trial ⭐",
    price: 35000,
    period: "day",
    periodDays: 14,
    icon: <Zap className="w-6 h-6" />,
    emoji: "⭐",
    color: "from-blue-500 to-cyan-500",
    gradient: "from-blue-500/20 to-cyan-500/20",
    features: [
      "Donate 35k cho 14 ngày",
      "Tất cả quyền lợi của gói 7 ngày",
      "Ưu tiên hỗ trợ",
      "Early access tính năng mới",
    ],
    featuresEn: [
      "35k for 14 days",
      "All 7-day benefits",
      "Priority support",
      "Early access to new features",
    ],
    perks: [
      "🎨 Preview các dự án sắp ra",
      "💬 Tham gia Discord",
      "📧 Weekly newsletter",
    ],
    perksEn: [
      "🎨 Preview upcoming projects",
      "💬 Join Discord",
      "📧 Weekly newsletter",
    ],
  },
  {
    id: "coffee",
    name: "Cà Phê ☕",
    nameEn: "Coffee ☕",
    price: 50000,
    period: "month",
    icon: <Coffee className="w-6 h-6" />,
    emoji: "☕",
    color: "from-amber-500 to-orange-500",
    gradient: "from-amber-500/20 to-orange-500/20",
    features: [
      "Donate hàng tháng 50k",
      "Tên hiển thị trên Hall of Fame",
      "Badge độc quyền trên profile",
      "Cảm ơn riêng trên social media",
    ],
    featuresEn: [
      "Monthly 50k donation",
      "Name on Hall of Fame",
      "Exclusive profile badge",
      "Personal shoutout on social media",
    ],
    perks: [
      "🎨 Early access các dự án mới",
      "💬 Tham gia Discord VIP",
      "📧 Newsletter hàng tuần",
    ],
    perksEn: [
      "🎨 Early access to new projects",
      "💬 Join VIP Discord",
      "📧 Weekly newsletter",
    ],
  },
  {
    id: "pizza",
    name: "Pizza 🍕",
    nameEn: "Pizza 🍕",
    price: 100000,
    period: "month",
    icon: <Pizza className="w-6 h-6" />,
    emoji: "🍕",
    color: "from-red-500 to-pink-500",
    gradient: "from-red-500/20 to-pink-500/20",
    popular: true,
    features: [
      "Donate hàng tháng 100k",
      "Tất cả quyền lợi của gói Cà Phê",
      "Tên hiển thị to hơn + icon đặc biệt",
      "Vote cho tính năng mới",
      "Access vào private repo",
    ],
    featuresEn: [
      "Monthly 100k donation",
      "All Coffee tier benefits",
      "Bigger name + special icon",
      "Vote for new features",
      "Access to private repos",
    ],
    perks: [
      "🎯 Priority support",
      "🎁 Tặng swag hàng quý",
      "🎮 Beta tester cho features mới",
      "📸 Shoutout hàng tuần",
    ],
    perksEn: [
      "🎯 Priority support",
      "🎁 Quarterly swag gifts",
      "🎮 Beta tester for new features",
      "📸 Weekly shoutout",
    ],
  },
  {
    id: "vip-yearly",
    name: "VIP Năm 🌟",
    nameEn: "VIP Year 🌟",
    price: 1000000,
    period: "year",
    icon: <Star className="w-6 h-6" />,
    emoji: "🌟",
    color: "from-purple-500 to-indigo-500",
    gradient: "from-purple-500/20 to-indigo-500/20",
    features: [
      "Donate 1 triệu/năm (tiết kiệm 200k!)",
      "Tất cả quyền lợi của gói Pizza",
      "Badge VIP Annual độc quyền",
      "1 giờ video call 1-1 mỗi quý",
      "Custom feature request",
    ],
    featuresEn: [
      "1M/year donation (save 200k!)",
      "All Pizza tier benefits",
      "Exclusive VIP Annual badge",
      "1 hour 1-1 video call per quarter",
      "Custom feature request",
    ],
    perks: [
      "👑 VIP role trên Discord",
      "🎨 Commission 1 dự án cá nhân",
      "🎤 Xuất hiện trên podcast/stream",
      "🎉 Gửi quà sinh nhật",
    ],
    perksEn: [
      "👑 VIP role on Discord",
      "🎨 Commission 1 personal project",
      "🎤 Appear on podcast/stream",
      "🎉 Birthday gift delivery",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime Legend 👑",
    nameEn: "Lifetime Legend 👑",
    price: 10000000,
    period: "lifetime",
    icon: <Crown className="w-6 h-6" />,
    emoji: "👑",
    color: "from-yellow-500 via-orange-500 to-red-500",
    gradient: "from-yellow-500/20 via-orange-500/20 to-red-500/20",
    features: [
      "Donate 10 triệu 1 lần duy nhất",
      "MỌI quyền lợi trên, MÃI MÃI",
      "Tên vào 'Founding Members' vĩnh viễn",
      "Badge Legend độc quyền + animated",
      "Video call 1-1 không giới hạn",
      "Collaborate trong 1 dự án lớn",
    ],
    featuresEn: [
      "One-time 10M donation",
      "ALL benefits above, FOREVER",
      "Name in 'Founding Members' forever",
      "Exclusive Legend badge + animated",
      "Unlimited 1-1 video calls",
      "Collaborate on 1 major project",
    ],
    perks: [
      "💎 Lifetime Discord Nitro",
      "🏆 Tên trên trang credits mãi mãi",
      "🎁 Annual care package",
      "🌟 Co-author credit trong projects",
      "💝 Tặng NFT/Digital collectible độc quyền",
    ],
    perksEn: [
      "💎 Lifetime Discord Nitro",
      "🏆 Name on credits page forever",
      "🎁 Annual care package",
      "🌟 Co-author credit in projects",
      "💝 Exclusive NFT/Digital collectible",
    ],
  },
];

interface PricingTiersProps {
  language: "vi" | "en";
  onSelectTier?: (tier: PricingTier) => void;
}

const translations = {
  vi: {
    title: "Chọn Gói Nuôi",
    subtitle: "Mỗi gói đều đi kèm với yêu thương và sự hỗ trợ của bạn 💝",
    perMonth: "/tháng",
    perYear: "/năm",
    oneTime: "1 lần",
    popular: "Phổ biến nhất",
    features: "Những gì bạn nhận được",
    perks: "Đặc quyền thêm",
    selectPlan: "Chọn gói này",
    comingSoon: "Sắp ra mắt",
  },
  en: {
    title: "Choose Your Support Tier",
    subtitle: "Every tier comes with love and your support 💝",
    perMonth: "/month",
    perYear: "/year",
    oneTime: "one-time",
    popular: "Most Popular",
    features: "What you get",
    perks: "Extra Perks",
    selectPlan: "Select Plan",
    comingSoon: "Coming Soon",
  },
};

export function PricingTiers({ language, onSelectTier }: PricingTiersProps) {
  const t = translations[language];
  const [hoveredTier, setHoveredTier] = React.useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPeriodText = (tier: PricingTier) => {
    if (tier.period === "day" && tier.periodDays) {
      return language === "vi" ? `/${tier.periodDays} ngày` : `/${tier.periodDays} days`;
    }
    if (tier.period === "month") return t.perMonth;
    if (tier.period === "year") return t.perYear;
    return t.oneTime;
  };

  return (
    <div className="w-full py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent">
          {t.title}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {PRICING_TIERS.map((tier, index) => (
          <div
            key={tier.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: `${index * 100}ms` }}
            onMouseEnter={() => setHoveredTier(tier.id)}
            onMouseLeave={() => setHoveredTier(null)}
          >
            <Card
              className={cn(
                "relative h-full flex flex-col border-2 transition-all duration-300",
                hoveredTier === tier.id
                  ? "scale-105 shadow-2xl border-transparent"
                  : "hover:scale-102 shadow-lg",
                tier.popular && "ring-2 ring-purple-500 dark:ring-purple-400"
              )}
            >
              {/* Gradient background */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-5 dark:opacity-10 rounded-lg transition-opacity duration-300",
                tier.color,
                hoveredTier === tier.id && "opacity-20 dark:opacity-30"
              )} />

              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg px-4 py-1.5 text-sm font-semibold">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {t.popular}
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4 pt-8 relative z-10">
                {/* Icon */}
                <div className={cn(
                  "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 mx-auto shadow-lg",
                  tier.color
                )}>
                  <div className="text-white">
                    {tier.icon}
                  </div>
                </div>

                {/* Name */}
                <CardTitle className="text-2xl text-center mb-2">
                  {language === "vi" ? tier.name : tier.nameEn}
                </CardTitle>

                {/* Price */}
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={cn(
                      "text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                      tier.color
                    )}>
                      {formatPrice(tier.price)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {getPeriodText(tier)}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col relative z-10">
                {/* Features */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    {t.features}
                  </p>
                  <ul className="space-y-2">
                    {(language === "vi" ? tier.features : tier.featuresEn).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Perks */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    {t.perks}
                  </p>
                  <ul className="space-y-1.5">
                    {(language === "vi" ? tier.perks : tier.perksEn).map((perk, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-400">
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => onSelectTier?.(tier)}
                  className={cn(
                    "w-full mt-auto bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden",
                    tier.color
                  )}
                  size="lg"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {t.selectPlan}
                  </span>
                  {/* Shine effect */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500" />
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Fun note */}
      <div className="text-center mt-12 animate-in fade-in duration-700 delay-500">
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
          {language === "vi" 
            ? "✨ Mỗi đồng donate đều giúp tôi tiếp tục tạo ra những thứ cool ngầu hơn! 🚀"
            : "✨ Every donation helps me create cooler stuff! 🚀"
          }
        </p>
      </div>
    </div>
  );
}

