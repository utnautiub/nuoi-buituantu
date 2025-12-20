# 🎯 Cập nhật mới - Tracking & Limits

## ✨ Tính năng đã thêm

### 1. ✅ **Favicon & Logo SEO**
- ✅ Tạo file `public/logo.svg` với animated gradient
- ✅ Logo hiển thị trên browser tab
- ✅ Apple touch icon support
- ✅ Gradient purple/pink/blue theo theme mới

**Files:**
- `public/logo.svg` - SVG logo with animations
- `src/app/layout.tsx` - Thêm favicon links

---

### 2. ✅ **QR Code Size Optimization**
- ✅ Giảm max-width từ 280-320px → 240-280px
- ✅ Giảm padding từ p-4/p-8 → p-3/p-6
- ✅ Tất cả elements (bank info, input, buttons) đều scale down
- ✅ Visual balance tốt hơn

**Files:**
- `src/components/QRCodeDisplay.tsx` - Updated sizes

---

### 3. ✅ **Dynamic Stats từ Firestore**
Thay vì hardcode, stats giờ tính từ dữ liệu thật:

- **Supporters**: Số lượng donations (từ Firestore)
- **Projects**: 42 (có thể tách ra collection riêng)
- **Coffees**: Tổng tiền donate / 50,000 (1 coffee = 50k)

**Files:**
- `src/components/HeroSection.tsx` - Nhận stats props
- `src/app/page.tsx` - Truyền stats xuống HeroSection

**Công thức:**
```typescript
supporters = stats.totalDonations  // Từ Firestore
projects = 42  // Hardcode (có thể fetch sau)
coffees = Math.floor(stats.totalAmount / 50000)  // 1 coffee = 50k
```

---

### 4. ✅ **Donation Tracking System**
Hệ thống tracking donations của user với localStorage:

#### Features:
- ✅ Track mỗi donation (id, amount, description, timestamp)
- ✅ Phân biệt theo tháng (format: "YYYY-MM")
- ✅ Get user stats (total, this month, remaining)
- ✅ Check if user can donate
- ✅ Auto cleanup donations > 12 tháng

#### API:
```typescript
// Get all user donations
getUserDonations(): UserDonation[]

// Get current month donations
getCurrentMonthDonations(): UserDonation[]

// Check if can donate more
canDonateThisMonth(): boolean

// Get remaining donations
getRemainingDonations(): number

// Add new donation
addDonation(donation): boolean

// Get user stats
getUserStats(): {
  totalDonations,
  totalAmount,
  thisMonthDonations,
  thisMonthAmount,
  remainingThisMonth,
  canDonate
}

// Check if donation belongs to user
isUserDonation(donationId): boolean
```

**Files:**
- `src/lib/donation-tracker.ts` - Core tracking logic

**Storage:**
```json
localStorage["user_donations"] = [
  {
    "id": "donate-123",
    "amount": 50000,
    "description": "Support project",
    "timestamp": 1234567890,
    "month": "2024-12"
  }
]
```

---

### 5. ✅ **Giới hạn 50 Donate/Tháng**

#### Logic:
- ❌ **Không thể donate** nếu đã donate 50 lần trong tháng
- ⚠️ **Hiển thị warning** khi đạt giới hạn
- ℹ️ **Hiển thị số lần còn lại** khi còn quota
- 🔄 **Reset tự động** đầu tháng sau

#### UI Components:

**A. DonationLimitBanner**
- Hiển thị trên QR section
- Warning khi đạt limit (orange)
- Info về số lần còn lại (blue)
- Button "Donate của tôi" để xem lịch sử

**B. Visual States:**
```
- canDonate && count = 0: Không hiện gì
- canDonate && count > 0: Blue box "Còn X lần donate"
- !canDonate: Orange warning "Đã đạt giới hạn"
```

**Files:**
- `src/components/DonationLimitBanner.tsx` - Warning banner
- `src/app/page.tsx` - Integrated banner

---

### 6. ✅ **Lịch sử Donate Cá nhân**

Modal/Dialog để xem donations của bản thân:

#### Features:
- 📊 **4 Stats Cards:**
  - Tổng donate (all time)
  - Số lần donate
  - Donate tháng này
  - Còn lại tháng này

- 📈 **Progress Bar:**
  - Visualize X/50 donations
  - Purple gradient fill

- 📜 **History List:**
  - Sort by newest first
  - Show #index, date, amount
  - Description/note
  - Numbered badges

- 🎨 **Design:**
  - Full-screen modal với backdrop blur
  - Purple/pink gradient theme
  - Smooth animations
  - Empty state với CTA

**Files:**
- `src/components/UserDonationHistory.tsx` - History modal
- `src/app/page.tsx` - Modal integration

**Trigger:**
- Click "Donate của tôi" button (ở banner)
- Shows: `setShowHistory(true)`

---

### 7. ✅ **Highlight User's Donations**

Donations của user được highlight trong Hall of Fame:

