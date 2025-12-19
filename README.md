# 💚 Nuôi Bùi Tuấn Tú - Donation Platform

Website donation cá nhân với tính năng sao kê công khai và minh bạch. Được xây dựng với Next.js 14, TypeScript, và Firebase.

## ✨ Tính năng

- 🎨 **UI hiện đại**: Giao diện đẹp mắt, responsive trên mọi thiết bị
- 📱 **Deep Linking**: Mở trực tiếp app ngân hàng từ web (iOS & Android)
- 🔗 **VietQR Integration**: Tạo mã QR tự động qua VietQR API
- 💾 **Lưu QR Code**: Download QR code về thiết bị
- 🔍 **Tìm kiếm ngân hàng**: Dropdown searchable với 15+ ngân hàng Việt Nam
- 🔔 **SePay Webhook**: Tự động nhận thông báo chuyển khoản
- 📊 **Sao kê công khai**: Hiển thị danh sách donations real-time
- 🔒 **Minh bạch**: Mọi giao dịch được lưu vào Firebase Firestore

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Payment Gateway**: SePay
- **QR Code**: VietQR API
- **Deployment**: Vercel

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/yourusername/nuoi-buituantu.git
cd nuoi-buituantu
```

### 2. Install dependencies

```bash
npm install
```

### 3. Cấu hình Environment Variables

Tạo file `.env.local` và điền thông tin:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key\n-----END PRIVATE KEY-----\n"

# SePay Configuration
SEPAY_WEBHOOK_SECRET=your_sepay_webhook_secret

# Bank Account Info
NEXT_PUBLIC_BANK_ACCOUNT_NO=your_account_number
NEXT_PUBLIC_BANK_ACCOUNT_NAME=BUI TUAN TU
NEXT_PUBLIC_BANK_BIN=970422
NEXT_PUBLIC_BANK_NAME=MBBank
```

### 4. Setup Firebase

1. Tạo project trên [Firebase Console](https://console.firebase.google.com/)
2. Tạo Firestore Database
3. Tạo Service Account và download JSON key
4. Copy credentials vào `.env.local`

### 5. Setup SePay Webhook

1. Đăng ký tài khoản tại [SePay](https://sepay.vn/)
2. Kết nối tài khoản ngân hàng MBBank
3. Cấu hình webhook URL: `https://yourdomain.com/api/webhook/sepay`
4. Lưu webhook secret vào `.env.local`

### 6. Run Development Server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 🚀 Deployment

### Deploy lên Vercel

1. Push code lên GitHub
2. Import repository vào [Vercel](https://vercel.com/)
3. Thêm Environment Variables
4. Deploy!

### Cấu hình Domain

1. Trỏ domain `nuoi.buituantu.com` về Vercel
2. Cập nhật webhook URL trên SePay
3. Test webhook với Postman hoặc curl

## 📁 Cấu trúc thư mục

```
nuoi-buituantu/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── donations/       # API lấy danh sách donations
│   │   │   └── webhook/
│   │   │       └── sepay/       # Webhook nhận từ SePay
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx             # Trang chủ
│   ├── components/
│   │   ├── ui/                  # UI Components (Button, Card,...)
│   │   ├── BankSelector.tsx     # Dropdown chọn ngân hàng
│   │   ├── QRCodeDisplay.tsx    # Hiển thị QR code
│   │   └── DonationList.tsx     # Danh sách donations
│   ├── lib/
│   │   ├── banks.ts             # Data ngân hàng VN
│   │   ├── vietqr.ts            # VietQR API integration
│   │   ├── deep-linking.ts      # Deep linking utilities
│   │   ├── firebase.ts          # Firebase client
│   │   ├── firebase-admin.ts    # Firebase admin
│   │   └── utils.ts             # Helper functions
│   └── types/
│       └── donation.ts          # TypeScript types
├── public/                      # Static assets
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🔧 Cấu hình Firestore

### Collections Structure

**donations** collection:

```typescript
{
  transactionId: string; // Unique transaction ID
  amount: number; // Số tiền donate
  description: string; // Nội dung chuyển khoản
  donorName: string; // Tên người donate
  gateway: "sepay" | "manual"; // Payment gateway
  bankAccount: string; // Số tài khoản
  bankName: string; // Tên ngân hàng
  status: "completed"; // Trạng thái
  createdAt: Timestamp; // Thời gian
  metadata: object; // Thông tin thêm
}
```

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read for donations
    match /donations/{donation} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## 🔐 Bảo mật

- ✅ Webhook được bảo vệ bằng secret token
- ✅ Firebase Admin SDK chỉ chạy server-side
- ✅ Firestore rules chỉ cho phép đọc, không cho phép write từ client
- ✅ Environment variables không được commit lên Git

## 📱 Deep Linking Support

Website hỗ trợ mở trực tiếp app ngân hàng:

### iOS

- URL Schemes: `mbmobilebanking://`, `vcbdigibank://`,...
- Universal Links (nếu ngân hàng hỗ trợ)

### Android

- Intent URLs với package name
- Fallback về Play Store nếu chưa cài app

## 🎨 Customization

### Thay đổi màu chủ đạo

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: "your-color-here",
}
```

### Thay đổi thông tin cá nhân

Edit `src/app/page.tsx`:

```typescript
const BANK_CONFIG = {
  accountNo: "your_account_number",
  accountName: "YOUR NAME",
  bankBin: "970422",
  bankName: "MBBank",
};
```

## 🤝 Contributing

Pull requests are welcome! Nếu có bug hoặc feature request, vui lòng tạo issue.

## 📄 License

MIT License - feel free to use for your own donation page!

## 💬 Contact

- **Website**: [buituantu.com](https://buituantu.com)
- **Email**: contact@buituantu.com
- **GitHub**: [@buituantu](https://github.com/buituantu)

---

Made with ❤️ by Bùi Tuấn Tú
