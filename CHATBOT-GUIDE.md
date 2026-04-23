# 🤖 AI Chatbot Integration Guide

## ✨ Features

Your EcoFusion platform now has an **AI-powered chatbot** integrated with **Google Gemini AI**!

### 🎯 Chatbot Capabilities

- **Recycling Tips** - Get advice on how to recycle different materials
- **Token Information** - Learn about TrashCash tokens and rewards
- **Platform Help** - Get answers about how to use EcoFusion
- **Sustainability Advice** - Eco-friendly tips and best practices
- **General Questions** - Ask anything about recycling and the environment

### 🎨 Design Features

- **3D Floating Button** - Professional animated chat button
- **Smooth Animations** - Framer Motion powered transitions
- **Glass Morphism** - Modern frosted glass design
- **Real-time Chat** - Instant AI responses
- **Message History** - Conversation tracking
- **Typing Indicators** - Loading states
- **Mobile Responsive** - Works on all devices

## 🚀 How It Works

### User Experience

1. **Click the floating chat button** (bottom-right corner)
2. **Type your question** in the input field
3. **Press Enter or click Send**
4. **Get instant AI response** from Gemini

### Technical Implementation

```typescript
// API Configuration
const GEMINI_API_KEY = 'AIzaSyA0qM0cHUsEJbEbmQrCpPbSE6bR-L96caM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Message Structure
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

## 📍 Location

The chatbot appears as a **floating button** in the bottom-right corner of every page.

### Visual Elements

- **Blue gradient button** with message icon
- **Green pulse indicator** showing it's active
- **3D hover effect** on interaction
- **Smooth open/close animations**

## 💬 Example Questions

Try asking:

- "How do I recycle plastic bottles?"
- "What are TrashCash tokens?"
- "How can I earn more tokens?"
- "What types of waste can I submit?"
- "Tell me about the rewards marketplace"
- "How do I schedule a pickup?"
- "What's the environmental impact of recycling?"

## 🎨 Customization

### Change Button Position

Edit `src/components/AIChatbot.tsx`:

```tsx
// Current: bottom-6 right-6
// Change to: bottom-6 left-6 (for left side)
className="fixed bottom-6 right-6 z-50"
```

### Change Colors

```tsx
// Button gradient
style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}

// Change to purple:
style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
```

### Change Chat Window Size

```tsx
// Current: w-[380px] h-[600px]
className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px]"

// Make larger:
className="fixed bottom-6 right-6 z-50 w-[450px] h-[700px]"
```

## 🔒 Security

### API Key Management

**Current Setup:**
- API key is in the component (for demo)

**Production Recommendation:**
- Move API key to environment variables
- Use backend proxy for API calls
- Implement rate limiting

### Environment Variable Setup

1. Create `.env` file:
```env
VITE_GEMINI_API_KEY=AIzaSyA0qM0cHUsEJbEbmQrCpPbSE6bR-L96caM
```

2. Update component:
```typescript
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

3. Add to `.gitignore`:
```
.env
.env.local
```

## 🎯 Features Breakdown

### 1. Floating Button
- Always visible
- Smooth animations
- 3D effects
- Pulse indicator

### 2. Chat Window
- Glass morphism design
- Smooth open/close
- Message history
- Scroll to bottom
- Typing indicators

### 3. Message Display
- User messages (right, blue)
- AI messages (left, glass)
- Timestamps
- Smooth animations

### 4. Input Area
- Text input field
- Send button
- Enter key support
- Loading states
- Character limit

## 📊 Performance

- **Fast Responses** - Gemini Pro API
- **Smooth Animations** - 60fps
- **Optimized Rendering** - React best practices
- **Lazy Loading** - Component on demand

## 🐛 Troubleshooting

### Chatbot Not Appearing
- Check if `<AIChatbot />` is in `App.tsx`
- Verify z-index is set correctly
- Check browser console for errors

### API Errors
- Verify API key is correct
- Check network connection
- Ensure API quota is available
- Check CORS settings

### Styling Issues
- Verify Tailwind classes are loaded
- Check 3D CSS classes exist
- Inspect element in browser

## 🚀 Future Enhancements

### Planned Features
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Conversation history save
- [ ] Quick reply buttons
- [ ] File upload support
- [ ] Emoji reactions
- [ ] Dark/Light theme toggle
- [ ] Export chat history

### Advanced Features
- [ ] Context-aware responses
- [ ] User preference learning
- [ ] Integration with user data
- [ ] Personalized recommendations
- [ ] Analytics dashboard

## 📝 Code Structure

```
src/
├── components/
│   └── AIChatbot.tsx       # Main chatbot component
├── App.tsx                 # Chatbot integration
└── index.css              # 3D styles
```

## 🎨 Styling Classes Used

- `.btn-3d` - 3D button effect
- `.card-3d` - 3D card container
- `.glass-3d` - Glass morphism
- `.icon-3d` - 3D icon container
- `.input-3d` - 3D input field
- `.pulse-3d` - Pulsing animation
- `.glow-3d-blue` - Blue glow effect

## 📱 Mobile Optimization

- Responsive width (380px on desktop)
- Touch-friendly buttons
- Smooth scrolling
- Optimized for small screens

## ✅ Testing Checklist

- [ ] Chatbot button appears
- [ ] Click opens chat window
- [ ] Can send messages
- [ ] AI responds correctly
- [ ] Animations are smooth
- [ ] Mobile responsive
- [ ] Close button works
- [ ] Scroll works properly
- [ ] Loading states show
- [ ] Error handling works

## 🎉 Success!

Your EcoFusion platform now has a **professional AI chatbot** powered by Google Gemini!

**Access your site:**
```
http://localhost:8081/
```

**Look for the blue chat button in the bottom-right corner!** 💬✨

---

**Built with:**
- Google Gemini AI
- React + TypeScript
- Framer Motion
- Tailwind CSS
- 3D Effects
