# ⚡ EcoFusion - Quick Start Guide

Get up and running in 5 minutes!

## 🚀 Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/token-treehouse.git
cd token-treehouse

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

**That's it!** Open http://localhost:8081/ in your browser.

---

## 🎮 First Time Setup

### 1. Login
- Click "Continue as Guest" for instant access
- Or register with email/password

### 2. Explore Dashboard
- View your token balance
- Check sustainability metrics
- See recent activity

### 3. Submit Waste
- Click "Sell Waste"
- Select waste type
- Enter weight
- Upload photo (optional)
- Submit to earn tokens!

### 4. Redeem Rewards
- Click "Redeem" or visit Marketplace
- Browse available rewards
- Redeem tokens for vouchers

---

## 📁 Project Structure

```
token-treehouse/
├── src/
│   ├── pages/          # Main pages (Dashboard, Marketplace, etc.)
│   ├── components/     # Reusable components
│   ├── lib/            # Utilities and context
│   └── hooks/          # Custom React hooks
├── public/             # Static assets
└── dist/               # Production build (after npm run build)
```

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests
npm run lint             # Check code quality

# Deployment
npm run deploy           # Deploy to GitHub Pages
```

---

## 🎨 Key Features

### 💰 Token System
- Earn 10 TCC per kg of waste
- 1 TCC = ₹1 INR
- Real-time balance updates

### ♻️ Waste Types Supported
- Plastic (PET, HDPE, etc.)
- Paper & Cardboard
- Metal (Aluminum, Steel)
- E-waste
- Glass

### 🎁 Rewards
- Amazon vouchers
- Zepto vouchers
- Plant-a-tree initiatives
- And more!

### 🏆 Gamification
- Daily challenges
- Achievement badges
- Leaderboards
- Level progression

---

## 🔧 Configuration

### Environment Variables (Optional)
Create `.env` file:
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_ENV=development
```

### Customize Base Path
Edit `vite.config.ts`:
```typescript
base: mode === 'production' ? '/your-path/' : '/',
```

---

## 📱 Pages Overview

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Main hub with stats |
| `/sell` | Sell Waste | Submit waste for tokens |
| `/pickup` | Request Pickup | Schedule collection |
| `/marketplace` | Marketplace | Browse rewards |
| `/history` | History | View submissions |
| `/wallet` | Wallet | Manage tokens |
| `/leaderboard` | Leaderboard | Rankings |
| `/profile` | Profile | User settings |
| `/arcade` | Arcade | Mini-games |

---

## 🎯 Quick Tips

### For Developers
- Use TypeScript for type safety
- Follow existing component patterns
- Run `npm run lint` before committing
- Test on mobile devices

### For Users
- Submit waste regularly for streaks
- Complete daily challenges
- Check leaderboard for competition
- Redeem tokens before expiry

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Vite will auto-increment to 8081, 8082, etc.
# Or manually specify:
npm run dev -- --port 3000
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Hot Reload Not Working
```bash
# Restart dev server
# Press Ctrl+C, then npm run dev
```

---

## 📚 Learn More

- **Full Documentation**: See [README.md](./README.md)
- **API Reference**: See [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)
- **Deployment**: See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
- **Checklist**: See [PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md)

---

## 🤝 Need Help?

- **Issues**: GitHub Issues
- **Email**: support@ecofusion.com
- **Discord**: Join our community
- **Docs**: Check documentation files

---

## ✅ Next Steps

1. ✅ Install and run locally
2. ✅ Explore the dashboard
3. ✅ Submit your first waste
4. ✅ Earn tokens
5. ✅ Redeem rewards
6. 🚀 Deploy to production!

---

**Happy Recycling! 🌿♻️**

Built with ❤️ for a sustainable future 🌍
