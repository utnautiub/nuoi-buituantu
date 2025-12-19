"use client";

import * as React from "react";
import { Download, Copy, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

export function QRCodeDisplay() {
  const [qrUrl, setQrUrl] = React.useState<string>("");
  const [bankInfo, setBankInfo] = React.useState<any>(null);
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

  React.useEffect(() => {
    // Fetch bank config and QR from API
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
      link.download = `qr-nuoi-buituantu-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download QR:", error);
      alert("Không thể tải QR code. Vui lòng thử lại!");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyAccountNumber = async () => {
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
      <div className="flex justify-center">
        <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* QR Code Image */}
      <div className="flex justify-center">
        <div className="relative p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md">
          <Image
            src={qrUrl}
            alt="VietQR Code"
            width={300}
            height={300}
            className="rounded"
            priority
          />
        </div>
      </div>

      {/* Account Information */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Số tài khoản:
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-gray-800 dark:text-white">
              {bankInfo.accountNo}
            </span>
            <button
              onClick={handleCopyAccountNumber}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              title="Copy số tài khoản"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Chủ tài khoản:
          </span>
          <span className="font-semibold text-gray-800 dark:text-white">
            {bankInfo.accountName}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Ngân hàng:
          </span>
          <span className="font-semibold text-gray-800 dark:text-white">
            {bankInfo.bankName}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full flex items-center justify-center gap-2"
        size="lg"
      >
        <Download className="w-5 h-5" />
        {downloading ? "Đang tải..." : "Lưu mã QR"}
      </Button>
    </div>
  );
}
