"use client";

import * as React from "react";
import { Moon, Sun, Globe, Search, ArrowDown, ArrowUp, Check, Languages, Monitor } from "lucide-react";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { DonationList } from "@/components/DonationList";
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
    qrTitle: "Donate QR Code",
    statement: "Danh sách donate",
    search: "Tìm theo tên, nội dung, số tiền...",
    sortBy: "Sắp xếp theo",
    sortDate: "Thời gian",
    sortAmount: "Số tiền",
    orderDesc: "Mới nhất / Cao nhất",
    orderAsc: "Cũ nhất / Thấp nhất",
    clearFilter: "Xóa bộ lọc",
    results: "kết quả",
  },
  en: {
    title: "Support Bui Tuan Tu",
    donations: "Donations",
    totalAmount: "Total Amount",
    qrTitle: "Donate QR Code",
    statement: "Donation List",
    search: "Search by name, message, amount...",
    sortBy: "Sort by",
    sortDate: "Date",
    sortAmount: "Amount",
    orderDesc: "Newest / Highest",
    orderAsc: "Oldest / Lowest",
    clearFilter: "Clear filter",
    results: "results",
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
  const itemsPerPage = 20;

  const t = translations[language];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-green-100/20 via-transparent to-transparent dark:from-green-900/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60 transition-all duration-300 shadow-sm">
        <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4 md:px-6">
          {/* Logo - Centered on mobile, left on desktop */}
          <div className="flex items-center gap-3 flex-1 justify-start">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 flex items-center justify-center shadow-lg ring-2 ring-green-500/20 dark:ring-green-400/20 flex-shrink-0">
              <span className="text-white font-bold text-lg sm:text-xl leading-none">N</span>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 dark:from-green-400 dark:via-emerald-400 dark:to-green-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] leading-tight">
              {t.title}
            </h1>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
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

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Stats Cards */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-slate-200 dark:border-slate-800 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <CardHeader className="pb-4 pt-6 relative z-10">
              <CardDescription className="text-sm font-medium text-center">{t.donations}</CardDescription>
              <CardTitle className="text-5xl md:text-6xl font-bold tracking-tight text-center">
                {isLoading ? (
                  <Skeleton className="h-14 w-28 mx-auto bg-slate-200 dark:bg-slate-800" />
                ) : (
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
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

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-5">
          {/* QR Section */}
          <div className="lg:col-span-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
            <Card className="border-slate-200 dark:border-slate-800 shadow-xl h-full hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-6 pt-6">
                <CardTitle className="text-xl text-center">{t.qrTitle}</CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <QRCodeDisplay language={language} />
              </CardContent>
            </Card>
          </div>

          {/* Donation List */}
          <div className="lg:col-span-3 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
            <Card className="border-slate-200 dark:border-slate-800 shadow-xl h-full flex flex-col hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4 pt-6">
                <CardTitle className="text-xl">{t.statement}</CardTitle>
                
                {/* Search and Filter */}
                <div className="space-y-4 pt-6">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-hover:text-green-500 transition-colors duration-200" />
                    <Input
                      placeholder={t.search}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus-visible:ring-green-500 dark:focus-visible:ring-green-400 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Select value={sortBy} onValueChange={(val) => setSortBy(val as "date" | "amount")}>
                      <SelectTrigger className="h-11 border-slate-300 dark:border-slate-700 focus:ring-green-500 dark:focus:ring-green-400">
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
                      className="h-11 w-11 flex-shrink-0 border-slate-300 dark:border-slate-700 hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-500 dark:hover:border-green-400 active:scale-95 transition-all duration-200"
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
                          className="h-auto p-0 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-transparent"
                        >
                          {t.clearFilter}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-2 flex-1 flex flex-col">
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
    </div>
  );
}
