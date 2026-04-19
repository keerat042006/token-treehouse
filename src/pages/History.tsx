import { useUser } from '@/lib/UserContext';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { ArrowDown, ArrowUp, CheckCircle2, Clock, Recycle, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
  const user = useUser();

  return (
    <AppShell>
      <PageWrapper>
        <div className="mb-6">
          <p className="section-label">Activity</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mt-1">History 📜</h1>
          <p className="text-muted-foreground-2 text-sm mt-1">All your submissions, pickups & redemptions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Submissions */}
          <div className="surface-flat p-5 lg:p-6">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
              <Recycle className="w-4 h-4 text-eco-blue" /> Waste Submissions
            </h3>
            <div className="space-y-2.5">
              {user.submissions.length === 0 && <p className="text-sm text-muted-foreground-2">No submissions yet.</p>}
              {user.submissions.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="surface-raised p-3 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-eco-blue/15 border border-eco-blue/30 text-lg">
                    ♻️
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{s.type} • {s.weight} kg</p>
                    <p className="text-[11px] text-muted-foreground-2">{s.date} • {s.method}</p>
                  </div>
                  <span className="pill-status-verified"><CheckCircle2 className="w-3 h-3" /> +{s.tokens} TC</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pickups */}
          <div className="surface-flat p-5 lg:p-6">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-eco-amber" /> Doorstep Pickups
            </h3>
            <div className="space-y-2.5">
              {user.pickups.length === 0 && <p className="text-sm text-muted-foreground-2">No pickups yet.</p>}
              {user.pickups.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="surface-raised p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{p.wasteType} • {p.weight} kg</p>
                    <span className={p.status === 'collected' ? 'pill-status-verified' : 'pill-status-pending'}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground-2 mt-1">{p.address}</p>
                  <p className="text-[11px] text-muted-foreground-2">{p.timeSlot} • {p.date}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="surface-flat p-5 lg:p-6 mt-5">
          <h3 className="font-bold text-white flex items-center gap-2 mb-4">
            <ShoppingBag className="w-4 h-4 text-eco-green" /> All Transactions
          </h3>
          <div className="overflow-x-auto -mx-5 lg:-mx-6 px-5 lg:px-6">
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground-2 border-b border-border">
                  <th className="text-left font-semibold py-2.5">Date</th>
                  <th className="text-left font-semibold py-2.5">Description</th>
                  <th className="text-left font-semibold py-2.5">Category</th>
                  <th className="text-right font-semibold py-2.5">Amount</th>
                </tr>
              </thead>
              <tbody>
                {user.transactions.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-6 text-sm text-muted-foreground-2">No transactions yet.</td></tr>
                )}
                {user.transactions.map(tx => (
                  <tr key={tx.id} className="border-b border-border/50 hover:bg-white/[0.02] transition">
                    <td className="py-3 text-sm text-muted-foreground-2">{tx.date}</td>
                    <td className="py-3 text-sm font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${tx.type === 'earned' ? 'bg-eco-green/15 text-eco-green' : 'bg-eco-coral/15 text-eco-coral'}`}
                        >
                          {tx.type === 'earned' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                        </div>
                        {tx.description}
                      </div>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground-2 capitalize">{tx.category || '—'}</td>
                    <td className={`py-3 text-sm font-bold text-right ${tx.type === 'earned' ? 'text-eco-green' : 'text-eco-coral'}`}>
                      {tx.type === 'earned' ? '+' : '-'}{tx.amount} TC
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageWrapper>
    </AppShell>
  );
};

export default History;
