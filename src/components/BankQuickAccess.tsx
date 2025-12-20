"use client";

import * as React from "react";
import { ExternalLink, Smartphone } from "lucide-react";
import { VIETNAMESE_BANKS } from "@/lib/banks";

interface BankQuickAccessProps {
  bankBin: string;
  accountNo: string;
  accountName: string;
  language: "vi" | "en";
  description?: string;
}

const translations = {
  vi: {
    title: "Mở ngân hàng",
    subtitle: "Chọn ngân hàng để mở app",
    openApp: "Mở app",
    notSupported: "Chỉ hoạt động trên điện thoại",
  },
  en: {
    title: "Open Banking App",
    subtitle: "Select your bank to open the app",
    openApp: "Open app",
    notSupported: "Only works on mobile",
  },
};

export function BankQuickAccess({
  bankBin,
  accountNo,
  accountName,
  language,
  description = "",
}: BankQuickAccessProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [showList, setShowList] = React.useState(false);
  const t = translations[language];

  React.useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/.test(navigator.userAgent));
  }, []);

  const recipientBank = VIETNAMESE_BANKS.find((b) => b.bin === bankBin);

  const handleBankClick = (bank: typeof VIETNAMESE_BANKS[0]) => {
    // Generate VietQR URL with description
    const transferInfo = description.trim() || "Nuoi Bui Tuan Tu";
    const vietQRUrl = `https://img.vietqr.io/image/${bankBin}-${accountNo}-compact2.jpg?addInfo=${encodeURIComponent(transferInfo)}&accountName=${encodeURIComponent(accountName)}`;

    // Try to open banking app with retry logic
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    const attemptOpen = (attempt: number = 1) => {
      try {
        if (isIOS && bank.iosScheme) {
          window.location.href = bank.iosScheme;
        } else if (isAndroid && bank.androidPackage) {
          // Use intent URL for Android
          const intentUrl = `intent://#Intent;scheme=${bank.code.toLowerCase()};package=${bank.androidPackage};end`;
          window.location.href = intentUrl;
        } else if (bank.universalLink) {
          window.location.href = bank.universalLink;
        } else {
          // Fallback: open VietQR link
          window.open(vietQRUrl, "_blank");
        }

        // Retry up to 3 times with delay for better success rate
        if (attempt < 3) {
          setTimeout(() => attemptOpen(attempt + 1), 1000);
        }
      } catch (error) {
        console.error("Failed to open bank app:", error);
        // Final fallback
        if (attempt === 3) {
          window.open(vietQRUrl, "_blank");
        }
      }
    };

    attemptOpen();
  };

  if (!isMobile) {
    return (
      <div className="p-3 text-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <Smartphone className="w-4 h-4 mx-auto mb-1 opacity-50" />
        {t.notSupported}
      </div>
    );
  }

  // Popular banks for quick access
  const popularBanks = VIETNAMESE_BANKS.filter((b) =>
    ["970422", "970415", "970436", "970418", "970405"].includes(b.bin)
  );

  return (
    <div className="space-y-3">
      <button
        onClick={() => setShowList(!showList)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        <span className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          {t.title}
        </span>
        <ExternalLink className="w-4 h-4" />
      </button>

      {showList && (
        <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {t.subtitle}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {popularBanks.map((bank) => (
              <button
                key={bank.bin}
                onClick={() => handleBankClick(bank)}
                className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors text-left"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {bank.code.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                    {bank.shortName}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">
                    {bank.code}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Recipient bank highlight */}
          {recipientBank && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Tài khoản nhận:
              </p>
              <button
                onClick={() => handleBankClick(recipientBank)}
                className="w-full flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border-2 border-green-500 dark:border-green-600 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {recipientBank.code.slice(0, 2)}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {recipientBank.shortName}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {accountName}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-green-600 dark:text-green-400" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

