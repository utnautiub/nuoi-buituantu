"use client";

import * as React from "react";
import { Moon, Sun, Globe } from "lucide-react";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { DonationList } from "@/components/DonationList";
import { Donation } from "@/types/donation";

const translations = {
  vi: {
    title: "Nuôi Bùi Tuấn Tú",
    donations: "Lượt donate",
    totalAmount: "Tổng donate",
    qrTitle: "Donate",
    statement: "Danh sách donate",
  },
  en: {
    title: "Support Bui Tuan Tu",
    donations: "Donations",
    totalAmount: "Total",
    qrTitle: "Donate",
    statement: "Donation List",
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

  const totalPages = Math.ceil(donations.length / itemsPerPage);
  const paginatedDonations = donations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Compact Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
          
          <div className="flex gap-1">
            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              {stats.totalDonations}
            </div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              {t.donations}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {(stats.totalAmount / 1000).toFixed(0)}K
            </div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              {t.totalAmount}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* QR Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t.qrTitle}
            </h2>
            <QRCodeDisplay />
          </div>

          {/* Donation List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <DonationList
              donations={paginatedDonations}
              isLoading={isLoading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              language={language}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
