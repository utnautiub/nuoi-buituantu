# 🔐 Hướng dẫn Cấu hình Firebase Authentication

## Bước 1: Bật Authentication trong Firebase Console

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project của bạn
3. Vào **"Authentication"** trong menu bên trái
4. Click **"Get started"** nếu chưa bật

## Bước 2: Bật Email/Password Authentication

1. Trong tab **"Sign-in method"**
2. Click vào **"Email/Password"**
3. Bật **"Enable"** toggle
4. Click **"Save"**

## Bước 3: Bật Google OAuth (Quan trọng!)

1. Trong tab **"Sign-in method"**
2. Click vào **"Google"**
3. Bật **"Enable"** toggle
4. Chọn **"Project support email"** (email của bạn)
5. Click **"Save"**

### ⚠️ Lưu ý về Google OAuth:

Sau khi bật Google OAuth, bạn **PHẢI** thêm authorized domains:

1. Vẫn trong tab **"Sign-in method"** → **"Google"**
2. Scroll xuống phần **"Authorized domains"**
3. Thêm các domains sau:
   - `localhost` (cho development)
   - Domain production của bạn (ví dụ: `nuoi-buituantu.vercel.app`)
   - Domain custom nếu có (ví dụ: `nuoi-buituantu.com`)

**Nếu không thêm authorized domains, Google login sẽ báo lỗi!**

## Bước 4: Kiểm tra Environment Variables

Đảm bảo file `.env.local` có đầy đủ các biến sau:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Lấy Firebase Config:

1. Vào Firebase Console → **Project Settings** (⚙️)
2. Scroll xuống **"Your apps"**
3. Nếu chưa có web app, click **"Add app"** → chọn **Web** (</>)
4. Copy các giá trị từ `firebaseConfig` object

## Bước 5: Cấu hình Firestore Rules cho Users

Vào **Firestore Database** → **Rules** và thêm:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Donations - public read, no write
    match /donations/{donation} {
      allow read: if true;
      allow write: if false;
    }

    // Users - read own data, write own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **"Publish"**

## Bước 6: Test Authentication

### Test Email/Password:

1. Mở app tại `http://localhost:3000`
2. Click **"Đăng nhập"** hoặc **"Đăng ký"**
3. Thử tạo tài khoản mới với email/password
4. Kiểm tra email xác nhận (nếu có)

### Test Google OAuth:

1. Click **"Tiếp tục với Google"**
2. Chọn tài khoản Google
3. Cho phép quyền truy cập
4. Kiểm tra xem đã đăng nhập thành công chưa

## Troubleshooting

### ❌ Lỗi: "auth/unauthorized-domain"

**Nguyên nhân**: Domain chưa được thêm vào authorized domains

**Giải pháp**:

1. Vào Firebase Console → Authentication → Settings
2. Scroll xuống **"Authorized domains"**
3. Thêm domain của bạn (localhost cho dev, domain thật cho production)

### ❌ Lỗi: "auth/popup-closed-by-user"

**Nguyên nhân**: User đóng popup trước khi hoàn tất

**Giải pháp**: Đã được xử lý bằng redirect flow. Nếu vẫn lỗi, kiểm tra browser có block popup không.

### ❌ Lỗi: "auth/operation-not-allowed"

**Nguyên nhân**: Sign-in method chưa được bật

**Giải pháp**:

1. Vào Firebase Console → Authentication → Sign-in method
2. Bật Email/Password hoặc Google

### ❌ Lỗi: "auth/network-request-failed"

**Nguyên nhân**: Lỗi kết nối mạng hoặc Firebase config sai

**Giải pháp**:

1. Kiểm tra internet connection
2. Kiểm tra lại các biến môi trường trong `.env.local`
3. Đảm bảo `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` đúng format: `project-id.firebaseapp.com`

### ❌ Google OAuth không hoạt động trên mobile

**Nguyên nhân**: Redirect flow có thể bị block

**Giải pháp**: Code đã được cập nhật để dùng `signInWithRedirect` thay vì popup cho mobile. Nếu vẫn lỗi, kiểm tra:

- Authorized domains đã thêm chưa
- Firebase config đúng chưa
- Browser/device có hỗ trợ redirect không

## Checklist

- [ ] Firebase Authentication đã được bật
- [ ] Email/Password sign-in method đã enable
- [ ] Google sign-in method đã enable
- [ ] Authorized domains đã thêm (localhost + production domain)
- [ ] Environment variables đã cấu hình đúng trong `.env.local`
- [ ] Firestore rules đã cấu hình cho users collection
- [ ] Đã test đăng ký với email/password
- [ ] Đã test đăng nhập với email/password
- [ ] Đã test đăng nhập với Google OAuth

## Cần hỗ trợ?

Nếu vẫn gặp lỗi, kiểm tra:

1. Browser console để xem error message chi tiết
2. Firebase Console → Authentication → Users để xem user đã được tạo chưa
3. Network tab trong DevTools để xem request có fail không
