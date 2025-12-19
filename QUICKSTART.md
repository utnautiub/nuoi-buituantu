# ⚡ Quick Start

Bắt đầu trong 5 phút!

## 🚀 Cài đặt nhanh

```bash
# 1. Clone repository
git clone https://github.com/yourusername/nuoi-buituantu.git
cd nuoi-buituantu

# 2. Install dependencies
npm install

# 3. Copy environment template
cp env.example .env.local

# 4. Edit .env.local và điền thông tin
# (Xem SETUP.md để biết cách lấy credentials)

# 5. Run development server
npm run dev
```

Mở http://localhost:3000 🎉

## 📝 Checklist cần có

- [ ] Firebase project (free tier)
- [ ] SePay account (free)
- [ ] Tài khoản MBBank đã kết nối với SePay
- [ ] Environment variables đã config

## 🔑 Environment Variables tối thiểu

```env
# Firebase (bắt buộc)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Bank Info (bắt buộc)
NEXT_PUBLIC_BANK_ACCOUNT_NO=0123456789
NEXT_PUBLIC_BANK_ACCOUNT_NAME=YOUR NAME
NEXT_PUBLIC_BANK_BIN=970422
```

## 🧪 Test local

```bash
# Test trang chủ
curl http://localhost:3000

# Test API donations
curl http://localhost:3000/api/donations

# Test webhook endpoint
curl http://localhost:3000/api/webhook/sepay
```

## 📱 Test trên mobile

1. Tìm IP local: `ipconfig` (Windows) hoặc `ifconfig` (Mac/Linux)
2. Truy cập từ mobile: `http://192.168.x.x:3000`
3. Test deep linking

## 🚢 Deploy lên Vercel (1 click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/nuoi-buituantu)

Hoặc manual:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📚 Đọc thêm

- [README.md](README.md) - Tổng quan dự án
- [SETUP.md](SETUP.md) - Hướng dẫn setup chi tiết
- [DEPLOYMENT.md](DEPLOYMENT.md) - Hướng dẫn deploy

## ❓ Gặp vấn đề?

### Build error

```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Firebase error

Kiểm tra lại credentials trong `.env.local`

### Webhook không work

Chắc chắn đã:
1. Set `SEPAY_WEBHOOK_SECRET` trong `.env.local`
2. Config webhook URL trên SePay dashboard
3. Test với curl hoặc Postman

## 💡 Tips

- **Dev local**: Dùng [ngrok](https://ngrok.com) để test webhook
- **Test QR**: Download xuống điện thoại và thử quét
- **Monitor**: Check Vercel logs hoặc Firebase console

## 🎯 Next Steps

1. ✅ Setup project local
2. ✅ Test basic features
3. 📝 Config Firebase + SePay
4. 🚢 Deploy lên Vercel
5. 🎨 Customize theo ý bạn!

---

Happy coding! 💚

