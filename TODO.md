# 📝 TODO List

## ✅ Completed

- [x] Setup Next.js project với TypeScript
- [x] Configure Tailwind CSS
- [x] Tạo UI components (Button, Card)
- [x] Implement VietQR integration
- [x] Tạo QR Code display component
- [x] Implement download QR functionality
- [x] Tạo bank selector với search
- [x] Implement deep linking cho iOS/Android
- [x] Setup Firebase client SDK
- [x] Setup Firebase Admin SDK
- [x] Tạo API route cho donations
- [x] Tạo webhook endpoint cho SePay
- [x] Tạo donation list component
- [x] Design responsive layout
- [x] Viết documentation (README, SETUP, DEPLOYMENT)

## 🚧 In Progress

- [ ] Test deep linking trên các ngân hàng thực tế
- [ ] Test webhook với SePay real transactions

## 📋 Backlog

### Features

- [ ] Thêm animation khi có donation mới
- [ ] Implement real-time updates với Firebase Realtime Database
- [ ] Thêm sound effect khi có donation
- [ ] Tạo donation leaderboard (top donors)
- [ ] Thêm monthly/yearly stats
- [ ] Export donation report (PDF/CSV)
- [ ] Thêm Dark mode toggle
- [ ] Multi-language support (EN/VI)
- [ ] Social share buttons
- [ ] Donation certificate generator

### Technical Improvements

- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Add E2E tests (Playwright)
- [ ] Implement caching với Redis
- [ ] Add rate limiting cho API
- [ ] Optimize images với Next.js Image
- [ ] Add PWA support (offline mode)
- [ ] Implement error boundary
- [ ] Add Sentry for error tracking
- [ ] Add Google Analytics
- [ ] Optimize bundle size
- [ ] Add performance monitoring

### Security

- [ ] Implement CSRF protection
- [ ] Add input validation
- [ ] Add SQL injection protection (Firestore đã có sẵn)
- [ ] Add XSS protection
- [ ] Implement request signing cho webhook
- [ ] Add backup strategy
- [ ] Security audit

### UI/UX Improvements

- [ ] Thêm loading states cho tất cả async operations
- [ ] Improve error messages
- [ ] Thêm empty states
- [ ] Improve mobile UX
- [ ] Add accessibility (ARIA labels, keyboard navigation)
- [ ] Thêm confetti animation khi donate
- [ ] Improve QR code display trên mobile
- [ ] Add toast notifications
- [ ] Thêm donation goal tracker
- [ ] Profile page cho donor

### Documentation

- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add component storybook
- [ ] Record demo video
- [ ] Create tutorial blog posts
- [ ] Add troubleshooting guide
- [ ] Vietnamese translation cho all docs

### DevOps

- [ ] Setup CI/CD pipeline (GitHub Actions)
- [ ] Add automated testing in CI
- [ ] Setup staging environment
- [ ] Add database backups automation
- [ ] Setup monitoring alerts
- [ ] Add health check endpoint
- [ ] Docker support
- [ ] Kubernetes deployment guide

## 💡 Ideas

- [ ] Plugin cho WordPress/Shopify
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Email notification khi có donation
- [ ] Telegram bot notification
- [ ] Discord webhook integration
- [ ] Donation with crypto (Bitcoin, Ethereum)
- [ ] Recurring donations
- [ ] Donation tiers với rewards
- [ ] Donation wall of fame

## 🐛 Known Issues

- Deep linking không work với một số ngân hàng chưa support
- QR download có thể bị lỗi trên một số browsers cũ
- Webhook có thể bị delay 1-2 phút từ SePay

## 📝 Notes

- Ưu tiên features dựa trên user feedback
- Maintain code quality > ship fast
- Security first
- Document everything
- Test trước khi deploy

---

Last updated: 2024-12-19
