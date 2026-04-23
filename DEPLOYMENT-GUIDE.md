# 🚀 EcoFusion Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Production Build](#production-build)
4. [Deployment Options](#deployment-options)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **Git**: Latest version

### Check Versions
```bash
node --version  # Should be v18+
npm --version   # Should be v9+
git --version
```

---

## Local Development

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/token-treehouse.git
cd token-treehouse
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:8081/**

### 4. Run Tests (Optional)
```bash
npm run test
npm run lint
```

---

## Production Build

### 1. Clean Previous Builds
```bash
rm -rf dist/
```

### 2. Build for Production
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 3. Preview Production Build Locally
```bash
npm run preview
```

Access at: **http://localhost:4173/**

### 4. Verify Build
Check that:
- ✅ All pages load correctly
- ✅ No console errors
- ✅ Assets load properly
- ✅ Routing works
- ✅ Forms submit correctly

---

## Deployment Options

### Option 1: GitHub Pages

#### Setup
1. Install gh-pages:
```bash
npm install -g gh-pages
```

2. Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

4. Configure GitHub Pages:
   - Go to repository Settings → Pages
   - Source: gh-pages branch
   - Save

Your site will be live at: `https://yourusername.github.io/token-treehouse/`

---

### Option 2: Vercel

#### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Method 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click "Deploy"

#### Environment Variables (Vercel)
Add in Project Settings → Environment Variables:
```
VITE_API_URL=https://api.ecofusion.com
VITE_APP_ENV=production
```

---

### Option 3: Netlify

#### Method 1: Netlify CLI
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

#### Method 2: Netlify Dashboard
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click "Deploy site"

#### Netlify Configuration
Create `netlify.toml` in root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

### Option 4: AWS S3 + CloudFront

#### 1. Build the Project
```bash
npm run build
```

#### 2. Create S3 Bucket
```bash
aws s3 mb s3://ecofusion-app
```

#### 3. Upload Files
```bash
aws s3 sync dist/ s3://ecofusion-app --delete
```

#### 4. Configure S3 for Static Hosting
```bash
aws s3 website s3://ecofusion-app \
  --index-document index.html \
  --error-document index.html
```

#### 5. Set Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ecofusion-app/*"
    }
  ]
}
```

#### 6. Create CloudFront Distribution
- Origin: S3 bucket
- Default Root Object: index.html
- Error Pages: 404 → /index.html (200)

---

### Option 5: Docker

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Build and Run
```bash
# Build image
docker build -t ecofusion-app .

# Run container
docker run -p 80:80 ecofusion-app
```

#### Docker Compose
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
```

---

## Post-Deployment

### 1. Verify Deployment
- [ ] Homepage loads
- [ ] All routes accessible
- [ ] Login/Register works
- [ ] Dashboard displays correctly
- [ ] Forms submit properly
- [ ] Images load
- [ ] No console errors

### 2. Performance Check
```bash
# Run Lighthouse audit
npx lighthouse https://your-domain.com --view
```

Target scores:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### 3. Setup Monitoring

#### Google Analytics
Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Sentry (Error Tracking)
```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

### 4. Setup Custom Domain

#### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

#### Netlify
1. Go to Site Settings → Domain management
2. Add custom domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### 5. Enable HTTPS
Most platforms (Vercel, Netlify) provide automatic HTTPS via Let's Encrypt.

For custom setups:
```bash
# Using Certbot
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Troubleshooting

### Issue: White Screen After Deployment

**Cause**: Incorrect base path configuration

**Solution**:
1. Check `vite.config.ts`:
```typescript
base: mode === 'production' ? '/token-treehouse/' : '/',
```

2. Check `App.tsx`:
```typescript
<BrowserRouter basename={import.meta.env.PROD ? '/token-treehouse' : '/'}>
```

---

### Issue: 404 on Page Refresh

**Cause**: Server not configured for SPA routing

**Solution**:

**Netlify**: Add `_redirects` file in `public/`:
```
/*    /index.html   200
```

**Vercel**: Add `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Nginx**:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

### Issue: Assets Not Loading

**Cause**: Incorrect asset paths

**Solution**:
1. Use relative paths in code
2. Verify `base` in `vite.config.ts`
3. Check browser console for 404 errors
4. Ensure assets are in `public/` or imported in code

---

### Issue: Environment Variables Not Working

**Cause**: Variables not prefixed with `VITE_`

**Solution**:
1. Prefix all env vars with `VITE_`:
```env
VITE_API_URL=https://api.example.com
```

2. Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

3. Rebuild after changing env vars

---

### Issue: Large Bundle Size

**Solution**:
1. Analyze bundle:
```bash
npm run build -- --mode analyze
```

2. Implement code splitting:
```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

3. Optimize images:
```bash
npm install -D vite-plugin-imagemin
```

---

### Issue: Slow Initial Load

**Solution**:
1. Enable compression (Gzip/Brotli)
2. Implement lazy loading
3. Use CDN for assets
4. Optimize images (WebP format)
5. Preload critical resources

---

## 🔐 Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API keys not exposed in client code
- [ ] CORS configured properly
- [ ] Content Security Policy (CSP) headers
- [ ] XSS protection enabled
- [ ] Dependencies updated (no vulnerabilities)

---

## 📊 Performance Optimization

### 1. Enable Compression
Most platforms enable this by default. For custom servers:

**Nginx**:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 2. Cache Static Assets
```nginx
location /assets {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Use CDN
- Cloudflare
- AWS CloudFront
- Fastly

---

## 📞 Support

If you encounter issues:
1. Check this guide
2. Review [PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md)
3. Check platform-specific documentation
4. Contact: devops@ecofusion.com

---

**Last Updated**: April 22, 2024  
**Version**: 1.0.0
