import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ChevronDown, Mail, Phone, MessageCircle, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SupportDrawerProps {
  open: boolean;
  onClose: () => void;
  userName?: string;
}

interface ChatMsg {
  id: string;
  role: 'bot' | 'user';
  text: string;
  time: string;
}

const FAQS = [
  { q: 'How do I earn TCC?', a: 'Drop recyclable waste at any partner café or schedule a doorstep pickup. You earn TCC at live market rates per kg, instantly credited to your wallet.' },
  { q: 'When will my pickup arrive?', a: 'Pickups are confirmed within 1 hour and our agent typically arrives within your selected time slot (24h max). Track live status from the Pickup page.' },
  { q: 'How do I redeem tokens?', a: 'Visit the Marketplace tab. Browse vouchers, café items, entertainment, or donations. Tap Redeem and your TCC is deducted instantly.' },
  { q: 'What waste types are accepted?', a: 'Plastic, Paper, Metal, E-Waste, Glass, and Organic. Each has its own market rate displayed on the Sell Waste page.' },
];

const now = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

export const SupportDrawer = ({ open, onClose, userName = 'Arjun' }: SupportDrawerProps) => {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { id: '1', role: 'bot', text: `👋 Hi ${userName}! How can I help you today?`, time: now() },
    { id: '2', role: 'bot', text: 'Ask me about pickups, TCC tokens, recycling rates, or anything else.', time: now() },
  ]);
  const [input, setInput] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: ChatMsg = { id: String(Date.now()), role: 'user', text: input, time: now() };
    setMsgs((m) => [...m, userMsg]);
    setInput('');
    setTimeout(() => {
      const ref = Math.floor(1000 + Math.random() * 9000);
      const botMsg: ChatMsg = {
        id: String(Date.now() + 1),
        role: 'bot',
        text: `Thanks for your message! A support agent will follow up within 2 hours. Reference: #ECO-${ref}`,
        time: now(),
      };
      setMsgs((m) => [...m, botMsg]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 199 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 bottom-0 w-[380px] max-w-full glass-deep flex flex-col"
            style={{ zIndex: 200, borderLeft: '1px solid rgba(0,229,160,0.2)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <p className="text-xs text-eco-green font-semibold">SUPPORT</p>
                <h3 className="text-lg font-extrabold text-white">EcoFusion Support</h3>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat */}
            <div className="p-4 border-b border-white/10">
              <div ref={scrollRef} className="h-60 overflow-y-auto space-y-3 pr-1">
                {msgs.map((m) => (
                  <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div
                      className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{
                        background: m.role === 'bot'
                          ? 'linear-gradient(135deg, #00e5a0, #047857)'
                          : 'linear-gradient(135deg, hsl(var(--eco-blue)), hsl(220 80% 50%))',
                        color: '#fff',
                      }}
                    >
                      {m.role === 'bot' ? <Bot className="w-4 h-4" /> : userName.charAt(0)}
                    </div>
                    <div
                      className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm ${
                        m.role === 'bot'
                          ? 'bg-white/5 text-white rounded-bl-sm'
                          : 'bg-eco-blue text-white rounded-br-sm'
                      }`}
                    >
                      <p>{m.text}</p>
                      <p className="text-[10px] opacity-60 mt-1">{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Type a message…"
                  className="bg-white/5 border-white/10 text-white text-sm"
                />
                <Button onClick={send} className="btn-eco h-10 px-3">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* FAQs */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <p className="text-xs font-bold text-muted-foreground-2 uppercase tracking-wider mb-1">FAQ</p>
              {FAQS.map((f, i) => (
                <div key={i} className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left"
                  >
                    <span className="text-sm font-semibold text-white">{f.q}</span>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}>
                      <ChevronDown className="w-4 h-4 text-eco-green" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-3 pb-3 text-xs text-muted-foreground-2 leading-relaxed">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Contacts */}
            <div className="p-4 border-t border-white/10 grid grid-cols-3 gap-2">
              <a href="mailto:support@ecofusion.app" className="flex flex-col items-center gap-1 p-2 rounded-xl bg-eco-blue/15 border border-eco-blue/30 hover:bg-eco-blue/25 transition text-eco-blue text-[11px] font-semibold">
                <Mail className="w-4 h-4" /> Email
              </a>
              <a href="tel:1800326327" className="flex flex-col items-center gap-1 p-2 rounded-xl bg-eco-amber/15 border border-eco-amber/30 hover:bg-eco-amber/25 transition text-eco-amber text-[11px] font-semibold">
                <Phone className="w-4 h-4" /> Call
              </a>
              <a href="https://wa.me/911800326327" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 p-2 rounded-xl bg-eco-green/15 border border-eco-green/30 hover:bg-eco-green/25 transition text-eco-green text-[11px] font-semibold">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
