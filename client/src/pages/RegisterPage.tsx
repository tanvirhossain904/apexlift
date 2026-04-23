import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const inputCls =
  'w-full bg-slate-700/60 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    unit: 'kg' as 'kg' | 'lbs',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle =
    (field: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.unit);
      navigate('/dashboard');
    } catch {
      setError('Registration failed. That email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-emerald-400 mb-2">
            <Dumbbell size={32} />
            <span className="text-3xl font-bold tracking-tight">ApexLift</span>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8">
          <h1 className="text-xl font-semibold mb-6">Create account</h1>

          {error && (
            <p className="text-rose-400 text-sm bg-rose-400/10 border border-rose-400/20 px-3 py-2 rounded-lg mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Name</label>
              <input type="text" value={form.name} onChange={handle('name')} required autoFocus className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={handle('email')} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={handle('password')}
                required
                minLength={8}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Preferred unit</label>
              <select value={form.unit} onChange={handle('unit')} className={inputCls}>
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-semibold py-2.5 rounded-lg transition-colors mt-2 shadow-sm shadow-emerald-500/20"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-slate-400 text-center mt-6">
            Have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
