# 🚢 Hướng dẫn Deployment

## Checklist trước khi Deploy

- [ ] Đã setup Firebase project
- [ ] Đã cấu hình Firestore rules
- [ ] Đã tạo Service Account
- [ ] Đã đăng ký SePay và kết nối ngân hàng
- [ ] Đã test webhook trên local
- [ ] Đã chuẩn bị tất cả environment variables

## Deploy lên Vercel (Recommended)

### Bước 1: Prepare Repository

```bash
# Commit all changes
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Bước 2: Import vào Vercel

1. Đăng nhập [Vercel](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import từ GitHub repository
4. Chọn repository `nuoi-buituantu`

### Bước 3: Configure Environment Variables

Copy các biến sau vào Vercel:

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# SePay
SEPAY_WEBHOOK_SECRET=

# Bank Info
NEXT_PUBLIC_BANK_ACCOUNT_NO=
NEXT_PUBLIC_BANK_ACCOUNT_NAME=
NEXT_PUBLIC_BANK_BIN=
NEXT_PUBLIC_BANK_NAME=
```

### Bước 4: Deploy

Click "Deploy" và đợi build hoàn tất (~2-3 phút)

### Bước 5: Custom Domain

1. Vào "Settings" → "Domains"
2. Add domain: `nuoi.buituantu.com`
3. Configure DNS:

**Option A: CNAME (Recommended)**
```
Type: CNAME
Name: nuoi
Value: cname.vercel-dns.com
```

**Option B: A Record**
```
Type: A
Name: nuoi
Value: 76.76.21.21
```

4. Đợi DNS propagate (5-30 phút)

### Bước 6: Update Webhook URL

1. Đăng nhập SePay
2. Vào "Settings" → "Webhook"
3. Update URL: `https://nuoi.buituantu.com/api/webhook/sepay`
4. Save

### Bước 7: Verify Deployment

```bash
# Test API endpoint
curl https://nuoi.buituantu.com/api/donations

# Test webhook
curl -X POST https://nuoi.buituantu.com/api/webhook/sepay \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"id":"test","gateway":"MBBank","transactionDate":"2024-01-01 10:00:00","accountNumber":"123","code":null,"content":"Test","transferType":"in","transferAmount":10000,"accumulated":10000,"referenceCode":"REF","description":"Test"}'
```

## Deploy lên Railway (Alternative)

### Bước 1: Install Railway CLI

```bash
npm i -g @railway/cli
railway login
```

### Bước 2: Initialize Project

```bash
railway init
```

### Bước 3: Add Environment Variables

```bash
railway variables set NEXT_PUBLIC_FIREBASE_API_KEY="your_key"
railway variables set FIREBASE_ADMIN_PROJECT_ID="your_project_id"
# ... (add all variables)
```

### Bước 4: Deploy

```bash
railway up
```

### Bước 5: Custom Domain

```bash
railway domain
```

## Deploy lên Netlify

### Bước 1: Install Netlify CLI

```bash
npm install -g netlify-cli
netlify login
```

### Bước 2: Build Config

Tạo file `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

### Bước 3: Deploy

```bash
netlify deploy --prod
```

## Deploy lên VPS/Server riêng

### Requirements

- Ubuntu 22.04 LTS
- Node.js 18+
- Nginx
- PM2

### Bước 1: Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Bước 2: Clone & Build

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/yourusername/nuoi-buituantu.git
cd nuoi-buituantu

# Install dependencies
npm install

# Create .env.local
sudo nano .env.local
# (paste environment variables)

# Build
npm run build
```

### Bước 3: Setup PM2

```bash
# Start app with PM2
pm2 start npm --name "nuoi-buituantu" -- start

# Save PM2 config
pm2 save

# Setup startup script
pm2 startup
```

### Bước 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/nuoi.buituantu.com
```

Paste config:

```nginx
server {
    listen 80;
    server_name nuoi.buituantu.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/nuoi.buituantu.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Bước 5: Setup SSL (Certbot)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d nuoi.buituantu.com
```

## Monitoring & Maintenance

### Vercel

- Xem logs: `vercel logs`
- Monitor: Vercel Dashboard → Analytics

### PM2 (VPS)

```bash
# View logs
pm2 logs nuoi-buituantu

# Monitor
pm2 monit

# Restart
pm2 restart nuoi-buituantu
```

### Firebase

- Monitor Firestore usage: Firebase Console → Usage
- Check quotas: Firestore → Usage

## Backup Strategy

### Database

Firebase Firestore có auto backup, nhưng nên:

1. Export định kỳ:

```bash
gcloud firestore export gs://your-bucket/backups/$(date +%Y%m%d)
```

2. Setup scheduled exports trong Firebase Console

### Environment Variables

Lưu `.env.local` vào nơi an toàn (1Password, LastPass, etc.)

## Rollback Plan

### Vercel

```bash
# Xem deployments
vercel ls

# Rollback về deployment trước
vercel rollback [deployment-url]
```

### Manual

```bash
git revert HEAD
git push origin main
```

## Troubleshooting

### Build failed

- Check Node version: `node -v` (phải >= 18)
- Clear cache: `rm -rf .next node_modules && npm install`

### Webhook timeout

- Tăng timeout trong Vercel: Settings → Functions → Timeout

### Firebase errors

- Verify service account permissions
- Check Firestore rules
- Monitor quota limits

## Cost Estimation

### Free Tier (0-1000 visitors/month)

- **Vercel**: Free
- **Firebase**: Free (50K reads/day)
- **SePay**: Free
- **Total**: $0/month

### Small Scale (1000-10000 visitors/month)

- **Vercel Pro**: $20/month
- **Firebase Blaze**: ~$1-5/month
- **SePay**: Free
- **Total**: ~$25/month

### Medium Scale (10000+ visitors/month)

- **Vercel Pro**: $20/month
- **Firebase Blaze**: ~$10-50/month
- **SePay**: Contact for pricing
- **Total**: ~$50-100/month

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables không commit lên Git
- [ ] Firestore rules configured properly
- [ ] Webhook secret là random string mạnh
- [ ] Firebase Admin SDK chỉ chạy server-side
- [ ] Rate limiting cho API endpoints (nếu cần)

---

Happy deploying! 🚀


