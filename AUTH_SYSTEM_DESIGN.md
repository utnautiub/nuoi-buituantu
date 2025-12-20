# 🔐 Authentication System Design

## 📋 Tổng quan

Hệ thống đăng nhập/đăng ký hoàn chỉnh với:

- 🔑 **Email/Password** authentication
- 🌐 **Google OAuth** login
- 📧 **Email verification** với welcome email
- 🔒 **Password reset** flow
- 👤 **User profile** management
- 💾 **Sync donations** across devices

---

## 🏗️ Architecture

### Tech Stack:

- **Firebase Authentication** - Handle auth logic
- **Firestore** - Store user profiles & donation history
- **Firebase Functions** - Send emails (hoặc Resend/SendGrid)
- **NextAuth.js** (optional) - Session management

### Database Schema:

#### Users Collection:

```typescript
interface User {
  uid: string; // Firebase Auth UID
  email: string;
  displayName: string;
  photoURL?: string;
  provider: "email" | "google";
  emailVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Profile
  bio?: string;
  location?: string;
  website?: string;

  // Preferences
  language: "vi" | "en";
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    donationUpdates: boolean;
  };

  // Stats
  totalDonations: number;
  totalAmount: number;
  firstDonationAt?: Timestamp;
  lastDonationAt?: Timestamp;

  // Tier (nếu có subscription)
  currentTier?: "coffee" | "pizza" | "vip" | "lifetime";
  tierExpiry?: Timestamp;
}
```

#### User Donations Collection:

```typescript
// /users/{uid}/donations/{donationId}
interface UserDonation {
  id: string;
  amount: number;
  description: string;
  transactionId: string;

  // Link to main donations collection
  donationRef: DocumentReference;

  // Metadata
  createdAt: Timestamp;
  month: string; // "YYYY-MM"
  verified: boolean;

  // Anonymous option
  displayPublicly: boolean;
  displayName?: string; // Custom name for this donation
}
```

---

## 🎨 UI Components

### 1. **Auth Modal/Page**

Unified modal cho tất cả auth flows:

```
┌─────────────────────────────────────┐
│         🎨 Đăng nhập/Đăng ký        │
├─────────────────────────────────────┤
│                                     │
│  ┌────────────────────────────┐   │
│  │ 🌐 Continue with Google    │   │
│  └────────────────────────────┘   │
│                                     │
│  ─────────── OR ───────────        │
│                                     │
│  Email: ___________________        │
│  Password: ________________        │
│                                     │
│  ☐ Remember me                     │
│  Forgot password?                   │
│                                     │
│  ┌────────────────────────────┐   │
│  │      Đăng nhập →           │   │
│  └────────────────────────────┘   │
│                                     │
│  Chưa có tài khoản? Đăng ký        │
└─────────────────────────────────────┘
```

**Tabs:**

- Login
- Register
- Forgot Password

### 2. **User Menu (Header)**

```
┌──────────────────────┐
│  👤 Bùi Tuấn Tú     │
├──────────────────────┤
│  📊 Dashboard        │
│  💝 Donations của tôi│
│  ⚙️  Settings        │
│  🚪 Đăng xuất       │
└──────────────────────┘
```

### 3. **User Dashboard**

Full-page dashboard với:

**Stats Cards:**

```
┌─────────────┬─────────────┬─────────────┐
│ 💰 Total    │ 📈 Count    │ 🏆 Rank     │
│ 1.2M đ      │ 15 lần      │ Top 10%     │
└─────────────┴─────────────┴─────────────┘
```

**Sections:**

- 📜 Donation History (with filters)
- 🎯 Monthly Progress (X/50)
- 🏅 Badges & Achievements
- 📊 Charts (monthly trend)
- ⚙️ Settings

### 4. **Email Verification Banner**

```
⚠️ Vui lòng verify email của bạn
   Chúng tôi đã gửi link xác nhận đến email@example.com
   [Gửi lại] [Đổi email]
```

---

## 🔄 User Flows

### Flow 1: Register with Email

```
1. User clicks "Đăng ký"
2. Điền form (email, password, name)
3. Submit → Firebase createUser
4. Auto send verification email
5. Show "Check your email" screen
6. User clicks link in email
7. Email verified → Redirect to dashboard
8. Welcome email sent
```

