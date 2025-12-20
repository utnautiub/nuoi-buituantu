# Scripts

## Fix Old Donations Timezone

Script để thêm field `transactionDate` cho các donations cũ.

### Setup

```bash
# Install firebase-admin nếu chưa có
npm install firebase-admin
```

### Run

```bash
# Set environment variables
export FIREBASE_ADMIN_PROJECT_ID="your_project_id"
export FIREBASE_ADMIN_CLIENT_EMAIL="your_client_email"
export FIREBASE_ADMIN_PRIVATE_KEY="your_private_key"

# Run script
node scripts/fix-old-donations-timezone.js
```

### What it does

1. Đọc tất cả donations từ Firestore
2. Skip nếu đã có `transactionDate` field
3. Với donations cũ:
   - Lấy `createdAt` timestamp
   - Add 7 giờ (VN timezone offset)
   - Tạo string format: "YYYY-MM-DD HH:mm:ss"
   - Update document với field `transactionDate`

### Note

⚠️ Script này giả định rằng `createdAt` bị lưu sai 7 giờ (UTC thay vì VN time).

Nếu không chắc chắn, **khuyên dùng Option 1: Xóa data cũ** thay vì chạy script này.


