"use client";

import * as React from "react";
import { Moon, Sun, Globe, Search, ArrowDown, ArrowUp, Check, Languages, Monitor, Sparkles, LogIn } from "lucide-react";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { DonationList } from "@/components/DonationList";
import { PricingTiers } from "@/components/PricingTiers";
import { HeroSection } from "@/components/HeroSection";
import { GenerativeArtCanvas } from "@/components/GenerativeArtCanvas";
import { PerksSection } from "@/components/PerksSection";
import { DonationLimitBanner } from "@/components/DonationLimitBanner";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserMenu } from "@/components/auth/UserMenu";
import { HallOfFameStats } from "@/components/HallOfFameStats";
import { useAuth } from "@/contexts/AuthContext";
import { Donation } from "@/types/donation";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const translations = {
  vi: {
    title: "Nuôi Bùi Tuấn Tú",
    donations: "Lượt donate",
    totalAmount: "Tổng donate",
    qrTitle: "Donate nhanh qua QR",
    statement: "Bảng vàng danh dự",
    search: "Tìm theo tên, nội dung, số tiền...",
    sortBy: "Sắp xếp theo",
    sortDate: "Thời gian",
    sortAmount: "Số tiền",
    orderDesc: "Mới nhất / Cao nhất",
    orderAsc: "Cũ nhất / Thấp nhất",
    clearFilter: "Xóa bộ lọc",
    results: "kết quả",
    hallOfFame: "Hall of Fame 🏆",
    recentSupporters: "Người ủng hộ gần đây",
  },
  en: {
    title: "Support Bui Tuan Tu",
    donations: "Donations",
    totalAmount: "Total Amount",
    qrTitle: "Quick Donate via QR",
    statement: "Hall of Fame",
    search: "Search by name, message, amount...",
    sortBy: "Sort by",
    sortDate: "Date",
    sortAmount: "Amount",
    orderDesc: "Newest / Highest",
    orderAsc: "Oldest / Lowest",
    clearFilter: "Clear filter",
    results: "results",
    hallOfFame: "Hall of Fame 🏆",
    recentSupporters: "Recent Supporters",
  },
};

