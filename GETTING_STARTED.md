# 🎯 Getting Started - Hướng dẫn Bắt Đầu

Chào mừng bạn đến với **Nuôi Bùi Tuấn Tú**! Đây là hướng dẫn từng bước để bạn có thể chạy dự án này.

## 📚 Tài liệu

- [README.md](README.md) - Tổng quan dự án
- [QUICKSTART.md](QUICKSTART.md) - Hướng dẫn nhanh (5 phút)
- [SETUP.md](SETUP.md) - Hướng dẫn setup chi tiết
- [DEPLOYMENT.md](DEPLOYMENT.md) - Hướng dẫn deploy production
- [CONTRIBUTING.md](CONTRIBUTING.md) - Hướng dẫn đóng góp

## 🎓 Prerequisites

Trước khi bắt đầu, bạn cần có:

### Kiến thức

- ✅ Biết cơ bản về JavaScript/TypeScript
- ✅ Hiểu về React và Next.js (không bắt buộc nhưng nên có)
- ✅ Biết sử dụng terminal/command line
- ✅ Biết cơ bản về Git

### Tools cần cài

- ✅ **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- ✅ **npm** hoặc **yarn** (đi kèm với Node.js)
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **Code editor** (VS Code khuyên dùng)

### Accounts cần tạo

