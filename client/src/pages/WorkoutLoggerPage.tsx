import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import * as ws from '../services/workoutService';
import { Workout, ExerciseSet } from '../types';

const inputCls =
  'bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent';

const today = () => new Date().toISOString().slice(0, 10);

interface SetDraft {
  weight: string;
  reps: string;
  rpe: string;
}

const emptyDraft = (): SetDraft => ({ weight: '', reps: '', rpe: '' });

// ─── Phase 1: Create workout ──────────────────────────────────────────────────

function NewWorkoutForm() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [date, setDate] = useState(today());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await ws.createWorkout({ name, date });
      navigate(`/log/${data._id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-1">Start a workout</h1>
        <p className="text-zinc-400 text-sm mb-6">Give it a name and you're ready to log.</p>

        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Workout name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Push A, Leg Day"
                required
                autoFocus
                className={`${inputCls} w-full`}
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`${inputCls} w-full`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-900 font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Creating…' : 'Start workout'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

// ─── Phase 2: Log exercises + sets ───────────────────────────────────────────

function ActiveLogger({ workoutId }: { workoutId: string }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const unit = user?.preferredUnit ?? 'kg';

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [setForms, setSetForms] = useState<Record<string, SetDraft>>({});
  const [exForm, setExForm] = useState({ name: '', muscleGroup: '' });
  const [exLoading, setExLoading] = useState(false);
  const [setLoading, setSetLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    ws.getWorkout(workoutId).then((r) => setWorkout(r.data)).catch(console.error);
  }, [workoutId]);

  const refresh = (updated: Workout) => setWorkout(updated);

  const handleAddExercise = async (e: FormEvent) => {
    e.preventDefault();
    if (!exForm.name || !exForm.muscleGroup) return;
    setExLoading(true);
    try {
      const { data } = await ws.addExercise(workoutId, exForm);
      refresh(data);
      const newEx = data.exercises[data.exercises.length - 1];
      setExpandedId(newEx._id);
      setSetForms((f) => ({ ...f, [newEx._id]: emptyDraft() }));
      setExForm({ name: '', muscleGroup: '' });
    } finally {
      setExLoading(false);
    }
  };

  const handleAddSet = async (exerciseId: string) => {
    const draft = setForms[exerciseId];
    if (!draft || !workout) return;
    const weight = parseFloat(draft.weight);
    const reps = parseInt(draft.reps);
    if (isNaN(weight) || isNaN(reps)) return;

    setSetLoading((l) => ({ ...l, [exerciseId]: true }));
    try {
      const exercise = workout.exercises.find((ex) => ex._id === exerciseId)!;
      const newSet: ExerciseSet = {
        weight,
        reps,
        ...(draft.rpe ? { rpe: parseFloat(draft.rpe) } : {}),
      };
      const { data } = await ws.updateExercise(workoutId, exerciseId, {
        sets: [...exercise.sets, newSet],
      });
      refresh(data);
      setSetForms((f) => ({ ...f, [exerciseId]: emptyDraft() }));
    } finally {
      setSetLoading((l) => ({ ...l, [exerciseId]: false }));
    }
  };

  const handleRemoveSet = async (exerciseId: string, setIndex: number) => {
    if (!workout) return;
    const exercise = workout.exercises.find((ex) => ex._id === exerciseId)!;
    const updatedSets = exercise.sets.filter((_, i) => i !== setIndex);
    const { data } = await ws.updateExercise(workoutId, exerciseId, { sets: updatedSets });
    refresh(data);
  };

  const handleRemoveExercise = async (exerciseId: string) => {
    const { data } = await ws.removeExercise(workoutId, exerciseId);
    refresh(data);
    if (expandedId === exerciseId) setExpandedId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((cur) => (cur === id ? null : id));
    setSetForms((f) => (f[id] ? f : { ...f, [id]: emptyDraft() }));
  };

  if (!workout) {
    return (
      <Layout>
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{workout.name}</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {new Date(workout.date).toLocaleDateString(undefined, {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <CheckCircle size={15} />
          Finish
        </button>
      </div>

      {/* Exercise list */}
      <div className="space-y-3 mb-6">
        {workout.exercises.length === 0 && (
          <p className="text-zinc-500 text-sm py-4 text-center">No exercises yet. Add one below.</p>
        )}

        {workout.exercises.map((ex) => {
          const isOpen = expandedId === ex._id;
          const draft = setForms[ex._id] ?? emptyDraft();
          const loading = setLoading[ex._id] ?? false;
          const exVolume = ex.sets.reduce((s, set) => s + set.weight * set.reps, 0);

          return (
            <div key={ex._id} className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
              {/* Exercise header */}
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  onClick={() => toggleExpand(ex._id)}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  <div>
                    <p className="font-medium text-sm">{ex.name}</p>
                    <p className="text-xs text-zinc-500">
                      {ex.muscleGroup} · {ex.sets.length} set{ex.sets.length !== 1 ? 's' : ''} · {exVolume} {unit}
                    </p>
                  </div>
                  <span className="ml-auto mr-3 text-zinc-500">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>
                <button
                  onClick={() => handleRemoveExercise(ex._id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {isOpen && (
                <div className="border-t border-zinc-700 px-4 py-3 space-y-3">
                  {/* Sets table */}
                  {ex.sets.length > 0 && (
                    <table className="w-full text-sm mb-1">
                      <thead>
                        <tr className="text-xs text-zinc-500">
                          <th className="text-left pb-1.5 font-normal">Set</th>
                          <th className="text-left pb-1.5 font-normal">{unit}</th>
                          <th className="text-left pb-1.5 font-normal">Reps</th>
                          <th className="text-left pb-1.5 font-normal">RPE</th>
                          <th className="pb-1.5" />
                        </tr>
                      </thead>
                      <tbody>
                        {ex.sets.map((set, i) => (
                          <tr key={i} className="border-t border-zinc-700/50">
                            <td className="py-1.5 text-zinc-400">{i + 1}</td>
                            <td className="py-1.5 font-medium">{set.weight}</td>
                            <td className="py-1.5">{set.reps}</td>
                            <td className="py-1.5 text-zinc-500">{set.rpe ?? '—'}</td>
                            <td className="py-1.5 text-right">
                              <button
                                onClick={() => handleRemoveSet(ex._id, i)}
                                className="text-zinc-600 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Add set form */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="number"
                      placeholder={unit}
                      value={draft.weight}
                      onChange={(e) => setSetForms((f) => ({ ...f, [ex._id]: { ...draft, weight: e.target.value } }))}
                      className={`${inputCls} w-20`}
                      min="0"
                      step="0.5"
                    />
                    <input
                      type="number"
                      placeholder="Reps"
                      value={draft.reps}
                      onChange={(e) => setSetForms((f) => ({ ...f, [ex._id]: { ...draft, reps: e.target.value } }))}
                      className={`${inputCls} w-20`}
                      min="1"
                    />
                    <input
                      type="number"
                      placeholder="RPE"
                      value={draft.rpe}
                      onChange={(e) => setSetForms((f) => ({ ...f, [ex._id]: { ...draft, rpe: e.target.value } }))}
                      className={`${inputCls} w-20`}
                      min="6"
                      max="10"
                      step="0.5"
                    />
                    <button
                      onClick={() => handleAddSet(ex._id)}
                      disabled={loading || !draft.weight || !draft.reps}
                      className="flex items-center gap-1 text-sm bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 px-3 py-2 rounded-lg transition-colors"
                    >
                      <Plus size={14} />
                      {loading ? 'Saving…' : 'Add set'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add exercise form */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
        <p className="text-sm font-medium text-zinc-300 mb-3">Add exercise</p>
        <form onSubmit={handleAddExercise} className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Exercise name"
            value={exForm.name}
            onChange={(e) => setExForm((f) => ({ ...f, name: e.target.value }))}
            required
            className={`${inputCls} flex-1 min-w-36`}
          />
          <input
            type="text"
            placeholder="Muscle group"
            value={exForm.muscleGroup}
            onChange={(e) => setExForm((f) => ({ ...f, muscleGroup: e.target.value }))}
            required
            className={`${inputCls} flex-1 min-w-32`}
          />
          <button
            type="submit"
            disabled={exLoading}
            className="flex items-center gap-1.5 text-sm bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-900 font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} />
            {exLoading ? 'Adding…' : 'Add'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export default function WorkoutLoggerPage() {
  const { workoutId } = useParams<{ workoutId?: string }>();
  return workoutId ? <ActiveLogger workoutId={workoutId} /> : <NewWorkoutForm />;
}
