"use client";

import * as React from "react";
import { Sparkles, Heart, Zap, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  language: "vi" | "en";
  onScrollToPricing?: () => void;
  onScrollToDonate?: () => void;
  stats?: {
    supporters: number;
    projects: number;
    coffees: number;
  };
}

const translations = {
  vi: {
    badge: "🎨 Nền tảng sáng tạo & hỗ trợ",
    title: "Nuôi Bùi Tuấn Tú",
    subtitle: "Để mình tiếp tục tạo ra những thứ",
    subtitleHighlight: "ngầu lòi",
    description: "Mỗi đóng góp của bạn giúp mình có thêm động lực code những project xịn xò, viết blog hay ho, và chia sẻ kiến thức miễn phí cho cộng đồng! 🚀",
    ctaPrimary: "Chọn gói nuôi",
    ctaSecondary: "Donate ngay",
    stats: {
      supporters: "Người ủng hộ",
      projects: "Projects",
      coffees: "Cốc cà phê",
    },
    scroll: "Khám phá thêm",
  },
  en: {
    badge: "🎨 Creative & Support Platform",
    title: "Support Bui Tuan Tu",
    subtitle: "Help me continue creating",
    subtitleHighlight: "awesome things",
    description: "Every contribution helps me stay motivated to code cool projects, write helpful blogs, and share knowledge freely with the community! 🚀",
    ctaPrimary: "Choose a tier",
    ctaSecondary: "Donate now",
    stats: {
      supporters: "Supporters",
      projects: "Projects",
      coffees: "Coffees",
    },
    scroll: "Explore more",
  },
};

export function HeroSection({ language, onScrollToPricing, onScrollToDonate, stats }: HeroSectionProps) {
  const t = translations[language];
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Calculate dynamic stats
  const supporters = stats?.supporters || 0;
  const projects = 42; // This could be from a separate collection
  const coffees = Math.floor((stats?.coffees || 0) / 50000); // Assuming 50k per coffee

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s", animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "7s", animationDelay: "1.5s" }} />
      </div>

      {/* Grid pattern overlay - using CSS pattern instead of SVG */}
      <div 
        className="absolute inset-0 opacity-10 dark:opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400 animate-pulse" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {t.badge}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            {t.title}
          </span>
        </h1>

        {/* Subtitle */}
        <div className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 text-slate-700 dark:text-slate-300 animate-in fade-in slide-in-from-top-8 duration-700 delay-200">
          {t.subtitle}{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
              {t.subtitleHighlight}
            </span>
            <svg
              className="absolute -bottom-2 left-0 w-full text-emerald-500/30 dark:text-emerald-400/30"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
            >
              <path
                d="M0,7 Q50,0 100,7 T200,7"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>
          </span>
        </div>

        {/* Description */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-top-10 duration-700 delay-300">
          {t.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-in fade-in slide-in-from-top-12 duration-700 delay-400">
          <Button
            onClick={onScrollToPricing}
            size="lg"
            className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 rounded-xl font-semibold text-lg group animate-gradient bg-[length:200%_auto]"
          >
            <Heart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            {t.ctaPrimary}
          </Button>

          <Button
            onClick={onScrollToDonate}
            size="lg"
            variant="outline"
            className="w-full sm:w-auto h-14 px-8 border-2 border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-300 rounded-xl font-semibold text-lg group"
          >
            <Zap className="mr-2 h-5 w-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            {t.ctaSecondary}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="group cursor-default">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
              {supporters}+
            </div>
            <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              {t.stats.supporters}
            </div>
          </div>
          <div className="group cursor-default">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
              {projects}+
            </div>
            <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              {t.stats.projects}
            </div>
          </div>
          <div className="group cursor-default">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
              {coffees.toLocaleString()}+
            </div>
            <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              {t.stats.coffees} ☕
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {t.scroll}
            </span>
            <ArrowDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
        </div>
      </div>
    </section>
  );
}

