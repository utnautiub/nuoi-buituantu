"use client";

import * as React from "react";
import { Code, Heart, Rocket, Zap, Star, Trophy, Gift, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PerksProps {
  language: "vi" | "en";
}

const translations = {
  vi: {
    title: "Tiền của bạn được dùng vào đâu?",
    subtitle: "Mỗi đóng góp đều giúp mình tạo ra nhiều giá trị hơn cho cộng đồng! 🎯",
    perks: [
      {
        icon: <Code className="w-6 h-6" />,
        title: "Open Source Projects",
        description: "Phát triển và maintain các dự án mã nguồn mở miễn phí",
        color: "from-blue-500 to-cyan-500",
      },
      {
        icon: <Heart className="w-6 h-6" />,
        title: "Blog & Tutorials",
        description: "Viết blog, hướng dẫn kỹ thuật, chia sẻ kinh nghiệm",
        color: "from-pink-500 to-rose-500",
      },
      {
        icon: <Rocket className="w-6 h-6" />,
        title: "Tools & Libraries",
        description: "Tạo ra các công cụ, thư viện hữu ích cho developers",
        color: "from-purple-500 to-indigo-500",
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "Live Coding",
        description: "Stream coding trực tiếp, giải đáp thắc mắc",
        color: "from-yellow-500 to-orange-500",
      },
      {
        icon: <Star className="w-6 h-6" />,
        title: "Content Creation",
        description: "Videos, podcasts, và nội dung giáo dục chất lượng",
        color: "from-emerald-500 to-green-500",
      },
      {
        icon: <Trophy className="w-6 h-6" />,
        title: "Community Events",
        description: "Tổ chức workshop, meetup, hackathon cho cộng đồng",
        color: "from-amber-500 to-red-500",
      },
      {
        icon: <Gift className="w-6 h-6" />,
        title: "Free Resources",
        description: "Tạo templates, boilerplates, starter kits miễn phí",
        color: "from-teal-500 to-cyan-500",
      },
      {
        icon: <Users className="w-6 h-6" />,
        title: "Mentorship",
        description: "Hỗ trợ, mentor cho các bạn mới bắt đầu",
        color: "from-violet-500 to-purple-500",
      },
    ],
  },
  en: {
    title: "Where does your money go?",
    subtitle: "Every contribution helps me create more value for the community! 🎯",
    perks: [
      {
        icon: <Code className="w-6 h-6" />,
        title: "Open Source Projects",
        description: "Develop and maintain free open source projects",
        color: "from-blue-500 to-cyan-500",
      },
      {
        icon: <Heart className="w-6 h-6" />,
        title: "Blog & Tutorials",
        description: "Write blogs, technical guides, share experiences",
        color: "from-pink-500 to-rose-500",
      },
      {
        icon: <Rocket className="w-6 h-6" />,
        title: "Tools & Libraries",
        description: "Create useful tools and libraries for developers",
        color: "from-purple-500 to-indigo-500",
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "Live Coding",
        description: "Live coding streams, Q&A sessions",
        color: "from-yellow-500 to-orange-500",
      },
      {
        icon: <Star className="w-6 h-6" />,
        title: "Content Creation",
        description: "Videos, podcasts, and quality educational content",
        color: "from-emerald-500 to-green-500",
      },
      {
        icon: <Trophy className="w-6 h-6" />,
        title: "Community Events",
        description: "Organize workshops, meetups, hackathons",
        color: "from-amber-500 to-red-500",
      },
      {
        icon: <Gift className="w-6 h-6" />,
        title: "Free Resources",
        description: "Create free templates, boilerplates, starter kits",
        color: "from-teal-500 to-cyan-500",
      },
      {
        icon: <Users className="w-6 h-6" />,
        title: "Mentorship",
        description: "Support and mentor beginners",
        color: "from-violet-500 to-purple-500",
      },
    ],
  },
};

export function PerksSection({ language }: PerksProps) {
  const t = translations[language];

  return (
    <div className="w-full py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.perks.map((perk, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card className="group h-full border-slate-200 dark:border-slate-800 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden relative cursor-default">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${perk.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300`} />

                <CardContent className="p-6 relative z-10">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${perk.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {perk.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">
                    {perk.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {perk.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Fun fact */}
        <div className="text-center mt-12 animate-in fade-in duration-700 delay-500">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200/50 dark:border-purple-800/50 rounded-full">
            <span className="text-3xl animate-bounce">☕</span>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {language === "vi" 
                ? "1 cốc cà phê = ~2 giờ coding = 1 feature mới!"
                : "1 coffee = ~2 hours coding = 1 new feature!"
              }
            </p>
            <span className="text-3xl animate-bounce" style={{ animationDelay: "0.2s" }}>🚀</span>
          </div>
        </div>
      </div>
    </div>
  );
}

