# 🤝 Contributing Guide

Cảm ơn bạn đã quan tâm đến việc đóng góp cho dự án **Nuôi Bùi Tuấn Tú**!

## 🎯 Cách đóng góp

### Báo lỗi (Bug Reports)

Nếu bạn phát hiện bug, vui lòng tạo issue với thông tin:

1. **Mô tả bug**: Mô tả chi tiết vấn đề
2. **Các bước tái hiện**: Làm thế nào để bug xảy ra
3. **Kết quả mong đợi**: Bạn mong đợi điều gì xảy ra
4. **Kết quả thực tế**: Điều gì thực sự xảy ra
5. **Screenshots**: Nếu có
6. **Môi trường**: Browser, OS, device,...

### Đề xuất tính năng (Feature Requests)

Tạo issue với nhãn "enhancement" và mô tả:

1. **Tính năng mong muốn**: Bạn muốn thêm gì
2. **Lý do**: Tại sao tính năng này hữu ích
3. **Gợi ý implementation**: Nếu có ý tưởng cụ thể

### Pull Requests

1. **Fork** repository
2. **Clone** fork về máy: `git clone https://github.com/your-username/nuoi-buituantu.git`
3. **Create branch**: `git checkout -b feature/amazing-feature`
4. **Make changes**: Code và test
5. **Commit**: `git commit -m "Add amazing feature"`
6. **Push**: `git push origin feature/amazing-feature`
7. **Create Pull Request** trên GitHub

## 📝 Coding Standards

### TypeScript

- Luôn define types cho props, functions
- Không dùng `any`, dùng `unknown` nếu cần
- Prefer interface over type
- Use descriptive variable names

### React/Next.js

- Use functional components
- Use hooks thay vì class components
- Proper use of `useEffect`, `useState`, `useMemo`
- Extract reusable logic into custom hooks

### Styling

- Use Tailwind CSS classes
- Follow mobile-first approach
- Maintain consistent spacing
- Use CSS variables from theme

### Code Organization

```
src/
├── app/           # Next.js app directory
├── components/    # React components
│   ├── ui/       # Base UI components
│   └── ...       # Feature components
├── lib/          # Utilities, helpers
└── types/        # TypeScript types
```

## 🧪 Testing

Trước khi submit PR:

1. **Test locally**: Run `npm run dev` và test trên browser
2. **Check types**: Run `npm run build` để check TypeScript errors
3. **Lint**: Run `npm run lint` để check ESLint
4. **Manual testing**:
   - Test trên mobile (iOS/Android)
   - Test deep linking
   - Test QR code download
   - Test webhook (nếu thay đổi backend)

## 📋 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add bank selector search`
- `fix: resolve deep linking on iOS`
- `docs: update setup guide`
- `style: format code`
- `refactor: simplify QR generation`
- `test: add donation list tests`
- `chore: update dependencies`

## 🔍 Code Review Process

1. PR sẽ được review trong vòng 24-48h
2. Reviewer có thể request changes
3. Sau khi approve, PR sẽ được merge
4. Changes sẽ được deploy lên staging trước production

## 🎨 Design Guidelines

- **Colors**: Sử dụng primary color (green) cho CTAs
- **Typography**: Inter font family
- **Spacing**: Follow 4px grid system
- **Icons**: Use lucide-react icons
- **Responsive**: Mobile-first, test trên nhiều screen sizes

## 🐛 Debug Tips

### Firebase issues

```bash
# Check credentials
console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
```

### Webhook issues

```bash
# Test webhook locally with ngrok
ngrok http 3000

# Test webhook endpoint
curl -X POST http://localhost:3000/api/webhook/sepay \
  -H "Authorization: Bearer test" \
  -H "Content-Type: application/json" \
  -d '{"id":"1","gateway":"MB","transactionDate":"2024-01-01","accountNumber":"123","code":null,"content":"Test","transferType":"in","transferAmount":10000,"accumulated":10000,"referenceCode":"REF","description":"Test"}'
```

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 💬 Questions?

- Open an issue
- Email: contact@buituantu.com
- Twitter: @buituantu

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🙏

