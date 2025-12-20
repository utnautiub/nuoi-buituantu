"use client";

import * as React from "react";
import { Download, Sparkles, Copy, Check, Loader2, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BankQuickAccess } from "./BankQuickAccess";
import { useAuth } from "@/contexts/AuthContext";
import { getUserCode } from "@/lib/user-code";

interface PricingTier {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  period: "day" | "month" | "year" | "lifetime";
  periodDays?: number;
  emoji: string;
}

// Pricing tiers data (simplified version for QR section)
const PRICING_TIERS: PricingTier[] = [
  {
    id: "trial-7d",
    name: "Thử Nghiệm 7 Ngày 🎁",
    nameEn: "7-Day Trial 🎁",
    price: 20000,
    period: "day",
    periodDays: 7,
    emoji: "🎁",
  },
  {
    id: "trial-14d",
    name: "Thử Nghiệm 14 Ngày ⭐",
    nameEn: "14-Day Trial ⭐",
    price: 35000,
    period: "day",
    periodDays: 14,
    emoji: "⭐",
  },
  {
    id: "coffee",
    name: "Cà Phê ☕",
    nameEn: "Coffee ☕",
    price: 50000,
    period: "month",
    emoji: "☕",
  },
  {
    id: "pizza",
    name: "Pizza 🍕",
    nameEn: "Pizza 🍕",
    price: 100000,
    period: "month",
    emoji: "🍕",
  },
  {
    id: "vip-yearly",
    name: "VIP Năm 🌟",
    nameEn: "VIP Year 🌟",
    price: 1000000,
    period: "year",
    emoji: "🌟",
  },
  {
    id: "lifetime",
    name: "Lifetime Legend 👑",
    nameEn: "Lifetime Legend 👑",
    price: 10000000,
    period: "lifetime",
    emoji: "👑",
  },
];

interface QRCodeDisplayProps {
  language: "vi" | "en";
  selectedTier?: PricingTier; // Selected pricing tier
  onTierChange?: (tier: PricingTier | undefined) => void; // Callback to change tier
  onScrollToPricing?: () => void; // Scroll to pricing section
}

const translations = {
  vi: {
    downloading: "Đang tải...",
    download: "Lưu QR Code",
    description: "Nội dung chuyển khoản",
    descriptionPlaceholder: "Nhập nội dung (tùy chọn)",
    accountNumber: "Số tài khoản",
    accountName: "Chủ tài khoản",
    bankName: "Ngân hàng",
    copy: "Sao chép",
    copied: "Đã sao chép",
    selectedTier: "Gói đã chọn",
    changeTier: "Đổi gói",
    selectTier: "Chọn gói",
    noTierSelected: "Chưa chọn gói",
    tierInfo: "Bạn sẽ tự nhập số tiền trong app ngân hàng",
    perMonth: "/tháng",
    perYear: "/năm",
    oneTime: "1 lần",
  },
  en: {
    downloading: "Downloading...",
    download: "Save QR Code",
    description: "Transfer content",
    descriptionPlaceholder: "Enter content (optional)",
    accountNumber: "Account number",
    accountName: "Account holder",
    bankName: "Bank",
    copy: "Copy",
    copied: "Copied",
    selectedTier: "Selected Tier",
    changeTier: "Change Tier",
    selectTier: "Select Tier",
    noTierSelected: "No tier selected",
    tierInfo: "You will enter the amount in your banking app",
    perMonth: "/month",
    perYear: "/year",
    oneTime: "one-time",
  },
};

