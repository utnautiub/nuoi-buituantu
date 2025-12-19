import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Nuôi Bùi Tuấn Tú - Support & Donate",
  description: "Hỗ trợ và donate cho Bùi Tuấn Tú. Mọi đóng góp của bạn đều được ghi nhận và công khai minh bạch.",
  keywords: ["donate", "support", "Bùi Tuấn Tú", "donation", "sponsor"],
  authors: [{ name: "Bùi Tuấn Tú" }],
  openGraph: {
    title: "Nuôi Bùi Tuấn Tú",
    description: "Hỗ trợ và donate cho Bùi Tuấn Tú",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

