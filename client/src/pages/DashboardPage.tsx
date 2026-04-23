import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  TrendingUp,
  Calendar,
  Plus,
  Activity,
  Flame,
  Target,
  ChevronRight,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { getWorkouts } from '../services/workoutService';
import { getMuscleDistribution } from '../services/analyticsService';
import type { Workout, MuscleDistributionPoint } from '../types';

const MUSCLE_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#059669', '#047857', '#065f46', '#a7f3d0', '#022c22'];

const totalVolume = (w: Workout) =>
  w.exercises.reduce((sum, ex) => sum + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0);

const totalSets = (w: Workout) => w.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const weekStart = () => {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
};

const computeStreak = (workouts: Workout[]) => {
  if (workouts.length === 0) return 0;
  const days = new Set(workouts.map((w) => startOfDay(new Date(w.date)).getTime()));
  let streak = 0;
  const cursor = startOfDay(new Date());
  while (days.has(cursor.getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

const relativeTime = (date: string) => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.round(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.round(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

function SummaryStat({
  icon,
  label,
  value,
  sublabel,
  highlight = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 border transition-colors ${
        highlight
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{label}</span>
        <span className={highlight ? 'text-emerald-400' : 'text-slate-500'}>{icon}</span>
      </div>
      <p className={`text-2xl font-bold tabular-nums ${highlight ? 'text-emerald-400' : 'text-slate-100'}`}>
        {value}
      </p>
      {sublabel && <p className="text-xs text-slate-500 mt-1">{sublabel}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [distribution, setDistribution] = useState<MuscleDistributionPoint[]>([]);
  const [distLoading, setDistLoading] = useState(true);

  useEffect(() => {
    getWorkouts()
      .then((r) => setWorkouts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    getMuscleDistribution()
      .then((r) => setDistribution(r.data))
      .catch(console.error)
      .finally(() => setDistLoading(false));
  }, []);

  const today = startOfDay(new Date());
  const ws = weekStart();
  const todayWorkouts = workouts.filter((w) => startOfDay(new Date(w.date)).getTime() === today.getTime());
  const thisWeek = workouts.filter((w) => new Date(w.date) >= ws);
  const todayVolume = todayWorkouts.reduce((sum, w) => sum + totalVolume(w), 0);
  const todaySets = todayWorkouts.reduce((sum, w) => sum + totalSets(w), 0);
  const weekVolume = thisWeek.reduce((sum, w) => sum + totalVolume(w), 0);
  const streak = computeStreak(workouts);
  const recent = workouts.slice(0, 6);
  const unit = user?.preferredUnit ?? 'kg';

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Layout>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-400 mb-1">{todayLabel}</p>
          <h1 className="text-2xl font-bold text-slate-100">
            Hey {user?.name?.split(' ')[0]}, ready to train?
          </h1>
        </div>
        <Link
          to="/log"
          className="flex items-center gap-1.5 text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-emerald-500/20"
        >
          <Plus size={15} />
          Log Workout
        </Link>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Daily Summary</h2>
          <span className="text-xs text-slate-500">
            {todayWorkouts.length > 0 ? 'Logged today' : 'No session logged yet'}
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <SummaryStat
            icon={<Activity size={16} />}
            label="Today · Volume"
            value={todayVolume.toLocaleString()}
            sublabel={unit}
            highlight={todayVolume > 0}
          />
          <SummaryStat
            icon={<Target size={16} />}
            label="Today · Sets"
            value={String(todaySets)}
            sublabel={`${todayWorkouts.length} session${todayWorkouts.length !== 1 ? 's' : ''}`}
          />
          <SummaryStat
            icon={<Calendar size={16} />}
            label="This Week"
            value={String(thisWeek.length)}
            sublabel={`${weekVolume.toLocaleString()} ${unit} total`}
          />
          <SummaryStat
            icon={<Flame size={16} />}
            label="Streak"
            value={`${streak}d`}
            sublabel={streak > 0 ? 'Consecutive days' : 'Start one today'}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
        <section className="lg:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <PieChartIcon size={16} className="text-emerald-400" />
            <h2 className="text-sm font-semibold text-slate-100">Muscle Distribution</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">Volume share across all workouts</p>

          {distLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : distribution.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-10">
              No data yet. Log workouts to see your split.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="totalVolume"
                  nameKey="muscleGroup"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={85}
                  paddingAngle={2}
                  stroke="#0f172a"
                >
                  {distribution.map((entry, i) => (
                    <Cell key={entry.muscleGroup} fill={MUSCLE_COLORS[i % MUSCLE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                  formatter={(v, _n, item) => {
                    const point = (item as { payload: MuscleDistributionPoint }).payload;
                    return [
                      `${Number(v ?? 0).toLocaleString()} ${unit} · ${point.totalSets} sets`,
                      point.muscleGroup,
                    ];
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="lg:col-span-3 bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-100">Recent Activity</h2>
            </div>
            <Link to="/log" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-10">
              <Dumbbell size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No activity yet.</p>
              <Link to="/log" className="text-emerald-400 hover:text-emerald-300 text-sm mt-1 inline-block">
                Log your first workout
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-700/60 -my-2">
              {recent.map((w) => {
                const vol = totalVolume(w);
                const sets = totalSets(w);
                return (
                  <li key={w._id}>
                    <Link
                      to="/log"
                      className="flex items-center gap-3 py-3 group hover:bg-slate-700/20 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <Dumbbell size={15} className="text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-100 truncate">{w.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {relativeTime(w.date)} · {w.exercises.length} exercise
                          {w.exercises.length !== 1 ? 's' : ''} · {sets} sets
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-slate-100 tabular-nums">
                          {vol.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-slate-500 uppercase tracking-wider">{unit}</p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  );
}