- ✅ **Firebase** account (free) - [Đăng ký](https://firebase.google.com/)
- ✅ **SePay** account (free) - [Đăng ký](https://sepay.vn/)
- ✅ **GitHub** account (để clone repo)
- 🎁 **Vercel** account (optional, để deploy) - [Đăng ký](https://vercel.com/)

## 🚀 Quick Start (Dành cho người đã có kinh nghiệm)

```bash
# 1. Clone và install
git clone https://github.com/yourusername/nuoi-buituantu.git
cd nuoi-buituantu
npm install

# 2. Setup environment
cp env.example .env.local
# Edit .env.local với thông tin của bạn

# 3. Run
npm run dev
```

## 📖 Detailed Guide (Dành cho người mới)

### Bước 1: Clone Repository

#### Option A: Sử dụng Git (Khuyên dùng)

```bash
# Clone repository
git clone https://github.com/yourusername/nuoi-buituantu.git

# Di chuyển vào folder
cd nuoi-buituantu
```

#### Option B: Download ZIP

1. Vào [GitHub repository](https://github.com/yourusername/nuoi-buituantu)
2. Click nút "Code" → "Download ZIP"
3. Giải nén file
4. Mở terminal/cmd tại folder vừa giải nén

### Bước 2: Install Dependencies

```bash
# Cài đặt tất cả packages cần thiết
npm install

# Hoặc nếu dùng yarn
yarn install
```

Đợi 1-2 phút để npm/yarn download và install tất cả dependencies.

### Bước 3: Setup Firebase

#### 3.1 Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Đăng nhập bằng Google account
3. Click **"Add project"** hoặc **"Thêm dự án"**
4. Đặt tên project: `nuoi-buituantu` (hoặc tên bạn thích)
5. Disable Google Analytics (không cần thiết)
6. Click **"Create project"**

#### 3.2 Tạo Web App

1. Trong Firebase Console, click biểu tượng **Web** (`</>`)
2. Đặt nickname: `nuoi-buituantu-web`
3. **Không** check "Setup Firebase Hosting"
4. Click **"Register app"**
5. Copy đoạn `firebaseConfig` (sẽ dùng sau)

#### 3.3 Enable Firestore

1. Sidebar → Build → **Firestore Database**
2. Click **"Create database"**
3. Chọn **"Start in production mode"**
4. Chọn location: **asia-southeast1 (Singapore)** (gần VN nhất)
5. Click **"Enable"**

#### 3.4 Configure Firestore Rules

1. Tab **"Rules"**
2. Paste code sau:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /donations/{donation} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

3. Click **"Publish"**

#### 3.5 Create Service Account

1. ⚙️ Settings → **Project settings**
2. Tab **"Service accounts"**
3. Click **"Generate new private key"**
4. Click **"Generate key"**
5. File JSON sẽ được download

### Bước 4: Setup SePay

#### 4.1 Đăng ký SePay

1. Truy cập [SePay.vn](https://sepay.vn/)
2. Click **"Đăng ký"**
3. Điền thông tin: Email, password, số điện thoại
4. Xác thực email và OTP

#### 4.2 Kết nối Ngân hàng

1. Đăng nhập SePay dashboard
2. Sidebar → **"Tài khoản ngân hàng"**
3. Click **"Thêm tài khoản"**
4. Chọn ngân hàng: **MBBank** (hoặc ngân hàng bạn dùng)
5. Nhập số tài khoản
6. Xác thực bằng OTP từ SMS

**Lưu ý**: Bạn cần có tài khoản ngân hàng thật để test. Không thể dùng fake/sandbox.

#### 4.3 Cấu hình Webhook

1. Sidebar → **"Cài đặt"** → **"Webhook"**
2. Tạm thời để trống (sẽ config sau khi deploy)
3. Tạo một **webhook secret**: Random string dài (ví dụ: `my_super_secret_key_123456`)
4. Lưu secret này lại

### Bước 5: Configure Environment Variables

1. Copy file mẫu:

```bash
cp env.example .env.local
```

2. Mở file `.env.local` bằng code editor

3. Điền thông tin Firebase (từ bước 3.2):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nuoi-buituantu.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nuoi-buituantu
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nuoi-buituantu.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

4. Điền Firebase Admin SDK (từ file JSON bước 3.5):

```env
FIREBASE_ADMIN_PROJECT_ID=nuoi-buituantu
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nuoi-buituantu.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

**Lưu ý**: `FIREBASE_ADMIN_PRIVATE_KEY` phải giữ nguyên format với `\n`

5. Điền SePay webhook secret:

```env
SEPAY_WEBHOOK_SECRET=93b16d75-6d58-4127-8b67-5eabf358a848
```

6. Điền thông tin tài khoản ngân hàng:

```env
NEXT_PUBLIC_BANK_ACCOUNT_NO=0123456789
NEXT_PUBLIC_BANK_ACCOUNT_NAME=BUI TUAN TU
NEXT_PUBLIC_BANK_BIN=970422
NEXT_PUBLIC_BANK_NAME=MBBank
```

**Lưu ý**:

- `BANK_BIN` của MBBank là `970422`
- Tên phải viết HOA, không dấu
- Xem danh sách BIN codes trong `src/lib/banks.ts`

### Bước 6: Run Development Server

```bash
npm run dev
```

Mở trình duyệt và truy cập: **http://localhost:3000**

Bạn sẽ thấy trang donation với QR code!

## 🧪 Test Local

### Test QR Code

1. Trang sẽ hiển thị QR code
2. Click **"Lưu mã QR"** để download
3. Mở app banking trên điện thoại
4. Chọn "Chuyển khoản" → "Quét QR"
5. Quét mã QR vừa lưu
6. Thông tin sẽ tự động điền vào form

### Test Bank Selector

**Trên Mobile:**

1. Mở http://your-ip:3000 từ điện thoại (cùng WiFi)
2. Scroll xuống "Chọn ngân hàng"
3. Chọn ngân hàng bạn đang dùng
4. App banking sẽ tự động mở (nếu đã cài)

**Trên Desktop:**

1. Chọn bất kỳ ngân hàng nào
2. Sẽ hiển thị hướng dẫn chuyển khoản

### Test Webhook (Local)

**Option 1: Sử dụng ngrok**

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000
```

Copy URL ngrok (ví dụ: `https://abc123.ngrok.io`) và update vào SePay webhook settings:

- URL: `https://abc123.ngrok.io/api/webhook/sepay`

**Option 2: Test manual với curl**

```bash
curl -X POST http://localhost:3000/api/webhook/sepay \
  -H "Authorization: Bearer my_super_secret_key_123456" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TEST123",
    "gateway": "MBBank",
    "transactionDate": "2024-12-19 10:00:00",
    "accountNumber": "0123456789",
    "code": null,
    "content": "NGUYEN VAN A nuoi Bui Tuan Tu",
    "transferType": "in",
    "transferAmount": 50000,
    "accumulated": 1000000,
    "referenceCode": "REF123",
    "description": "Test donation"
  }'
```

Refresh trang web, donation sẽ xuất hiện trong danh sách!

## 🚢 Deploy to Production

Xem hướng dẫn chi tiết tại [DEPLOYMENT.md](DEPLOYMENT.md)

### Quick Deploy với Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

Follow instructions và paste environment variables khi được hỏi.

## ❓ Troubleshooting

### Lỗi: Cannot find module 'next'

```bash
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: Firebase initialization failed

- Kiểm tra lại `NEXT_PUBLIC_FIREBASE_*` variables
- Đảm bảo không có space thừa

### Lỗi: Webhook 401 Unauthorized

- Kiểm tra `SEPAY_WEBHOOK_SECRET` khớp với SePay dashboard
- Kiểm tra Authorization header format: `Bearer your_secret`

### QR code không hiển thị

- Check network tab trong DevTools
- Kiểm tra VietQR API có response không
- Thử refresh trang

### Deep linking không work

- Chỉ work trên mobile (iOS/Android)
- Phải cài app ngân hàng trước
- Một số ngân hàng không support deep link

## 📚 Next Steps

Sau khi chạy thành công:

1. ✅ Customize thông tin cá nhân trong `src/app/page.tsx`
2. ✅ Thay đổi colors trong `tailwind.config.ts`
3. ✅ Deploy lên Vercel hoặc hosting khác
4. ✅ Setup domain riêng
5. ✅ Config SePay webhook URL production
6. ✅ Test end-to-end bằng donation thật

## 💬 Cần Giúp Đỡ?

- 📖 Đọc [SETUP.md](SETUP.md) cho hướng dẫn chi tiết hơn
- 🐛 [Tạo issue](https://github.com/yourusername/nuoi-buituantu/issues) nếu gặp bug
- 💬 Email: contact@buituantu.com
- 🌟 Star repo nếu thấy hữu ích!

---

Chúc bạn thành công! 🎉


