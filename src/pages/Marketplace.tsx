import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/lib/UserContext';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { fireConfetti } from '@/components/Confetti';
import { Button } from '@/components/ui/button';
import { Coins, Check, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Item {
  id: string;
  name: string;
  brand: string;
  cost: number;
  category: 'cafe' | 'shopping' | 'fun' | 'donate';
  emoji: string;
  color: string;
  desc: string;
  popular?: boolean;
}

const items: Item[] = [
  { id: '1', name: 'Amazon ₹100 Voucher', brand: 'Amazon', cost: 100, category: 'shopping', emoji: '🛒', color: 'hsl(var(--eco-amber))', desc: 'Use across millions of products', popular: true },
  { id: '2', name: 'Zepto ₹50 Discount', brand: 'Zepto', cost: 50, category: 'shopping', emoji: '🛍️', color: 'hsl(var(--eco-blue))', desc: '10-min grocery delivery' },
  { id: '3', name: 'Plant a Tree', brand: 'TreeNation', cost: 10, category: 'donate', emoji: '🌳', color: 'hsl(var(--eco-green))', desc: 'Verified planting in India' },
  { id: '4', name: 'Cappuccino', brand: 'Green Bean Café', cost: 45, category: 'cafe', emoji: '☕', color: 'hsl(var(--eco-amber))', desc: 'At any partner café' },
  { id: '5', name: 'Veg Sandwich', brand: 'EcoBites', cost: 60, category: 'cafe', emoji: '🥪', color: 'hsl(var(--eco-amber))', desc: 'Freshly made daily' },
  { id: '6', name: 'BookMyShow ₹150', brand: 'BMS', cost: 150, category: 'fun', emoji: '🎬', color: 'hsl(var(--eco-coral))', desc: 'Movie ticket discount', popular: true },
  { id: '7', name: 'Arcade Pass (1hr)', brand: 'Fun Zone', cost: 30, category: 'fun', emoji: '🕹️', color: 'hsl(var(--eco-blue))', desc: '1 hour of arcade games' },
  { id: '8', name: 'Spotify Premium 1 Month', brand: 'Spotify', cost: 119, category: 'fun', emoji: '🎵', color: 'hsl(var(--eco-green))', desc: 'Ad-free music streaming' },
  { id: '9', name: 'Clean Ocean Donation', brand: 'OceanFund', cost: 20, category: 'donate', emoji: '🌊', color: 'hsl(var(--eco-teal))', desc: 'Fund ocean cleanup' },
  { id: '10', name: 'Swiggy ₹75 Off', brand: 'Swiggy', cost: 75, category: 'shopping', emoji: '🍔', color: 'hsl(var(--eco-coral))', desc: 'Food delivery discount' },
  { id: '11', name: 'Latte', brand: 'TrashCash Café', cost: 40, category: 'cafe', emoji: '🥛', color: 'hsl(var(--eco-amber))', desc: 'Smooth milky goodness' },
  { id: '12', name: 'Educate a Child', brand: 'EduTrust', cost: 200, category: 'donate', emoji: '📚', color: 'hsl(var(--eco-green))', desc: '1 month school supplies' },
];

const categories = [
  { key: 'all', label: 'All Rewards' },
  { key: 'cafe', label: '☕ Cafés' },
  { key: 'shopping', label: '🛒 Shopping' },
  { key: 'fun', label: '🎮 Fun Zone' },
  { key: 'donate', label: '❤️ Donate' },
];

const Marketplace = () => {
  const user = useUser();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [redeemed, setRedeemed] = useState<string | null>(null);

  const filtered = items.filter(i => {
    if (filter !== 'all' && i.category !== filter) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleRedeem = (item: Item) => {
    const success = user.spendTokens(item.cost, item.name, item.category);
    if (success) {
      setRedeemed(item.id);
      fireConfetti();
      toast.success(`Redeemed ${item.name}!`, { description: `-${item.cost} TCC from your wallet` });
      setTimeout(() => setRedeemed(null), 1800);
    } else {
      toast.error('Not enough tokens', { description: `You need ${item.cost - user.tokens} more TCC` });
    }
  };

  return (
    <AppShell>
      <PageWrapper>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <p className="section-label">Spend tokens</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white mt-1">Rewards Marketplace 🎁</h1>
            <p className="text-muted-foreground-2 text-sm mt-1">Redeem TCC for vouchers, food, fun & impact</p>
          </div>
          <div className="token-pill text-base px-4 py-2">
            <Coins className="w-4 h-4 coin-spin" /> Balance: {user.tokens} TCC
          </div>
        </div>

        {/* Search + filters */}
        <div className="surface-flat p-4 mb-5">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground-2" />
              <Input
                placeholder="Search rewards..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-surface-raised border-border text-white"
              />
            </div>
            <Filter className="w-4 h-4 text-muted-foreground-2 hidden sm:block" />
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {categories.map(c => (
                <button
                  key={c.key}
                  onClick={() => setFilter(c.key)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
                    filter === c.key
                      ? 'bg-eco-blue text-white shadow-lg'
                      : 'bg-white/[0.07] text-muted-foreground-2 hover:text-white hover:bg-white/[0.1]'
                  }`}
                  style={filter === c.key ? { boxShadow: '0 6px 18px -6px hsl(var(--eco-blue) / 0.6)' } : {}}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                className="surface-card p-5 group flex flex-col"
              >
                <div className="relative">
                  <div
                    className="aspect-[4/3] rounded-xl flex items-center justify-center text-6xl mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${item.color.replace(')', ' / 0.22)')}, ${item.color.replace(')', ' / 0.05)')})`,
                      border: `1px solid ${item.color.replace(')', ' / 0.3)')}`,
                    }}
                  >
                    {item.emoji}
                  </div>
                  {item.popular && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-eco-coral/20 text-eco-coral border border-eco-coral/40">
                      🔥 Popular
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground-2 font-semibold uppercase tracking-wider">{item.brand}</p>
                <p className="text-sm font-bold text-white mt-0.5 flex-1">{item.name}</p>
                <p className="text-xs text-muted-foreground-2 mt-0.5">{item.desc}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-eco-amber" />
                    <span className="text-base font-bold text-eco-amber">{item.cost}</span>
                    <span className="text-xs text-muted-foreground-2">TCC</span>
                  </div>
                  {redeemed === item.id ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-9 h-9 rounded-full flex items-center justify-center bg-eco-green/20 border border-eco-green/50"
                    >
                      <Check className="w-4 h-4 text-eco-green" />
                    </motion.div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleRedeem(item)}
                      disabled={user.tokens < item.cost}
                      className="btn-eco h-8 text-xs font-bold disabled:opacity-40"
                    >
                      Redeem
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground-2">
            <p>No rewards match your filters.</p>
          </div>
        )}
      </PageWrapper>
    </AppShell>
  );
};

export default Marketplace;