### Flow 2: Login with Google

```
1. User clicks "Continue with Google"
2. Google OAuth popup
3. User selects account
4. Callback → Check if user exists
5. If new: Create user profile + Welcome email
6. If existing: Update last login
7. Redirect to dashboard
```

### Flow 3: Forgot Password

```
1. User clicks "Forgot password?"
2. Enter email
3. Send reset email
4. User clicks link
5. Enter new password
6. Password updated
7. Auto login → Dashboard
```

### Flow 4: Link Donation to Account

```
After donate:
1. Show modal: "Đây có phải donation của bạn?"
2. If logged in:
   - Button "Claim donation"
   - Verify transaction ID
   - Link to user account
3. If not logged in:
   - "Đăng nhập để claim donation"
   - After login → Auto link
```

---

## 📧 Email Templates

### 1. Welcome Email

```html
Subject: 🎉 Chào mừng đến với Nuôi Bùi Tuấn Tú! Hi {{displayName}}, Cảm ơn bạn
đã đăng ký! 💖 Bây giờ bạn có thể: ✅ Track donations của mình ✅ Xem lịch sử
đầy đủ ✅ Sync across devices ✅ Nhận updates về projects mới [Khám phá
Dashboard →] --- Made with 💖 by Bùi Tuấn Tú
```

### 2. Email Verification

```html
Subject: ✅ Xác nhận email của bạn Hi {{displayName}}, Click button bên dưới để
verify email: [Verify Email →] Link này hết hạn sau 24 giờ. --- Nếu bạn không
đăng ký, ignore email này.
```

### 3. Donation Claimed

```html
Subject: 💝 Donation của bạn đã được ghi nhận! Hi {{displayName}}, Donation của
bạn đã được link vào account: 💰 Số tiền: {{amount}} 📅 Ngày: {{date}} 💬 Nội
dung: {{description}} [Xem chi tiết →] Cảm ơn sự ủng hộ của bạn! 🙏
```

### 4. Monthly Summary

```html
Subject: 📊 Tổng kết donate tháng {{month}} Hi {{displayName}}, Bạn đã donate
{{count}} lần trong tháng này! 💰 Tổng: {{amount}} 🏆 Rank: Top {{rank}}% ⭐
Badges mới: {{badges}} [Xem thêm →] Keep up the great support! 🚀
```

---

## 🔒 Security Features

### 1. **Rate Limiting**

- Max 5 login attempts / 15 minutes
- Max 3 password reset / 1 hour
- Max 10 API calls / minute per user

### 2. **Input Validation**

- Email format check
- Password strength (min 8 chars, 1 uppercase, 1 number)
- XSS protection
- SQL injection prevention

### 3. **Session Management**

- JWT tokens với expiry
- Refresh tokens
- Auto logout sau 30 days inactive
- Remember me option (extend to 90 days)

### 4. **Privacy**

- User can choose to donate anonymously
- Profile visibility settings
- GDPR compliance (export data, delete account)

---

## 🎯 Implementation Steps

### Phase 1: Basic Auth (Week 1)

- [ ] Setup Firebase Auth
- [ ] Email/Password login
- [ ] Google OAuth
- [ ] Login/Register UI
- [ ] Protected routes

### Phase 2: Email & Verification (Week 2)

- [ ] Email verification flow
- [ ] Welcome email template
- [ ] Password reset flow
- [ ] Email service setup (Resend/SendGrid)

### Phase 3: User Profile (Week 3)

- [ ] User dashboard page
- [ ] Profile settings
- [ ] Donation history integration
- [ ] Sync localStorage to Firestore

### Phase 4: Advanced Features (Week 4)

- [ ] Claim donation flow
- [ ] Badges & achievements
- [ ] Monthly email summaries
- [ ] Social features (leaderboard)

---

