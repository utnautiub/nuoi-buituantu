# 🚀 Hướng dẫn Setup Chi Tiết

## Bước 1: Setup Firebase

### 1.1 Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Nhập tên project: `nuoi-buituantu`
4. Disable Google Analytics (không bắt buộc)
5. Click "Create project"

### 1.2 Tạo Firestore Database

1. Trong Firebase Console, vào "Build" → "Firestore Database"
2. Click "Create database"
3. Chọn "Start in production mode"
4. Chọn location: `asia-southeast1` (Singapore)
5. Click "Enable"

### 1.3 Cấu hình Firestore Rules

Vào tab "Rules" và paste code sau:

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

Click "Publish"

### 1.4 Lấy Firebase Config

1. Vào "Project Overview" → Settings (⚙️) → "Project settings"
2. Scroll xuống "Your apps"
3. Click Web icon (</>) để tạo web app
4. Đặt tên app: `nuoi-buituantu-web`
5. Copy firebaseConfig object

### 1.5 Tạo Service Account (Admin SDK)

1. Vào "Project settings" → "Service accounts"
2. Click "Generate new private key"
3. Download file JSON
4. Mở file JSON và copy:
   - `project_id`
   - `client_email`
   - `private_key`

## Bước 2: Setup SePay

### 2.1 Đăng ký SePay

1. Truy cập [SePay.vn](https://sepay.vn/)
2. Đăng ký tài khoản
3. Xác thực email và số điện thoại

### 2.2 Kết nối Ngân hàng

1. Đăng nhập vào dashboard SePay
2. Vào "Tài khoản ngân hàng"
3. Click "Thêm tài khoản"
4. Chọn "MBBank"
5. Nhập số tài khoản và OTP xác thực

### 2.3 Cấu hình Webhook

1. Vào "Cài đặt" → "Webhook"
2. Nhập URL webhook: `https://yourdomain.com/api/webhook/sepay`
   - Nếu đang dev local, dùng [ngrok](https://ngrok.com/) để tạo public URL
3. Tạo một webhook secret (random string)
4. Lưu secret này vào `.env.local`

### 2.4 Test Webhook

Dùng curl để test:

```bash
curl -X POST https://yourdomain.com/api/webhook/sepay \
  -H "Authorization: Bearer your_webhook_secret" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test123",
    "gateway": "MBBank",
    "transactionDate": "2024-01-01 10:00:00",
    "accountNumber": "0123456789",
    "code": null,
    "content": "NGUYEN VAN A chuyen tien",
    "transferType": "in",
    "transferAmount": 50000,
    "accumulated": 1000000,
    "referenceCode": "REF123",
    "description": "Test donation"
  }'
```

## Bước 3: Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục root:

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nuoi-buituantu.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nuoi-buituantu
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nuoi-buituantu.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=nuoi-buituantu
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nuoi-buituantu.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"

# SePay
SEPAY_WEBHOOK_SECRET=your_random_secret_here

# Bank Info
NEXT_PUBLIC_BANK_ACCOUNT_NO=0123456789
NEXT_PUBLIC_BANK_ACCOUNT_NAME=BUI TUAN TU
NEXT_PUBLIC_BANK_BIN=970422
NEXT_PUBLIC_BANK_NAME=MBBank
```

## Bước 4: Install và Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Mở http://localhost:3000

## Bước 5: Deploy lên Vercel

### 5.1 Push lên GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/nuoi-buituantu.git
git push -u origin main
```

### 5.2 Deploy trên Vercel

1. Truy cập [Vercel](https://vercel.com/)
2. Click "Import Project"
3. Chọn repository GitHub
4. Vào "Environment Variables"
5. Paste tất cả biến từ `.env.local`
6. Click "Deploy"

### 5.3 Cấu hình Domain

1. Sau khi deploy xong, vào "Settings" → "Domains"
2. Thêm domain: `nuoi.buituantu.com`
3. Cập nhật DNS records theo hướng dẫn của Vercel
4. Đợi DNS propagate (~5-10 phút)

### 5.4 Cập nhật Webhook URL

1. Quay lại SePay dashboard
2. Cập nhật webhook URL thành: `https://nuoi.buituantu.com/api/webhook/sepay`
3. Save và test lại webhook

## Bước 6: Test End-to-End

### 6.1 Test QR Code

1. Truy cập website
2. Kiểm tra QR code hiển thị đúng
3. Thử download QR code

### 6.2 Test Bank Selector

1. Click dropdown chọn ngân hàng
2. Search ngân hàng
3. Chọn 1 ngân hàng
4. Trên mobile: check xem app có mở không
5. Trên desktop: check xem có hiển thị hướng dẫn không

### 6.3 Test Donation Flow

1. Mở app banking trên điện thoại
2. Quét QR code đã lưu
3. Chuyển khoản một số tiền nhỏ (10,000 VNĐ)
4. Đợi SePay webhook (~1-2 phút)
5. Refresh trang web → donation sẽ xuất hiện trong danh sách

## Troubleshooting

### Lỗi Firebase

```
Error: Failed to initialize Firebase
```

**Fix**: Kiểm tra lại các biến `NEXT_PUBLIC_FIREBASE_*` trong `.env.local`

### Lỗi Firebase Admin

```
Error: Failed to load default credentials
```

**Fix**:

- Kiểm tra `FIREBASE_ADMIN_PRIVATE_KEY` có đúng format không
- Private key phải wrap trong dấu ngoặc kép và có `\n` cho line breaks

### Webhook không nhận

```
401 Unauthorized
```

**Fix**: Kiểm tra `SEPAY_WEBHOOK_SECRET` khớp với secret trên SePay dashboard

### Deep linking không hoạt động

- **iOS**: Một số ngân hàng không support deep link, phải mở thủ công
- **Android**: Cần cài app trước khi test
- **Desktop**: Deep linking chỉ work trên mobile

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [SePay API Docs](https://sepay.vn/tai-lieu-tich-hop)
- [VietQR Docs](https://www.vietqr.io/danh-sach-api)
- [Vercel Docs](https://vercel.com/docs)

## 💡 Tips

1. **Test webhook trên local**: Dùng [ngrok](https://ngrok.com/) để expose local server ra public URL
2. **Monitor logs**: Check Vercel logs để debug issues
3. **Firebase costs**: Firestore free tier: 50K reads/day, 20K writes/day
4. **SePay limits**: Check với SePay về rate limits của webhook

---

Nếu gặp vấn đề, mở issue trên GitHub hoặc liên hệ: contact@buituantu.com

