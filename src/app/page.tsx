"use client";

import * as React from "react";
import { Heart, Github, Mail, Coffee } from "lucide-react";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { BankSelector } from "@/components/BankSelector";
import { DonationList } from "@/components/DonationList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Donation } from "@/types/donation";

// Configuration - Thay đổi theo thông tin của bạn
const BANK_CONFIG = {
  accountNo: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NO || "0123456789",
  accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "BUI TUAN TU",
  bankBin: process.env.NEXT_PUBLIC_BANK_BIN || "970422",
  bankName: process.env.NEXT_PUBLIC_BANK_NAME || "MBBank",
};

export default function HomePage() {
  const [donations, setDonations] = React.useState<Donation[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalAmount: 0,
    totalDonations: 0,
  });

  // Fetch donations from API
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Nuôi Bùi Tuấn Tú
                </h1>
                <p className="text-xs text-gray-500">nuoi.buituantu.com</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="https://github.com/buituantu"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Github className="w-5 h-5 text-gray-600" />
              </a>
              <a
                href="mailto:contact@buituantu.com"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-600" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Introduction & QR */}
          <div className="space-y-6">
            {/* Introduction Card */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coffee className="w-6 h-6 text-primary" />
                  Chào mừng bạn!
                </CardTitle>
                <CardDescription>
                  Donate để hỗ trợ tôi tiếp tục phát triển các dự án open source
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p>
                    Xin chào! Mình là <strong>Bùi Tuấn Tú</strong>, một lập trình viên
                    đam mê công nghệ và phát triển các dự án mã nguồn mở.
                  </p>
                  <p>
                    Nếu bạn thấy các dự án của mình hữu ích và muốn ủng hộ, bạn có thể
                    donate qua QR code bên dưới. Mọi đóng góp đều được ghi nhận và công
                    khai minh bạch.
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    ❤️ Cảm ơn bạn đã tin tưởng và ủng hộ!
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {stats.totalDonations}
                    </div>
                    <div className="text-sm text-green-600">Lượt donate</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {(stats.totalAmount / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-blue-600">Tổng donate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Mã QR Donation</CardTitle>
                <CardDescription>
                  Quét mã QR hoặc chuyển khoản thủ công
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QRCodeDisplay
                  accountNo={BANK_CONFIG.accountNo}
                  accountName={BANK_CONFIG.accountName}
                  bankBin={BANK_CONFIG.bankBin}
                  message="Nuôi Bùi Tuấn Tú"
                />
              </CardContent>
            </Card>

            {/* Bank Selector */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Mở app ngân hàng</CardTitle>
                <CardDescription>
                  Chọn ngân hàng để mở app và quét QR nhanh hơn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BankSelector />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Donation List */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg">
              <DonationList donations={donations} isLoading={isLoading} />
            </div>

            {/* Footer Info */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center text-sm text-gray-600 space-y-2">
                  <p>
                    🔒 Mọi giao dịch đều được ghi nhận tự động qua SePay webhook
                  </p>
                  <p>
                    📊 Sao kê minh bạch, công khai 100%
                  </p>
                  <p className="text-xs text-gray-400 pt-4 border-t border-gray-200">
                    Made with ❤️ by Bùi Tuấn Tú
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

