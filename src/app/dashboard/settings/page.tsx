"use client";

import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, Mail, Globe, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const translations = {
  vi: {
    title: "Cài đặt",
    subtitle: "Quản lý tài khoản và tùy chọn của bạn",
    profile: "Hồ sơ",
    displayName: "Tên hiển thị",
    email: "Email",
    preferences: "Tùy chọn",
    language: "Ngôn ngữ",
    theme: "Giao diện",
    save: "Lưu thay đổi",
    saved: "Đã lưu!",
    saving: "Đang lưu...",
  },
  en: {
    title: "Settings",
    subtitle: "Manage your account and preferences",
    profile: "Profile",
    displayName: "Display Name",
    email: "Email",
    preferences: "Preferences",
    language: "Language",
    theme: "Theme",
    save: "Save Changes",
    saved: "Saved!",
    saving: "Saving...",
  },
};

export default function SettingsPage() {
  const { user, userData, updateUserProfile } = useAuth();
  const [language, setLanguage] = React.useState<"vi" | "en">("vi");
  const [displayName, setDisplayName] = React.useState(userData?.displayName || "");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const savedLang = localStorage.getItem("language") as "vi" | "en" | null;
    if (savedLang) setLanguage(savedLang);
    
    // Update displayName when userData changes
    if (userData?.displayName) {
      setDisplayName(userData.displayName);
    } else if (user?.displayName) {
      setDisplayName(user.displayName);
    } else if (user?.email) {
      setDisplayName(user.email.split("@")[0]);
    }
  }, [userData, user]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateUserProfile({ displayName });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = (lang: "vi" | "en") => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    window.location.reload(); // Reload to apply language
  };

  const t = translations[language];

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Settings className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          {t.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">{t.subtitle}</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            {t.profile}
          </CardTitle>
          <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">{t.displayName}</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t.displayName}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t.email}</Label>
            <Input
              id="email"
              value={user.email || ""}
              disabled
              className="bg-slate-100 dark:bg-slate-800"
            />
            <p className="text-xs text-slate-500">
              {language === "vi" ? "Email không thể thay đổi" : "Email cannot be changed"}
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving || !displayName.trim() || displayName.trim() === (userData?.displayName || user?.displayName || "")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {saving ? t.saving : saved ? t.saved : t.save}
          </Button>
          {displayName.trim() === (userData?.displayName || user?.displayName || "") && displayName.trim() && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === "vi" ? "Không có thay đổi" : "No changes"}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            {t.preferences}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t.language}</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vi">Tiếng Việt</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