export default function HomePage() {
  const [donations, setDonations] = React.useState<Donation[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalAmount: 0,
    totalDonations: 0,
  });
  const [darkMode, setDarkMode] = React.useState(false);
  const [language, setLanguage] = React.useState<"vi" | "en">("vi");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = React.useState<"desc" | "asc">("desc");
  const itemsPerPage = 5;

  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authTab, setAuthTab] = React.useState<"login" | "register" | "reset">("login");
  const [selectedTier, setSelectedTier] = React.useState<{
    id: string;
    name: string;
    nameEn: string;
    price: number;
    period: "day" | "month" | "year" | "lifetime";
    periodDays?: number;
    emoji: string;
  } | undefined>(undefined);

  const { user, loading: authLoading } = useAuth();

  const pricingRef = React.useRef<HTMLDivElement>(null);
  const donateRef = React.useRef<HTMLDivElement>(null);

  const t = translations[language];

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToDonate = () => {
    donateRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedLang = localStorage.getItem("language") as "vi" | "en";
    
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleLanguage = () => {
    const newLang = language === "vi" ? "en" : "vi";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  // Real-time Firestore listener
  React.useEffect(() => {
    setIsLoading(true);
    
    const q = query(
      collection(db, "donations"),
      where("status", "==", "completed"),
      orderBy("createdAt", "desc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const donationsList: Donation[] = [];
        let totalAmount = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          const donation: Donation = {
            id: doc.id,
            transactionId: data.transactionId || doc.id,
            amount: data.amount || 0,
            description: data.description || "",
            donorName: data.donorName || "Ẩn danh",
            gateway: data.gateway || "sepay",
            bankAccount: data.bankAccount || "",
            bankName: data.bankName || "",
            status: "completed",
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(),
            transactionDate: data.transactionDate,
            metadata: data.metadata,
          };
          
          donationsList.push(donation);
          totalAmount += donation.amount;
        });

        setDonations(donationsList);
        setStats({
          totalAmount,
          totalDonations: donationsList.length,
        });
        setIsLoading(false);
      },
      (error) => {
        console.error("Firestore listener error:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter and sort donations
  const filteredDonations = React.useMemo(() => {
    let filtered = [...donations];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.donorName?.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.amount.toString().includes(query)
      );
    }
    
    filtered.sort((a, b) => {
      if (sortBy === "amount") {
        return sortOrder === "desc" 
          ? b.amount - a.amount 
          : a.amount - b.amount;
      } else {
        const aDate = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : a.createdAt.getTime();
        const bDate = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : b.createdAt.getTime();
        return sortOrder === "desc" ? bDate - aDate : aDate - bDate;
      }
    });
    
    return filtered;
  }, [donations, searchQuery, sortBy, sortOrder]);
  
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, sortOrder]);
  
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const paginatedDonations = filteredDonations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Generative Art Canvas Background */}
      <GenerativeArtCanvas />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60 transition-all duration-300 shadow-sm">
        <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-1 justify-start">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg ring-2 ring-purple-500/20 dark:ring-purple-400/20 flex-shrink-0">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="hidden sm:block text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] leading-tight">
              {t.title}
            </h1>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* User Menu or Login Button */}
            {authLoading ? (
              <div className="h-9 w-20 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
            ) : user ? (
              <UserMenu 
                language={language}
              />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAuthTab("login");
                  setShowAuthModal(true);
                }}
                className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {language === "vi" ? "Đăng nhập" : "Login"}
              </Button>
            )}

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  <Languages className="h-5 w-5" />
                  <span className="sr-only">Change language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Ngôn ngữ / Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => {
                    setLanguage("vi");
                    localStorage.setItem("language", "vi");
                  }}
                  className="cursor-pointer"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  <span>Tiếng Việt</span>
                  {language === "vi" && <Check className="ml-auto h-4 w-4 text-green-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setLanguage("en");
                    localStorage.setItem("language", "en");
                  }}
                  className="cursor-pointer"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  <span>English</span>
                  {language === "en" && <Check className="ml-auto h-4 w-4 text-green-600" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  {darkMode ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Giao diện / Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => {
                    setDarkMode(false);
                    document.documentElement.classList.remove("dark");
                    localStorage.setItem("theme", "light");
                  }}
                  className="cursor-pointer"
                >
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                  {!darkMode && <Check className="ml-auto h-4 w-4 text-green-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setDarkMode(true);
                    document.documentElement.classList.add("dark");
                    localStorage.setItem("theme", "dark");
                  }}
                  className="cursor-pointer"
                >
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                  {darkMode && <Check className="ml-auto h-4 w-4 text-green-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    setDarkMode(prefersDark);
                    if (prefersDark) {
                      document.documentElement.classList.add("dark");
                    } else {
                      document.documentElement.classList.remove("dark");
                    }
                    localStorage.removeItem("theme");
                  }}
                  className="cursor-pointer"
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection 
        language={language} 
        onScrollToPricing={scrollToPricing}
        onScrollToDonate={scrollToDonate}
        stats={{
          supporters: stats.totalDonations,
          projects: 42,
          coffees: stats.totalAmount,
        }}
      />

      {/* Pricing Tiers Section */}
      <div ref={pricingRef} className="container max-w-7xl mx-auto px-4 md:px-6">
        <PricingTiers 
          language={language}
          onSelectTier={(tier) => {
            setSelectedTier({
              id: tier.id,
              name: tier.name,
              nameEn: tier.nameEn,
              price: tier.price,
              period: tier.period,
              periodDays: tier.periodDays,
              emoji: tier.emoji,
            });
            scrollToDonate();
          }}
        />
      </div>

      {/* Perks Section */}
      <PerksSection language={language} />
      {/* Donate & Stats Section */}
      <main ref={donateRef} className="container max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Stats Cards */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-slate-200 dark:border-slate-800 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <CardHeader className="pb-4 pt-6 relative z-10">
              <CardDescription className="text-sm font-medium text-center">{t.donations}</CardDescription>
              <CardTitle className="text-5xl md:text-6xl font-bold tracking-tight text-center">
                {isLoading ? (
                  <Skeleton className="h-14 w-28 mx-auto bg-slate-200 dark:bg-slate-800" />
                ) : (
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {stats.totalDonations}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-slate-200 dark:border-slate-800 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <CardHeader className="pb-4 pt-6 relative z-10">
              <CardDescription className="text-sm font-medium text-center">{t.totalAmount}</CardDescription>
              <CardTitle className="text-5xl md:text-6xl font-bold tracking-tight text-center">
                {isLoading ? (
                  <Skeleton className="h-14 w-32 mx-auto bg-slate-200 dark:bg-slate-800" />
                ) : (
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      maximumFractionDigits: 0,
                    }).format(stats.totalAmount)}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6 items-start">
          {/* QR Section */}
          <div className="lg:col-span-1 animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
            <Card className="border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-6 pt-6">
                <CardTitle className="text-xl text-center">{t.qrTitle}</CardTitle>
              </CardHeader>
              <CardContent className="pb-8 space-y-4">
                {/* Donation Limit Banner */}
                <DonationLimitBanner 
                  language={language}
                  onViewHistory={() => {
                    // Navigate to history page if logged in
                    if (user) {
                      window.location.href = "/dashboard/history";
                    } else {
                      setShowAuthModal(true);
                      setAuthTab("login");
                    }
                  }}
                />
                
                <QRCodeDisplay 
                  language={language}
                  selectedTier={selectedTier}
                  onTierChange={(tier) => setSelectedTier(tier)}
                  onScrollToPricing={scrollToPricing}
                />
              </CardContent>
            </Card>
          </div>

          {/* Donation List */}
          <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
            <Card className="border-slate-200 dark:border-slate-800 shadow-xl flex flex-col hover:shadow-2xl transition-all duration-300 max-w-full overflow-hidden">
              <CardHeader className="pb-4 pt-6">
                <CardTitle className="text-xl">{t.hallOfFame}</CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col space-y-6">
                {/* Stats Section */}
                <HallOfFameStats donations={donations} language={language} />
                
                {/* Divider */}
                <div className="border-t border-slate-200 dark:border-slate-800" />
                
                {/* Search and Filter */}
                <div className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-hover:text-purple-500 transition-colors duration-200" />
                    <Input
                      placeholder={t.search}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Select value={sortBy} onValueChange={(val) => setSortBy(val as "date" | "amount")}>
                      <SelectTrigger className="h-11 border-slate-300 dark:border-slate-700 focus:ring-purple-500 dark:focus:ring-purple-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">{t.sortDate}</SelectItem>
                        <SelectItem value="amount">{t.sortAmount}</SelectItem>
                      </SelectContent>
                    </Select>
                  
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                      }}
                      className="h-11 w-11 flex-shrink-0 border-slate-300 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-500 dark:hover:border-purple-400 active:scale-95 transition-all duration-200"
                      type="button"
                    >
                      {sortOrder === "desc" ? (
                        <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {(searchQuery || filteredDonations.length < donations.length) && (
                    <div className="flex items-center justify-between text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                      <span className="text-slate-500">
                        {filteredDonations.length} / {donations.length} {t.results}
                      </span>
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchQuery("")}
                          className="h-auto p-0 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-transparent"
                        >
                          {t.clearFilter}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Donation List */}
                <DonationList
                  donations={paginatedDonations}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  language={language}
                  itemsPerPage={itemsPerPage}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm py-8">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            <p>
              {language === "vi" 
                ? "💝 Cảm ơn bạn đã ủng hộ! Mọi đóng góp đều được trân trọng và sử dụng có trách nhiệm."
                : "💝 Thank you for your support! Every contribution is appreciated and used responsibly."
              }
            </p>
            <p className="mt-2 text-xs">
              Made with 💖 and lots of ☕
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
        language={language}
      />
    </div>
  );
}
