"use client";

import * as React from "react";
import { Download, Sparkles, Copy, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BankQuickAccess } from "./BankQuickAccess";

interface QRCodeDisplayProps {
  language: "vi" | "en";
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
  },
};

export function QRCodeDisplay({ language }: QRCodeDisplayProps) {
  const [qrUrl, setQrUrl] = React.useState<string>("");
  const [bankInfo, setBankInfo] = React.useState<any>(null);
  const [downloading, setDownloading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [description, setDescription] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);
  
  const t = translations[language];

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

  // Update QR URL when description changes
  React.useEffect(() => {
    if (bankInfo) {
      const params = new URLSearchParams();
      params.set("acc", bankInfo.accountNo);
      params.set("bank", bankInfo.bankName);
      params.set("template", "qronly");
      if (description.trim()) {
        params.set("des", description.trim());
      }
      const newQrUrl = `https://qr.sepay.vn/img?${params.toString()}`;
      setQrUrl(newQrUrl);
    }
  }, [description, bankInfo]);

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
        <div className="relative w-full max-w-[280px] sm:max-w-[320px]">
          <Skeleton className="aspect-square w-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          </div>
        </div>
        <Skeleton className="h-12 w-full max-w-[280px] sm:max-w-[320px] rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in-95 duration-700 w-full px-0">
      {/* QR Code Container */}
      <div className="relative w-full max-w-[280px] sm:max-w-[320px] group">
        {/* Animated gradient border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-gradient bg-[length:200%_auto]" />
        
        {/* QR Code */}
        <div className="relative aspect-square w-full bg-white dark:bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden">
          {/* Corner decorations */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-green-500 rounded-tl-lg sm:rounded-tl-xl" />
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-green-500 rounded-tr-lg sm:rounded-tr-xl" />
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-green-500 rounded-bl-lg sm:rounded-bl-xl" />
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-green-500 rounded-br-lg sm:rounded-br-xl" />
          
          {/* Sparkle effect */}
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 animate-pulse">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          </div>
          
          <Image
            src={qrUrl}
            alt="QR Code for donation"
            fill
            className="object-contain p-2 sm:p-4 transition-transform duration-300 group-hover:scale-105"
            priority
            sizes="(max-width: 640px) 280px, 320px"
          />
        </div>
      </div>

      {/* Bank Account Info */}
      {bankInfo && (
        <div className="w-full max-w-[280px] sm:max-w-[320px] space-y-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800">
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
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
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

      {/* Description Input */}
      <div className="w-full max-w-[280px] sm:max-w-[320px] space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {t.description}
        </label>
        <Input
          type="text"
          placeholder={t.descriptionPlaceholder}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-11 border-slate-300 dark:border-slate-700 focus-visible:ring-green-500 dark:focus-visible:ring-green-400"
          maxLength={100}
        />
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description.length}/100
          </p>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="w-full max-w-[280px] sm:max-w-[320px] space-y-3">
        {/* Quick Access to Banking Apps */}
        <BankQuickAccess
          bankBin={bankInfo.bankBin}
          accountNo={bankInfo.accountNo}
          accountName={bankInfo.accountName}
          language={language}
        />
        
        {/* Download Button */}
        <Button 
          onClick={handleDownload}
          disabled={downloading}
          className="w-full h-12 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold text-base group disabled:opacity-50 animate-gradient bg-[length:200%_auto]"
          size="lg"
        >
          <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
          {downloading ? t.downloading : t.download}
        </Button>
      </div>
      
      {/* Scan hint */}
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-[280px] sm:max-w-[320px] animate-in fade-in duration-700 delay-300 leading-relaxed px-2">
        {language === "vi" 
          ? "Quét mã QR bằng ứng dụng ngân hàng để donate"
          : "Scan QR code with your banking app to donate"
        }
      </p>
    </div>
  );
}
