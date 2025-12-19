"use client";

import * as React from "react";
import { Download, Copy, Check } from "lucide-react";
import Image from "next/image";

export function QRCodeDisplay() {
  const [qrUrl, setQrUrl] = React.useState<string>("");
  const [bankInfo, setBankInfo] = React.useState<any>(null);
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

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

  const handleCopy = async () => {
    if (!bankInfo) return;
    try {
      await navigator.clipboard.writeText(bankInfo.accountNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!qrUrl || !bankInfo) {
    return (
      <div className="space-y-4">
        <div className="aspect-square w-full max-w-[280px] mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* QR Code */}
      <div className="w-full max-w-[280px] mx-auto">
        <div className="relative aspect-square w-full bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm">
          <Image
            src={qrUrl}
            alt="QR Code"
            fill
            className="object-contain p-2"
            priority
          />
        </div>
      </div>

      {/* Bank Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
          <span className="text-gray-600 dark:text-gray-400">STK:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-gray-900 dark:text-white">
              {bankInfo.accountNo}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
          <span className="text-gray-600 dark:text-gray-400">Tên:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {bankInfo.accountName}
          </span>
        </div>
        <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
          <span className="text-gray-600 dark:text-gray-400">NH:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {bankInfo.bankName}
          </span>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        {downloading ? "Đang tải..." : "Lưu QR"}
      </button>
    </div>
  );
}