export function QRCodeDisplay({ language, selectedTier, onTierChange, onScrollToPricing }: QRCodeDisplayProps) {
  const [qrUrl, setQrUrl] = React.useState<string>("");
  const [bankInfo, setBankInfo] = React.useState<any>(null);
  const [downloading, setDownloading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [description, setDescription] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);
  const [qrLoading, setQrLoading] = React.useState(false);
  const [userCode, setUserCode] = React.useState<string>("");
  const timerRef = React.useRef<NodeJS.Timeout>();
  
  const { user } = useAuth();
  const t = translations[language];
  
  // Get user code when user logs in
  React.useEffect(() => {
    if (user) {
      getUserCode(user.uid).then((code) => {
        setUserCode(code);
      });
    } else {
      setUserCode("");
    }
  }, [user]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch initial QR and bank info
  React.useEffect(() => {
    async function fetchQR() {
      try {
        const response = await fetch("/api/qr");
        const data = await response.json();
        
        if (data.success) {
          setQrUrl(data.qrUrl);
          setBankInfo(data.bankInfo);
        }
      } catch (error) {
        console.error("Failed to fetch QR:", error);
      }
    }

    fetchQR();
  }, []);

  // Build final description with user code
  const finalDescription = React.useMemo(() => {
    let desc = description.trim();
    if (userCode) {
      // Append user code to description
      if (desc) {
        desc = `${desc} ${userCode}`;
      } else {
        desc = userCode;
      }
    }
    return desc;
  }, [description, userCode]);

  // Update QR URL when description changes (with debounce)
  React.useEffect(() => {
    if (bankInfo) {
      setQrLoading(true);
      
      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Debounce 500ms
      timerRef.current = setTimeout(() => {
        const params = new URLSearchParams();
        params.set("acc", bankInfo.accountNo);
        params.set("bank", bankInfo.bankName);
        params.set("template", "qronly");
        
        if (finalDescription) {
          params.set("des", finalDescription);
        }
        
        // Add amount if tier is selected (auto-fill in banking app)
        if (selectedTier) {
          params.set("amount", selectedTier.price.toString());
        }
        
        const newQrUrl = `https://qr.sepay.vn/img?${params.toString()}`;
        setQrUrl(newQrUrl);
        setQrLoading(false);
      }, 500);
    }
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [finalDescription, bankInfo]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-donate-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download QR:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!mounted || !qrUrl || !bankInfo) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 w-full px-4">
        <div className="relative w-full max-w-[240px] sm:max-w-[280px]">
          <Skeleton className="aspect-square w-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        </div>
        <Skeleton className="h-12 w-full max-w-[240px] sm:max-w-[280px] rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in-95 duration-700 w-full px-0">
      {/* QR Code Container */}
      <div className="relative w-full max-w-[240px] sm:max-w-[280px] group">
        {/* Animated gradient border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-gradient bg-[length:200%_auto]" />
        
        {/* QR Code */}
        <div className="relative aspect-square w-full bg-white dark:bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden">
          {/* Corner decorations */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-5 h-5 sm:w-6 sm:h-6 border-t-2 border-l-2 border-purple-500 rounded-tl-lg" />
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 border-t-2 border-r-2 border-purple-500 rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-5 h-5 sm:w-6 sm:h-6 border-b-2 border-l-2 border-purple-500 rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 border-b-2 border-r-2 border-purple-500 rounded-br-lg" />
          
          {/* Sparkle effect */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 animate-pulse z-10">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
          </div>
          
          <div className="relative w-full h-full">
            <Image
              src={qrUrl}
              alt="QR Code for donation"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 640px) 240px, 280px"
            />
            
            {/* Loading overlay */}
            {qrLoading && (
              <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-20 rounded-2xl backdrop-blur-sm">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bank Account Info */}
      {bankInfo && (
        <div className="w-full max-w-[240px] sm:max-w-[280px] space-y-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">{t.accountNumber}:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                {bankInfo.accountNo}
              </span>
              <button
                onClick={() => handleCopy(bankInfo.accountNo)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                title={t.copy}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">{t.accountName}:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {bankInfo.accountName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">{t.bankName}:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {bankInfo.bankName}
            </span>
          </div>
        </div>
      )}

      {/* Selected Tier Display */}
      <div className="w-full max-w-[240px] sm:max-w-[280px] space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {t.selectedTier}
        </label>
        {selectedTier ? (
          <div className="space-y-2">
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedTier.emoji}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {language === "vi" ? selectedTier.name : selectedTier.nameEn}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                  }).format(selectedTier.price)}
                  {selectedTier.period === "day" && selectedTier.periodDays && 
                    ` ${language === "vi" ? `/${selectedTier.periodDays} ngày` : `/${selectedTier.periodDays} days`}`}
                  {selectedTier.period === "month" && ` ${t.perMonth}`}
                  {selectedTier.period === "year" && ` ${t.perYear}`}
                  {selectedTier.period === "lifetime" && ` ${t.oneTime}`}
                </p>
                {onTierChange && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTierChange(undefined)}
                    className="h-7 text-xs text-slate-500 hover:text-slate-700"
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>
            {onTierChange && (
              <Select
                value={selectedTier.id}
                onValueChange={(value) => {
                  const tier = PRICING_TIERS.find((t) => t.id === value);
                  if (tier) {
                    onTierChange(tier);
                  }
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={t.changeTier} />
                </SelectTrigger>
                <SelectContent>
                  {PRICING_TIERS.map((tier) => (
                    <SelectItem key={tier.id} value={tier.id}>
                      <div className="flex items-center gap-2">
                        <span>{tier.emoji}</span>
                        <span>{language === "vi" ? tier.name : tier.nameEn}</span>
                        <span className="text-xs text-slate-500 ml-auto">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 0,
                          }).format(tier.price)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.noTierSelected}</p>
            </div>
            {onScrollToPricing && (
              <Button
                variant="outline"
                size="sm"
                onClick={onScrollToPricing}
                className="w-full h-10"
              >
                {t.selectTier}
              </Button>
            )}
          </div>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
          {t.tierInfo}
        </p>
      </div>

      {/* Description Input */}
      <div className="w-full max-w-[240px] sm:max-w-[280px] space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {t.description}
        </label>
        <Input
          type="text"
          placeholder={t.descriptionPlaceholder}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-11 border-slate-300 dark:border-slate-700 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
          maxLength={100}
        />
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description.length}/100
          </p>
        )}
        {userCode && (
          <p className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2 py-1 rounded border border-purple-200 dark:border-purple-800">
            {language === "vi" 
              ? `✅ Mã ${userCode} sẽ tự động được thêm vào nội dung chuyển khoản`
              : `✅ Code ${userCode} will be automatically added to transfer content`}
          </p>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="w-full max-w-[240px] sm:max-w-[280px] space-y-3">
        {/* Quick Access to Banking Apps */}
        <BankQuickAccess
          bankBin={bankInfo.bankBin}
          accountNo={bankInfo.accountNo}
          accountName={bankInfo.accountName}
          language={language}
          description={finalDescription}
        />
        
        {/* Download Button */}
        <Button 
          onClick={handleDownload}
          disabled={downloading}
          className="w-full h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold text-base group disabled:opacity-50 animate-gradient bg-[length:200%_auto]"
          size="lg"
        >
          <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
          {downloading ? t.downloading : t.download}
        </Button>
      </div>
      
      {/* Scan hint */}
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-[240px] sm:max-w-[280px] animate-in fade-in duration-700 delay-300 leading-relaxed px-2">
        {language === "vi" 
          ? "Quét mã QR bằng ứng dụng ngân hàng để donate"
          : "Scan QR code with your banking app to donate"
        }
      </p>
    </div>
  );
}