#### Visual:
- **Background**: Yellow/amber gradient (thay vì purple/pink)
- **Border**: Yellow ring-2
- **Badge**: Yellow gradient badge
- **"You" Badge**: Yellow badge với User icon

#### Logic:
```typescript
const isMyDonation = isUserDonation(donation.id);
```

**Files:**
- `src/components/DonationList.tsx` - Highlight logic

---

## 📊 Data Flow

### When User Donates:

```
1. User scans QR → Transfers money
2. Webhook receives notification
3. Firestore saves donation with unique ID
4. Frontend displays in Hall of Fame
5. User MANUALLY adds to local tracking (for now)
```

### Current Limitation:
⚠️ **Auto-tracking chưa có** - User cần manually track donation sau khi donate

#### Future Enhancement:
Có thể implement:
1. **Option 1**: After donate, show modal "Đây có phải donation của bạn?"
2. **Option 2**: Generate unique description code trước khi donate
3. **Option 3**: Login system với account tracking

---

## 🎨 UI/UX Improvements

### Before:
- ❌ No way to track personal donations
- ❌ No limit enforcement
- ❌ Can't see donation history
- ❌ All donations look the same
- ❌ Hardcoded stats

### After:
- ✅ Track donations với localStorage
- ✅ 50/month limit với visual warning
- ✅ Full donation history modal
- ✅ User's donations highlighted in yellow
- ✅ Dynamic stats từ real data
- ✅ SEO-friendly favicon
- ✅ Optimized QR code size

---

## 🔧 Technical Details

### LocalStorage Structure:
```json
{
  "user_donations": [
    {
      "id": "donation-id-from-firestore",
      "amount": 50000,
      "description": "Support message",
      "timestamp": 1703001234567,
      "month": "2023-12"
    }
  ]
}
```

### Cleanup:
- Auto cleanup donations > 12 months old
- Runs on `getUserStats()` call
- Prevents localStorage bloat

### Stats Calculation:
```typescript
// Hero Section
supporters = totalDonations from Firestore
coffees = Math.floor(totalAmount / 50000)
projects = 42 (fixed for now)

// User Stats
thisMonthDonations = filter by current month
remainingThisMonth = 50 - thisMonthDonations
canDonate = thisMonthDonations < 50
```

---

## 🎯 Testing Checklist

### ✅ Favicon
- [ ] Logo hiển thị trên browser tab
- [ ] Logo đúng màu (purple/pink/blue gradient)
- [ ] Animated (optional - browser support)

### ✅ QR Code Size
- [ ] QR nhỏ gọn hơn so với trước
- [ ] Không bị crop
- [ ] Visual balance tốt với card

### ✅ Stats
- [ ] Supporters = số donations thật
- [ ] Coffees tính từ tổng tiền / 50k
- [ ] Update real-time khi có donate mới

### ✅ Tracking
- [ ] Add donation → localStorage updated
- [ ] Refresh page → data persists
- [ ] Check stats → correct numbers

### ✅ Limit
- [ ] Donate 1 lần → shows "49 còn lại"
- [ ] Donate 50 lần → shows warning
- [ ] Không thể add donation thứ 51
- [ ] Tháng mới → reset về 50

### ✅ History
- [ ] Click "Donate của tôi" → modal opens
- [ ] Shows correct stats
- [ ] Shows donation list
- [ ] Close button works
- [ ] Empty state if no donations

### ✅ Highlight
- [ ] User's donations có màu yellow
- [ ] Badge "Bạn/You" hiển thị
- [ ] Yellow ring border
- [ ] Other donations vẫn purple/pink

---

## 🚀 Usage Examples

### Add Donation Manually (for testing):
```typescript
import { addDonation } from "@/lib/donation-tracker";

addDonation({
  id: "donate-123",
  amount: 50000,
  description: "Test donation"
});
```

### Check if can donate:
```typescript
import { canDonateThisMonth, getRemainingDonations } from "@/lib/donation-tracker";

if (canDonateThisMonth()) {
  console.log(`You can donate ${getRemainingDonations()} more times`);
} else {
  console.log("Monthly limit reached!");
}
```

### Get user stats:
```typescript
import { getUserStats } from "@/lib/donation-tracker";

const stats = getUserStats();
console.log(stats);
// {
//   totalDonations: 10,
//   totalAmount: 500000,
//   thisMonthDonations: 5,
//   thisMonthAmount: 250000,
//   remainingThisMonth: 45,
//   canDonate: true
// }
```

---

## 📝 Notes

### Anonymous Donations:
- User không cần login
- Tracking hoàn toàn local (localStorage)
- Privacy-friendly
- Works offline

### Limitations:
- ⚠️ Clear browser data → lose history
- ⚠️ Different browser/device → separate tracking
- ⚠️ No sync across devices
- ⚠️ Manual tracking (for now)

### Future Ideas:
1. **Optional Login**: Sync across devices
2. **QR Code with UUID**: Auto-track donations
3. **Browser Fingerprinting**: Identify without login
4. **Export History**: Download as CSV/PDF
5. **Donation Receipts**: Generate tax receipts

---

Made with 💖 by Bùi Tuấn Tú

