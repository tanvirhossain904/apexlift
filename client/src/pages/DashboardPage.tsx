import { useEffect, useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, TrendingUp, Calendar, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { getWorkouts } from '../services/workoutService';
import { Workout } from '../types';

const totalVolume = (w: Workout) =>
  w.exercises.reduce((sum, ex) => sum + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0);

const weekStart = () => {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
};

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
      <div className="text-amber-400 mb-3">{icon}</div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-zinc-400 mt-1">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkouts()
      .then((r) => setWorkouts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const ws = weekStart();
  const thisWeek = workouts.filter((w) => new Date(w.date) >= ws);
  const weekVolume = thisWeek.reduce((sum, w) => sum + totalVolume(w), 0);
  const recent = workouts.slice(0, 5);
  const unit = user?.preferredUnit ?? 'kg';

  return (
    <Layout>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-zinc-400 text-sm mt-1">Here's how your week is looking.</p>
        </div>
        <Link
          to="/log"
          className="flex items-center gap-1.5 text-sm bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} />
          Log Workout
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<Calendar size={20} />} label="Workouts this week" value={String(thisWeek.length)} />
        <StatCard
          icon={<TrendingUp size={20} />}
          label={`Volume this week (${unit})`}
          value={weekVolume.toLocaleString()}
        />
        <StatCard icon={<Dumbbell size={20} />} label="Total workouts logged" value={String(workouts.length)} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent workouts</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : recent.length === 0 ? (
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-10 text-center">
          <Dumbbell size={36} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No workouts yet.</p>
          <Link to="/log" className="text-amber-400 hover:underline text-sm mt-1 inline-block">
            Log your first one
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((w) => (
            <div
              key={w._id}
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-sm">{w.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {new Date(w.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  {' · '}
                  {w.exercises.length} exercise{w.exercises.length !== 1 ? 's' : ''}
                </p>
              </div>
              <span className="text-sm text-zinc-400 tabular-nums">
                {totalVolume(w).toLocaleString()} {unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
