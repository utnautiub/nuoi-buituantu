"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Settings, History, ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const translations = {
  vi: {
    dashboard: "Dashboard",
    history: "Lịch sử donate",
    settings: "Cài đặt",
    backHome: "Về trang chủ",
    logout: "Đăng xuất",
  },
  en: {
    dashboard: "Dashboard",
    history: "Donation History",
    settings: "Settings",
    backHome: "Back to Home",
    logout: "Logout",
  },
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [language, setLanguage] = React.useState<"vi" | "en">("vi");
  const [loggingOut, setLoggingOut] = React.useState(false);

  React.useEffect(() => {
    const savedLang = localStorage.getItem("language") as "vi" | "en" | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/?auth=login");
    }
  }, [user, loading, router]);

  const t = translations[language];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t.backHome}
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
              <nav className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button
                    variant={pathname === "/dashboard" ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      pathname === "/dashboard" && "bg-purple-600 hover:bg-purple-700 text-white"
                    )}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {t.dashboard}
                  </Button>
                </Link>
                <Link href="/dashboard/history">
                  <Button
                    variant={pathname === "/dashboard/history" ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      pathname === "/dashboard/history" && "bg-purple-600 hover:bg-purple-700 text-white"
                    )}
                  >
                    <History className="w-4 h-4" />
                    {t.history}
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button
                    variant={pathname === "/dashboard/settings" ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      pathname === "/dashboard/settings" && "bg-purple-600 hover:bg-purple-700 text-white"
                    )}
                  >
                    <Settings className="w-4 h-4" />
                    {t.settings}
                  </Button>
                </Link>
              </nav>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={loggingOut}
              className="gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              {loggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {language === "vi" ? "Đang đăng xuất..." : "Logging out..."}
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  {t.logout}
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        {children}
      </main>
    </div>
  );
}

