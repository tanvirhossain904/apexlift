import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Search, TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { getWeeklyVolume, getProgression } from '../services/analyticsService';
import type { WeeklyVolumePoint, ProgressionResult } from '../types';

const inputCls =
  'bg-slate-700/60 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

const statusConfig = {
  progressed: { icon: TrendingUp,   color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Progressed' },
  regressed:  { icon: TrendingDown, color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20',       label: 'Regressed'  },
  maintained: { icon: Minus,        color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',     label: 'Maintained' },
  new:        { icon: Sparkles,     color: 'text-sky-400',     bg: 'bg-sky-500/10 border-sky-500/20',         label: 'New exercise' },
};

function ProgressionCard({ result }: { result: ProgressionResult }) {
  const cfg = statusConfig[result.status];
  const Icon = cfg.icon;
  return (
    <div className={`border rounded-xl p-5 ${cfg.bg}`}>
      <div className={`flex items-center gap-2 font-semibold mb-3 ${cfg.color}`}>
        <Icon size={18} />
        {cfg.label}
      </div>
      <p className="text-lg font-bold text-slate-100">{result.exerciseName}</p>
      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-400 text-xs mb-0.5">Current volume</p>
          <p className="font-semibold text-slate-100 tabular-nums">{result.currentVolume.toLocaleString()}</p>
        </div>
        {result.previousVolume !== null && (
          <div>
            <p className="text-slate-400 text-xs mb-0.5">Previous volume</p>
            <p className="font-semibold text-slate-100 tabular-nums">{result.previousVolume.toLocaleString()}</p>
          </div>
        )}
        {result.delta !== null && (
          <div>
            <p className="text-slate-400 text-xs mb-0.5">Delta</p>
            <p className={`font-semibold tabular-nums ${result.delta > 0 ? 'text-emerald-400' : result.delta < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {result.delta > 0 ? '+' : ''}{result.delta.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const unit = user?.preferredUnit ?? 'kg';

  const [volumeData, setVolumeData] = useState<WeeklyVolumePoint[]>([]);
  const [volumeLoading, setVolumeLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [progression, setProgression] = useState<ProgressionResult | null>(null);
  const [progLoading, setProgLoading] = useState(false);
  const [progError, setProgError] = useState('');

  useEffect(() => {
    getWeeklyVolume()
      .then((r) => setVolumeData(r.data))
      .catch(console.error)
      .finally(() => setVolumeLoading(false));
  }, []);

  const handleProgression = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setProgError('');
    setProgLoading(true);
    try {
      const { data } = await getProgression(query.trim());
      setProgression(data);
    } catch {
      setProgError('Could not fetch progression data.');
    } finally {
      setProgLoading(false);
    }
  };

  const chartData = volumeData.map((p) => ({
    week: `W${p._id.week} '${String(p._id.year).slice(2)}`,
    volume: p.totalVolume,
    workouts: p.workoutCount,
  }));

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-slate-100">Analytics</h1>

      {/* Weekly Volume Chart */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 mb-6">
        <h2 className="text-base font-semibold mb-1 text-slate-100">Weekly volume</h2>
        <p className="text-xs text-slate-500 mb-4">Total {unit} lifted per week across all exercises</p>

        {volumeLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chartData.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-10">No data yet. Log some workouts to see your volume trend.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#f1f5f9', marginBottom: 4 }}
                formatter={(v) => [`${Number(v).toLocaleString()} ${unit}`, 'Volume']}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#volumeGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#10b981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Progressive Overload Lookup */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
        <h2 className="text-base font-semibold mb-1 text-slate-100">Progressive overload</h2>
        <p className="text-xs text-slate-500 mb-4">Compare your last two sessions for any exercise</p>

        <form onSubmit={handleProgression} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Exercise name (e.g. Bench Press)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${inputCls} flex-1`}
          />
          <button
            type="submit"
            disabled={progLoading || !query.trim()}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-emerald-500/20"
          >
            <Search size={15} />
            {progLoading ? 'Checking…' : 'Check'}
          </button>
        </form>

        {progError && (
          <p className="text-rose-400 text-sm bg-rose-400/10 border border-rose-400/20 px-3 py-2 rounded-lg">
            {progError}
          </p>
        )}

        {progression && !progError && <ProgressionCard result={progression} />}
      </div>
    </Layout>
  );
}
