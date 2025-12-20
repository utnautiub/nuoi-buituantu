# 👋 Chào Mừng Đến Với Dự Án Nuôi Bùi Tuấn Tú!

## 🎉 Bạn Đang Ở Đây!

Dự án này là một **donation platform** hoàn chỉnh với:
- ✅ QR code VietQR
- ✅ Deep linking mở app ngân hàng
- ✅ Webhook tự động từ SePay
- ✅ Sao kê công khai minh bạch
- ✅ UI đẹp, responsive

## 🚀 Bắt Đầu Nhanh (5 phút)

### Bước 1: Cài đặt

```bash
npm install
```

### Bước 2: Copy environment template

```bash
cp env.example .env.local
```

### Bước 3: Chỉnh sửa `.env.local`

Điền thông tin Firebase, SePay, và ngân hàng của bạn.

### Bước 4: Chạy

```bash
npm run dev
```

Mở http://localhost:3000 🎉

## 📚 Tài Liệu Đầy Đủ

Tùy vào mức độ kinh nghiệm, chọn hướng dẫn phù hợp:

### 🟢 Mới Bắt Đầu (Beginner)

👉 **[GETTING_STARTED.md](GETTING_STARTED.md)**
- Hướng dẫn chi tiết từng bước
- Giải thích mọi khái niệm
- Screenshots và examples
- Troubleshooting thường gặp

### 🟡 Có Kinh Nghiệm (Intermediate)

👉 **[QUICKSTART.md](QUICKSTART.md)**
- Hướng dẫn nhanh 5-10 phút
- Giả định bạn đã biết cơ bản
- Commands và config chính

### 🔴 Chuyên Nghiệp (Advanced)

👉 **[README.md](README.md)**
- Tech stack overview
- Architecture decisions
- API documentation
- Customization guide

## 📖 Tài Liệu Chi Tiết

| File | Mô Tả | Thời Gian Đọc |
|------|-------|---------------|
| [README.md](README.md) | Tổng quan dự án | 5 phút |
| [QUICKSTART.md](QUICKSTART.md) | Hướng dẫn nhanh | 3 phút |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Hướng dẫn chi tiết | 15 phút |
| [SETUP.md](SETUP.md) | Setup Firebase & SePay | 20 phút |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deploy production | 15 phút |
| [NEXT_STEPS.md](NEXT_STEPS.md) | Bước tiếp theo | 5 phút |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Đóng góp code | 10 phút |
| [TODO.md](TODO.md) | Roadmap tương lai | 5 phút |

## 🎯 Workflow Khuyên Dùng

```
1. Đọc START_HERE.md (bạn đang đọc) ✓
   ↓
2. Chọn hướng dẫn phù hợp
   ├─→ Beginner: GETTING_STARTED.md
   ├─→ Intermediate: QUICKSTART.md
   └─→ Advanced: README.md
   ↓
3. Setup local environment
   → Đọc SETUP.md
   ↓
4. Test local
   → npm run dev
   ↓
5. Deploy
   → Đọc DEPLOYMENT.md
   ↓
6. Customize
   → Đọc NEXT_STEPS.md
   ↓
7. Maintain & Improve
   → Đọc TODO.md
```

## ⚡ Quick Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build production
npm run start        # Start production
npm run lint         # Run linter

# Deployment
vercel               # Deploy to Vercel
vercel --prod        # Deploy to production

# Testing
curl http://localhost:3000/api/donations
curl http://localhost:3000/api/webhook/sepay
```

## 🔑 Environment Variables Cần Thiết

Tối thiểu cần có:

```env
# Firebase (bắt buộc)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Bank Info (bắt buộc)
NEXT_PUBLIC_BANK_ACCOUNT_NO=
NEXT_PUBLIC_BANK_ACCOUNT_NAME=
NEXT_PUBLIC_BANK_BIN=
```

Xem đầy đủ trong `env.example`

## 🏗️ Cấu Trúc Project

```
nuoi-buituantu/
├── src/
│   ├── app/              # Next.js pages & API
│   ├── components/       # React components
│   ├── lib/              # Utilities & helpers
│   └── types/            # TypeScript types
├── public/               # Static assets
├── .github/              # GitHub templates
└── *.md                  # Documentation
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Payment**: SePay Webhook
- **QR**: VietQR API
- **Deploy**: Vercel

