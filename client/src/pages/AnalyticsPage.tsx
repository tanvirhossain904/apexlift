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
  'bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent';

const statusConfig = {
  progressed: { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', label: 'Progressed' },
  regressed:  { icon: TrendingDown, color: 'text-red-400',   bg: 'bg-red-400/10 border-red-400/20',   label: 'Regressed'  },
  maintained: { icon: Minus,        color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', label: 'Maintained' },
  new:        { icon: Sparkles,     color: 'text-blue-400',  bg: 'bg-blue-400/10 border-blue-400/20',  label: 'New exercise' },
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
      <p className="text-lg font-bold">{result.exerciseName}</p>
      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-zinc-400 text-xs mb-0.5">Current volume</p>
          <p className="font-semibold">{result.currentVolume.toLocaleString()}</p>
        </div>
        {result.previousVolume !== null && (
          <div>
            <p className="text-zinc-400 text-xs mb-0.5">Previous volume</p>
            <p className="font-semibold">{result.previousVolume.toLocaleString()}</p>
          </div>
        )}
        {result.delta !== null && (
          <div>
            <p className="text-zinc-400 text-xs mb-0.5">Delta</p>
            <p className={`font-semibold ${result.delta > 0 ? 'text-green-400' : result.delta < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
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
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Weekly Volume Chart */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 mb-6">
        <h2 className="text-base font-semibold mb-1">Weekly volume</h2>
        <p className="text-xs text-zinc-500 mb-4">Total {unit} lifted per week across all exercises</p>

        {volumeLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chartData.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-10">No data yet. Log some workouts to see your volume trend.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
              <XAxis dataKey="week" stroke="#71717a" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis stroke="#71717a" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#27272a',
                  border: '1px solid #3f3f46',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#f4f4f5', marginBottom: 4 }}
                formatter={(v) => [`${Number(v).toLocaleString()} ${unit}`, 'Volume']}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#volumeGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#f59e0b' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Progressive Overload Lookup */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5">
        <h2 className="text-base font-semibold mb-1">Progressive overload</h2>
        <p className="text-xs text-zinc-500 mb-4">Compare your last two sessions for any exercise</p>

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
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-900 font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Search size={15} />
            {progLoading ? 'Checking…' : 'Check'}
          </button>
        </form>

        {progError && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
            {progError}
          </p>
        )}

        {progression && !progError && <ProgressionCard result={progression} />}
      </div>
    </Layout>
  );
}
