import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Nuôi Bùi Tuấn Tú - Creative Support Platform",
  description: "Hỗ trợ Bùi Tuấn Tú tạo ra những dự án open source, content, và công cụ miễn phí cho cộng đồng developer Việt Nam. Chọn gói Coffee, Pizza, VIP hoặc Lifetime để nhận đặc quyền độc quyền!",
  keywords: ["donate", "support", "Bùi Tuấn Tú", "donation", "sponsor", "open source", "developer", "vietnam", "patreon", "ko-fi"],
  authors: [{ name: "Bùi Tuấn Tú" }],
  openGraph: {
    title: "Nuôi Bùi Tuấn Tú - Creative Support Platform",
    description: "Hỗ trợ tạo content & projects cho cộng đồng developer 🚀",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nuôi Bùi Tuấn Tú",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuôi Bùi Tuấn Tú",
    description: "Support creative projects & open source contributions",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

