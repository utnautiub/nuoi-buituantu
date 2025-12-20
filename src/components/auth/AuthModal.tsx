"use client";

import * as React from "react";
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register" | "reset";
  language: "vi" | "en";
}

const translations = {
  vi: {
    login: "Đăng nhập",
    register: "Đăng ký",
    resetPassword: "Quên mật khẩu",
    email: "Email",
    password: "Mật khẩu",
    displayName: "Tên hiển thị",
    loginButton: "Đăng nhập",
    registerButton: "Đăng ký",
    resetButton: "Gửi email reset",
    continueWithGoogle: "Tiếp tục với Google",
    or: "HOẶC",
    noAccount: "Chưa có tài khoản?",
    hasAccount: "Đã có tài khoản?",
    forgotPassword: "Quên mật khẩu?",
    backToLogin: "Quay lại đăng nhập",
    emailPlaceholder: "example@email.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Tên của bạn",
    verificationSent: "Email xác nhận đã được gửi! Vui lòng kiểm tra hộp thư.",
    resetSent: "Email reset mật khẩu đã được gửi!",
    passwordStrength: "Mật khẩu tối thiểu 6 ký tự",
  },
  en: {
    login: "Login",
    register: "Register",
    resetPassword: "Forgot Password",
    email: "Email",
    password: "Password",
    displayName: "Display Name",
    loginButton: "Login",
    registerButton: "Register",
    resetButton: "Send Reset Email",
    continueWithGoogle: "Continue with Google",
    or: "OR",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    forgotPassword: "Forgot password?",
    backToLogin: "Back to login",
    emailPlaceholder: "example@email.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "Your name",
    verificationSent: "Verification email sent! Please check your inbox.",
    resetSent: "Password reset email sent!",
    passwordStrength: "Password minimum 6 characters",
  },
};

export function AuthModal({ isOpen, onClose, defaultTab = "login", language }: AuthModalProps) {
  const t = translations[language];
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  
  const [tab, setTab] = React.useState<"login" | "register" | "reset">(defaultTab);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  React.useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  React.useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setEmail("");
      setPassword("");
      setDisplayName("");
      setError("");
      setSuccess("");
      setShowPassword(false);
    }
  }, [isOpen]);

  // Handle ESC key to close
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signUp(email, password, displayName);
      setSuccess(t.verificationSent);
      setTimeout(() => onClose(), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(t.resetSent);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-md shadow-2xl relative">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </Button>

        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {tab === "login" && t.login}
            {tab === "register" && t.register}
            {tab === "reset" && t.resetPassword}
          </CardTitle>
          <CardDescription className="text-center">
            {tab === "login" && (language === "vi" ? "Chào mừng trở lại! 👋" : "Welcome back! 👋")}
            {tab === "register" && (language === "vi" ? "Tạo tài khoản mới 🎉" : "Create new account 🎉")}
            {tab === "reset" && (language === "vi" ? "Nhập email để reset mật khẩu" : "Enter email to reset password")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error/Success messages */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
              {success}
            </div>
          )}

          {/* Google Sign In */}
          {tab !== "reset" && (
            <>
              <Button
                onClick={handleGoogleSignIn}
                disabled={loading}
                variant="outline"
                className="w-full h-11 border-2 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t.continueWithGoogle}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">
                    {t.or}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Login Form */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.password}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setTab("reset")}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  {t.forgotPassword}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === "vi" ? "Đang xử lý..." : "Processing..."}
                  </>
                ) : (
                  t.loginButton
                )}
              </Button>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                {t.noAccount}{" "}
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  {t.register}
                </button>
              </p>
            </form>
          )}

          {/* Register Form */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.displayName}</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.password}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500">{t.passwordStrength}</p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === "vi" ? "Đang xử lý..." : "Processing..."}
                  </>
                ) : (
                  t.registerButton
                )}
              </Button>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                {t.hasAccount}{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  {t.login}
                </button>
              </p>
            </form>
          )}

          {/* Reset Password Form */}
          {tab === "reset" && (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === "vi" ? "Đang gửi..." : "Sending..."}
                  </>
                ) : (
                  t.resetButton
                )}
              </Button>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  {t.backToLogin}
                </button>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

