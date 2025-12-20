"use client";

import * as React from "react";
import { User, LogOut, Settings, History, LayoutDashboard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface UserMenuProps {
  language: "vi" | "en";
}

const translations = {
  vi: {
    account: "Tài khoản",
    dashboard: "Dashboard",
    history: "Lịch sử donate",
    settings: "Cài đặt",
    logout: "Đăng xuất",
    loggingOut: "Đang đăng xuất...",
  },
  en: {
    account: "Account",
    dashboard: "Dashboard",
    history: "Donation History",
    settings: "Settings",
    logout: "Logout",
    loggingOut: "Logging out...",
  },
};

export function UserMenu({ language }: UserMenuProps) {
  const t = translations[language];
  const { user, userData, logout } = useAuth();
  const [loading, setLoading] = React.useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get initials from display name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={userData?.displayName || "User"}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500/20"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-purple-500/20">
              {getInitials(userData?.displayName || user.email || "U")}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userData?.displayName || "User"}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <Link href="/dashboard">
          <DropdownMenuItem className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>{t.dashboard}</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/dashboard/history">
          <DropdownMenuItem className="cursor-pointer">
            <History className="mr-2 h-4 w-4" />
            <span>{t.history}</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/dashboard/settings">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t.settings}</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>{t.loggingOut}</span>
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t.logout}</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

