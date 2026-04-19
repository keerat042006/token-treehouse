import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { Recycle, Coins, Gift, Globe2, ShieldCheck, Sparkles } from 'lucide-react';

const features = [
  { icon: Recycle, title: 'Recycle anywhere', desc: 'Drop at 200+ partner cafés or schedule a doorstep pickup.', color: 'hsl(var(--eco-blue))' },
  { icon: Coins, title: 'Real-time TCC tokens', desc: 'Earn TrashCash tokens at live market rates. 1 TCC = ₹1.', color: 'hsl(var(--eco-amber))' },
  { icon: Gift, title: 'Spend like cash', desc: 'Vouchers, café orders, entertainment, donations & more.', color: 'hsl(var(--eco-green))' },
  { icon: Globe2, title: 'Verified impact', desc: 'Every kg recycled is tracked, verified & reported transparently.', color: 'hsl(var(--eco-teal))' },
  { icon: ShieldCheck, title: 'Bank-grade security', desc: 'Your wallet & data are encrypted end-to-end.', color: 'hsl(var(--eco-coral))' },
  { icon: Sparkles, title: 'Gamified for life', desc: 'Tiers, leaderboards & rewards keep recycling fun.', color: 'hsl(var(--eco-blue))' },
];

const About = () => (
  <AppShell>
    <PageWrapper>
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="pill-outline mb-4"><Sparkles className="w-3 h-3 text-eco-blue" /> Our mission</span>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          A <span className="text-eco-blue">circular economy</span> in your <span className="text-eco-amber">pocket</span>.
        </h1>
        <p className="text-muted-foreground-2 mt-4 text-lg leading-relaxed">
          EcoFusion turns the global recycling industry into a fintech-grade rewards platform — making sustainability rewarding, transparent, and genuinely fun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(f => (
          <div key={f.title} className="surface-card p-6">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${f.color.replace(')', ' / 0.15)')}`, border: `1px solid ${f.color.replace(')', ' / 0.35)')}` }}
            >
              <f.icon className="w-5 h-5" style={{ color: f.color }} />
            </div>
            <h3 className="font-bold text-white">{f.title}</h3>
            <p className="text-sm text-muted-foreground-2 mt-1.5 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 surface-flat p-8 text-center wallet-hero">
        <h2 className="text-2xl font-bold text-white">Built for the next billion recyclers.</h2>
        <p className="text-muted-foreground-2 mt-2 max-w-xl mx-auto">
          From metro cafés to tier-3 housing societies, EcoFusion scales with operators, NGOs and brands to close the loop.
        </p>
      </div>
    </PageWrapper>
  </AppShell>
);

export default About;