## ✅ Checklist Setup

Theo thứ tự ưu tiên:

### Must Have (Bắt buộc)
- [ ] Node.js 18+ installed
- [ ] Firebase project created
- [ ] Firebase credentials configured
- [ ] `.env.local` setup
- [ ] Test local (`npm run dev`)

### Should Have (Nên có)
- [ ] SePay account created
- [ ] Bank account connected
- [ ] Webhook configured
- [ ] Deploy to Vercel
- [ ] Custom domain setup

### Nice to Have (Tùy chọn)
- [ ] Google Analytics
- [ ] Error tracking (Sentry)
- [ ] CI/CD (GitHub Actions)
- [ ] PWA support
- [ ] Dark mode

## 🎨 Customization

### 1. Thay đổi thông tin cá nhân

Edit `src/app/page.tsx`:
```typescript
const BANK_CONFIG = {
  accountNo: "YOUR_NUMBER",
  accountName: "YOUR NAME",
  // ...
};
```

### 2. Thay đổi màu sắc

Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: "your-color",
}
```

### 3. Thay đổi font

Edit `src/app/layout.tsx`

### 4. Thêm social links

Edit header section trong `src/app/page.tsx`

## 🐛 Gặp Vấn Đề?

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Environment Variables
- Check `.env.local` có đúng format không
- Không có space thừa
- Strings có dấu ngoặc kép nếu cần

### Firebase Errors
- Verify credentials
- Check Firestore rules
- Ensure region matches

### Webhook Issues
- Test với curl
- Check Authorization header
- Verify secret matches

## 💡 Pro Tips

1. **Start Simple**: Test local trước khi deploy
2. **Read Docs**: Đọc documentation trước khi code
3. **Test Real**: Test với donation thật (nhỏ)
4. **Monitor**: Check Firebase và Vercel logs
5. **Backup**: Backup `.env.local` somewhere safe

## 🎓 Learning Resources

### Next.js
- [Next.js Docs](https://nextjs.org/docs)
- [Next.js Learn](https://nextjs.org/learn)

### Firebase
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com)

## 📞 Support & Contact

### Documentation
- Tất cả questions đã có trong các file .md
- Đọc kỹ trước khi hỏi!

### Issues
- Search trước: [GitHub Issues](https://github.com/yourusername/nuoi-buituantu/issues)
- Create mới nếu chưa có

### Contact
- Email: contact@buituantu.com
- GitHub: @buituantu

## 🎯 Next Steps

Sau khi đọc file này:

1. **Beginner?** → Đọc [GETTING_STARTED.md](GETTING_STARTED.md)
2. **Experienced?** → Đọc [QUICKSTART.md](QUICKSTART.md)
3. **Ready to deploy?** → Đọc [DEPLOYMENT.md](DEPLOYMENT.md)

## 🌟 Contributing

Want to contribute? Read [CONTRIBUTING.md](CONTRIBUTING.md)

Ideas for features? Check [TODO.md](TODO.md)

## 📜 License

MIT License - Free to use!

---

## 🎉 Let's Get Started!

Chọn một trong các options sau:

### Option 1: Tôi muốn hiểu mọi thứ chi tiết
👉 Đọc [GETTING_STARTED.md](GETTING_STARTED.md)

### Option 2: Tôi muốn setup nhanh
👉 Đọc [QUICKSTART.md](QUICKSTART.md)

### Option 3: Tôi đã setup xong, giờ làm gì?
👉 Đọc [NEXT_STEPS.md](NEXT_STEPS.md)

### Option 4: Tôi muốn deploy ngay
👉 Đọc [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Good luck and happy coding!** 🚀

Made with ❤️ by Bùi Tuấn Tú


