"use client";

import * as React from "react";
import { Moon, Sun, Heart, Globe } from "lucide-react";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { DonationList } from "@/components/DonationList";
import { Donation } from "@/types/donation";

// Translations
const translations = {
  vi: {
    title: "Nuôi Bùi Tuấn Tú",
    subtitle: "Hỗ trợ và donate",
    welcome: "Chào mừng!",
    description: "Donate để hỗ trợ tôi tiếp tục phát triển các dự án open source",
    intro1: "Xin chào! Mình là",
    intro2: "Bùi Tuấn Tú",
    intro3: ", một lập trình viên đam mê công nghệ và phát triển các dự án mã nguồn mở.",
    intro4: "Nếu bạn thấy các dự án của mình hữu ích và muốn ủng hộ, bạn có thể donate qua QR code bên dưới. Mọi đóng góp đều được ghi nhận và công khai minh bạch.",
    thanks: "Cảm ơn bạn đã tin tưởng và ủng hộ!",
    donations: "Lượt donate",
    totalAmount: "Tổng donate",
    qrTitle: "Mã QR Donation",
    qrDesc: "Quét mã QR để donate",
    statement: "Sao kê donation",
    transparent: "Minh bạch 100%",
    autoTracking: "Tự động ghi nhận qua SePay webhook",
    publicStatement: "Sao kê công khai, minh bạch",
    madeWith: "Made with",
    by: "by Bùi Tuấn Tú",
  },
  en: {
    title: "Support Bui Tuan Tu",
    subtitle: "Support & Donate",
    welcome: "Welcome!",
    description: "Donate to support me continue developing open source projects",
    intro1: "Hello! I'm",
    intro2: "Bui Tuan Tu",
    intro3: ", a developer passionate about technology and open source projects.",
    intro4: "If you find my projects useful and want to support, you can donate via QR code below. All contributions are recorded and publicly transparent.",
    thanks: "Thank you for your trust and support!",
    donations: "Donations",
    totalAmount: "Total",
    qrTitle: "Donation QR Code",
    qrDesc: "Scan QR to donate",
    statement: "Donation Statement",
    transparent: "100% Transparent",
    autoTracking: "Auto-tracked via SePay webhook",
    publicStatement: "Public and transparent statement",
    madeWith: "Made with",
    by: "by Bui Tuan Tu",
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
  const itemsPerPage = 10;

  const t = translations[language];

  // Load theme preference
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

  // Toggle theme
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

  // Toggle language
  const toggleLanguage = () => {
    const newLang = language === "vi" ? "en" : "vi";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  // Fetch donations
  React.useEffect(() => {
    async function fetchDonations() {
      try {
        const response = await fetch("/api/donations");
        const data = await response.json();
        
        if (data.success) {
          setDonations(data.donations || []);
          setStats({
            totalAmount: data.totalAmount || 0,
            totalDonations: data.totalDonations || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch donations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDonations();
  }, []);

  // Pagination
  const totalPages = Math.ceil(donations.length / itemsPerPage);
  const paginatedDonations = donations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  {t.title}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  nuoi.buituantu.com
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={toggleLanguage}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title={language === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
              >
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title={darkMode ? "Light mode" : "Dark mode"}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            {t.welcome}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-12 max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {stats.totalDonations}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t.donations}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {(stats.totalAmount / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t.totalAmount}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {t.qrTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t.qrDesc}
              </p>
              <QRCodeDisplay />
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl shadow-xl p-6 text-white">
              <h4 className="text-xl font-bold mb-4">{t.intro1} <strong>{t.intro2}</strong></h4>
              <p className="mb-4 leading-relaxed opacity-90">
                {t.intro4}
              </p>
              <p className="text-sm opacity-80">
                ❤️ {t.thanks}
              </p>
            </div>
          </div>

          {/* Donation List Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors">
              <DonationList
                donations={paginatedDonations}
                isLoading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                language={language}
              />
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>🔒 {t.autoTracking}</p>
                <p>📊 {t.publicStatement}</p>
                <p>✨ {t.transparent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>
            {t.madeWith} ❤️ {t.by}
          </p>
        </div>
      </main>
    </div>
  );
}
