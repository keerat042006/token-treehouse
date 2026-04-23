# 🚀 Netlify Deployment Guide - EcoFusion

Complete step-by-step guide to deploy your EcoFusion app on Netlify.

---

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ GitHub account
- ✅ Netlify account (free - sign up at [netlify.com](https://netlify.com))
- ✅ Your code pushed to GitHub
- ✅ Project builds successfully locally

---

## 🎯 Method 1: Deploy via Netlify Dashboard (Recommended)

### Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/token-treehouse.git

# Push to GitHub
git push -u origin main
```

### Step 2: Connect to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub
5. Select your **token-treehouse** repository

### Step 3: Configure Build Settings

On the deploy settings page, enter:

**Build Settings:**
```
Build command: npm run build
Publish directory: dist
```

**Advanced Settings (Click "Show advanced"):**

Add Environment Variables:
```
VITE_GEMINI_API_KEY = AIzaSyA0qM0cHUsEJbEbmQrCpPbSE6bR-L96caM
```

### Step 4: Deploy

1. Click **"Deploy site"**
2. Wait 2-3 minutes for build to complete
3. Your site will be live at: `https://random-name-123.netlify.app`

### Step 5: Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `ecofusion.com`)
4. Follow DNS configuration instructions

---

## 🎯 Method 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

This will open a browser window to authorize.

### Step 3: Initialize Netlify

```bash
# In your project directory
netlify init
```

Follow the prompts:
- **Create & configure a new site**
- Choose your team
- Enter site name (or leave blank for random)
- Build command: `npm run build`
- Publish directory: `dist`

### Step 4: Deploy

```bash
# Deploy to production
netlify deploy --prod
```

Your site is now live! 🎉

---

## 📝 Configuration Files

### Create `netlify.toml` (Recommended)

Create this file in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Update `vite.config.ts`

Make sure your config looks like this:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  base: '/', // Change this for Netlify
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

---

## 🔧 Environment Variables

### Add via Netlify Dashboard

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: `AIzaSyA0qM0cHUsEJbEbmQrCpPbSE6bR-L96caM`
4. Click **"Save"**

### Add via CLI

```bash
netlify env:set VITE_GEMINI_API_KEY "AIzaSyA0qM0cHUsEJbEbmQrCpPbSE6bR-L96caM"
```

---

## 🎨 Custom Domain Setup

### Step 1: Add Domain in Netlify

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain: `ecofusion.com`
4. Click **"Verify"**

### Step 2: Configure DNS

**Option A: Use Netlify DNS (Recommended)**

1. Click **"Set up Netlify DNS"**
2. Copy the nameservers (e.g., `dns1.p01.nsone.net`)
3. Go to your domain registrar (GoDaddy, Namecheap, etc.)
4. Update nameservers to Netlify's nameservers
5. Wait 24-48 hours for propagation

**Option B: Use External DNS**

Add these records to your DNS provider:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

### Step 3: Enable HTTPS

1. Netlify automatically provisions SSL certificate
2. Wait 5-10 minutes
3. Your site will be available at `https://ecofusion.com`

---

## 🔄 Continuous Deployment

### Automatic Deploys

Once connected to GitHub, Netlify automatically deploys when you push:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Netlify automatically builds and deploys!
```

### Deploy Previews

- Every pull request gets a preview URL
- Test changes before merging
- Share with team for review

### Branch Deploys

Deploy specific branches:

1. Go to **Site settings** → **Build & deploy**
2. Click **"Edit settings"** under Branch deploys
3. Select branches to deploy

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Command failed with exit code 1"**

**Solution:**
```bash
# Test build locally first
npm run build

# Check for errors
# Fix any TypeScript or build errors
# Push fixed code
```

**Error: "Module not found"**

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 on Page Refresh

**Problem:** Getting 404 when refreshing on routes like `/marketplace`

**Solution:** Add `netlify.toml` with redirects (see Configuration Files above)

### Environment Variables Not Working

**Problem:** API calls failing in production

**Solution:**
1. Check variable names start with `VITE_`
2. Verify variables are set in Netlify dashboard
3. Trigger a new deploy after adding variables

### Slow Build Times

**Solution:**
1. Enable build cache in Netlify settings
2. Optimize dependencies
3. Use build plugins for caching

---

## 📊 Performance Optimization

### Enable Build Plugins

1. Go to **Site settings** → **Build & deploy** → **Build plugins**
2. Add these plugins:
   - **Lighthouse** - Performance monitoring
   - **Next.js Cache** - Faster builds
   - **Checklinks** - Find broken links

### Configure Headers

Already included in `netlify.toml` above:
- Cache static assets for 1 year
- Security headers
- CORS headers

### Enable Asset Optimization

1. Go to **Site settings** → **Build & deploy** → **Post processing**
2. Enable:
   - ✅ Bundle CSS
   - ✅ Minify CSS
   - ✅ Minify JS
   - ✅ Compress images

---

## 🔒 Security Best Practices

### 1. Protect API Keys

**Never commit API keys to GitHub!**

```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### 2. Use Environment Variables

Store sensitive data in Netlify environment variables, not in code.

### 3. Enable HTTPS

Netlify provides free SSL certificates automatically.

### 4. Add Security Headers

Already included in `netlify.toml` configuration.

---

## 📈 Monitoring & Analytics

### Netlify Analytics

1. Go to **Site settings** → **Analytics**
2. Enable **Netlify Analytics** ($9/month)
3. View:
   - Page views
   - Unique visitors
   - Top pages
   - Traffic sources

### Google Analytics

Add to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🎯 Deployment Checklist

Before deploying, verify:

- [ ] Code builds successfully locally (`npm run build`)
- [ ] All tests pass (`npm run test`)
- [ ] No console errors in browser
- [ ] Environment variables configured
- [ ] `netlify.toml` file created
- [ ] `.gitignore` includes `.env` files
- [ ] All routes work correctly
- [ ] Images and assets load
- [ ] Mobile responsive
- [ ] API integrations work

---

## 🚀 Quick Deploy Commands

```bash
# Build locally
npm run build

# Test production build
npm run preview

# Deploy to Netlify (via CLI)
netlify deploy --prod

# Check deploy status
netlify status

# Open site in browser
netlify open:site

# View logs
netlify logs
```

---

## 📞 Support & Resources

### Netlify Resources
- **Documentation**: [docs.netlify.com](https://docs.netlify.com)
- **Community**: [community.netlify.com](https://community.netlify.com)
- **Status**: [netlifystatus.com](https://netlifystatus.com)
- **Support**: [support.netlify.com](https://support.netlify.com)

### Helpful Links
- [Netlify CLI Docs](https://cli.netlify.com)
- [Build Configuration](https://docs.netlify.com/configure-builds/overview/)
- [Custom Domains](https://docs.netlify.com/domains-https/custom-domains/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)

---

## 🎉 Success!

Your EcoFusion app is now live on Netlify! 🚀

**Your site URL:**
```
https://your-site-name.netlify.app
```

**Next Steps:**
1. ✅ Test all features on live site
2. ✅ Set up custom domain
3. ✅ Enable analytics
4. ✅ Share with users!

---

## 💡 Pro Tips

### 1. Deploy Previews
Every pull request gets a unique URL for testing.

### 2. Rollback Deploys
Can instantly rollback to any previous deploy in dashboard.

### 3. Split Testing
Test different versions with A/B testing (paid feature).

### 4. Forms
Netlify can handle form submissions without backend.

### 5. Functions
Add serverless functions for backend logic.

---

**Need help?** Check the troubleshooting section or contact Netlify support!

**Happy Deploying! 🎉**