## 📂 File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── verify-email/
│   │       └── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── donations/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts
│       │   ├── login/route.ts
│       │   └── reset-password/route.ts
│       └── user/
│           ├── profile/route.ts
│           └── donations/route.ts
├── components/
│   ├── auth/
│   │   ├── AuthModal.tsx
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── GoogleButton.tsx
│   │   └── EmailVerificationBanner.tsx
│   ├── dashboard/
│   │   ├── StatsCards.tsx
│   │   ├── DonationHistory.tsx
│   │   ├── MonthlyProgress.tsx
│   │   └── AchievementsList.tsx
│   └── user/
│       ├── UserMenu.tsx
│       ├── UserAvatar.tsx
│       └── ProfileSettings.tsx
├── lib/
│   ├── auth.ts           # Auth utilities
│   ├── firebase-auth.ts  # Firebase Auth config
│   └── email.ts          # Email sending
├── hooks/
│   ├── useAuth.ts        # Auth hook
│   └── useUser.ts        # User data hook
└── contexts/
    └── AuthContext.tsx   # Auth context provider
```

---

## 🚀 Benefits của Auth System

### Cho User:

✅ **Sync donations** across devices
✅ **Track history** dễ dàng
✅ **Không lo mất data** khi clear browser
✅ **Nhận updates** về projects mới
✅ **Leaderboard** và social features
✅ **Exclusive perks** cho members

### Cho Bạn:

✅ **Email list** cho marketing
✅ **User analytics** chi tiết
✅ **Engagement** cao hơn
✅ **Retention** tốt hơn
✅ **Monetization** options (subscriptions)
✅ **Community building**

---

## 💰 Monetization Ideas

Với auth system, bạn có thể:

### 1. **Subscription Tiers**

- Coffee ($2/month) → Basic perks
- Pizza ($5/month) → More perks
- VIP ($50/year) → Premium
- Lifetime ($500) → All access

### 2. **Premium Features**

- Ad-free experience
- Custom profile themes
- Animated badges
- Priority support
- Early access to projects

### 3. **Virtual Goods**

- Custom emojis
- Profile borders
- Name colors
- Stickers/badges

### 4. **Services**

- 1-on-1 mentorship
- Code review
- Consulting hours

---

## 📊 Analytics & Metrics

Track these KPIs:

### User Metrics:

- Total registered users
- Active users (DAU, MAU)
- Retention rate
- Churn rate

### Donation Metrics:

- Average donation per user
- Donation frequency
- Conversion rate (visitor → donor)
- LTV (Lifetime Value)

### Engagement:

- Dashboard visits
- Email open rates
- Feature usage
- Session duration

---

## 🎨 UI/UX Considerations

### 1. **Seamless Integration**

- Auth modal overlay (không redirect)
- Keep current page context
- Auto-close sau login
- Remember intended action

### 2. **Social Proof**

- "Join 247+ supporters"
- Show recent registrations
- Testimonials from members

### 3. **Clear Value Prop**

```
💝 Đăng ký để:
✅ Không bao giờ mất lịch sử donate
✅ Sync trên mọi thiết bị
✅ Nhận updates độc quyền
✅ Join community
```

### 4. **Trust Signals**

- "We'll never spam you"
- "Unsubscribe anytime"
- Privacy policy link
- Secure badge

---

## 🔮 Advanced Features (Future)

### Social Features:

- Follow other supporters
- Comment on projects
- Share donations
- Team donations (groups)

### Gamification:

- Achievement badges
- Streak tracking (donate X days in a row)
- Levels (Bronze → Silver → Gold → Platinum)
- Leaderboards (daily, monthly, all-time)

### Community:

- Discord integration (auto-role)
- Exclusive forum/chat
- Member-only events
- Virtual meetups

---

## 💡 Implementation Priority

### Must Have (MVP):

1. ✅ Email/Password auth
2. ✅ Google OAuth
3. ✅ User dashboard
4. ✅ Donation history sync
5. ✅ Email verification

### Should Have:

1. ⭐ Password reset
2. ⭐ Profile customization
3. ⭐ Welcome emails
4. ⭐ Claim donation flow

### Nice to Have:

1. 🎯 Badges & achievements
2. 🎯 Monthly summaries
3. 🎯 Leaderboards
4. 🎯 Social features

---

Bạn muốn tôi implement phần nào trước?

**Đề xuất của tôi:**

1. Start với **Basic Auth** (Email + Google) - 1-2 giờ
2. Thêm **User Dashboard** đơn giản - 1 giờ
3. **Sync donations** localStorage → Firestore - 1 giờ
4. **Email verification** - 30 phút

→ **Total: ~4-5 giờ** để có working MVP! 🚀
