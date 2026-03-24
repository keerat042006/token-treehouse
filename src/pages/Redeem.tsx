import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { PageWrapper } from '@/components/PageWrapper';
import { TokenBadge } from '@/components/TokenBadge';
import { Button } from '@/components/ui/button';
import { Coffee, Gamepad2, Heart, Wifi, Zap, Film, Check, Store } from 'lucide-react';
import { toast } from 'sonner';

interface RedeemItem {
  id: string;
  name: string;
  cost: number;
  icon: React.ElementType;
  category: string;
  description: string;
  color: string;
}

const items: RedeemItem[] = [
  { id: '1', name: 'Cappuccino', cost: 45, icon: Coffee, category: 'cafe', description: 'At TrashCash Base Café', color: 'bg-amber-50 text-amber-700' },
  { id: '2', name: 'Veg Sandwich', cost: 60, icon: Coffee, category: 'cafe', description: 'At TrashCash Base Café', color: 'bg-amber-50 text-amber-700' },
  { id: '3', name: 'Green Bean Latte', cost: 55, icon: Store, category: 'partner', description: 'Partner: Green Bean Café', color: 'bg-emerald-50 text-emerald-700' },
  { id: '4', name: 'EcoBites Salad Bowl', cost: 70, icon: Store, category: 'partner', description: 'Partner: EcoBites Kitchen', color: 'bg-emerald-50 text-emerald-700' },
  { id: '5', name: 'Arcade Games (1hr)', cost: 30, icon: Gamepad2, category: 'entertainment', description: 'Fun Zone access', color: 'bg-purple-50 text-purple-700' },
  { id: '6', name: 'Movie Streaming', cost: 50, icon: Film, category: 'entertainment', description: '24-hour access pass', color: 'bg-purple-50 text-purple-700' },
  { id: '7', name: 'WiFi Pass (1 day)', cost: 15, icon: Wifi, category: 'entertainment', description: 'High-speed WiFi', color: 'bg-blue-50 text-blue-700' },
  { id: '8', name: 'Phone Charging', cost: 5, icon: Zap, category: 'entertainment', description: 'Fast charging station', color: 'bg-blue-50 text-blue-700' },
  { id: '9', name: 'Plant a Tree 🌳', cost: 25, icon: Heart, category: 'donation', description: 'TreeNation Foundation', color: 'bg-rose-50 text-rose-700' },
  { id: '10', name: 'Clean Ocean Fund', cost: 20, icon: Heart, category: 'donation', description: 'Ocean cleanup initiative', color: 'bg-rose-50 text-rose-700' },
];

const categories = [
  { key: 'all', label: 'All' },
  { key: 'cafe', label: '☕ Café' },
  { key: 'partner', label: '🤝 Partners' },
  { key: 'entertainment', label: '🎮 Fun Zone' },
  { key: 'donation', label: '❤️ Donate' },
];

const Redeem = () => {
  const user = useUser();
  const [filter, setFilter] = useState('all');
  const [redeemed, setRedeemed] = useState<string | null>(null);

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

  const handleRedeem = (item: RedeemItem) => {
    const success = user.spendTokens(item.cost, item.name, item.category);
    if (success) {
      setRedeemed(item.id);
      setTimeout(() => setRedeemed(null), 2000);
    } else {
      toast.error('Not enough tokens!');
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Spend Tokens</h1>
          <p className="text-sm text-muted-foreground">Redeem at cafés, fun zone & more</p>
        </div>
        <TokenBadge amount={user.tokens} />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filter === c.key
                ? 'eco-gradient text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
              </div>
              {redeemed === item.id ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-10 h-10 eco-gradient rounded-full flex items-center justify-center"
                >
                  <Check className="w-5 h-5 text-primary-foreground" />
                </motion.div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleRedeem(item)}
                  disabled={user.tokens < item.cost}
                  className="shrink-0 eco-gradient text-primary-foreground text-xs"
                >
                  {item.cost} TC
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default Redeem;
