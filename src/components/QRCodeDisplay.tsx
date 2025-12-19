"use client";

import * as React from "react";
import { Download, Copy, Check } from "lucide-react";
import Image from "next/image";
import { generateVietQRUrl, fetchQRAsDataUrl } from "@/lib/vietqr";
import { downloadImage, copyToClipboard } from "@/lib/utils";
import { Button } from "./ui/button";

interface QRCodeDisplayProps {
  accountNo: string;
  accountName: string;
  bankBin: string;
  amount?: number;
  message?: string;
}

export function QRCodeDisplay({
  accountNo,
  accountName,
  bankBin,
  amount,
  message = "Nuôi Bùi Tuấn Tú",
}: QRCodeDisplayProps) {
  const [qrUrl, setQrUrl] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

  React.useEffect(() => {
    const url = generateVietQRUrl({
      accountNo,
      accountName,
      acqId: bankBin,
      amount,
      addInfo: message,
      template: "compact2",
    });
    setQrUrl(url);
  }, [accountNo, accountName, bankBin, amount, message]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const dataUrl = await fetchQRAsDataUrl(qrUrl);
      downloadImage(dataUrl, `qr-nuoi-buituantu-${Date.now()}.png`);
    } catch (error) {
      console.error("Failed to download QR:", error);
      alert("Không thể tải QR code. Vui lòng thử lại!");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyAccountNumber = async () => {
    const success = await copyToClipboard(accountNo);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* QR Code Image */}
      <div className="flex justify-center">
        <div className="relative p-4 bg-white rounded-lg shadow-md">
          {qrUrl ? (
            <Image
              src={qrUrl}
              alt="VietQR Code"
              width={300}
              height={300}
              className="rounded"
              priority
            />
          ) : (
            <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-100 rounded">
              <div className="text-center text-gray-500">
                <div className="animate-shimmer w-full h-full" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Information */}
      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Số tài khoản:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold">{accountNo}</span>
            <button
              onClick={handleCopyAccountNumber}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Copy số tài khoản"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Chủ tài khoản:</span>
          <span className="font-semibold">{accountName}</span>
        </div>
        {amount && amount > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Số tiền:</span>
            <span className="font-semibold text-primary">
              {amount.toLocaleString("vi-VN")} đ
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleDownload}
          disabled={downloading || !qrUrl}
          className="flex-1 flex items-center justify-center gap-2"
          size="lg"
        >
          <Download className="w-5 h-5" />
          {downloading ? "Đang tải..." : "Lưu mã QR"}
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>💡 <strong>Hướng dẫn:</strong></p>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>Nhấn nút &quot;Lưu mã QR&quot; để tải về thiết bị</li>
          <li>Chọn ngân hàng của bạn ở phía dưới</li>
          <li>Mở app ngân hàng và quét QR vừa lưu</li>
        </ol>
      </div>
    </div>
  );
}

