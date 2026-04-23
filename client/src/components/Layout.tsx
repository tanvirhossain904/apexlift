import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, LayoutDashboard, BookOpen, BarChart2, LogOut, Menu, X, ClipboardList } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/log', icon: ClipboardList, label: 'Log Workout' },
  { to: '/programs', icon: BookOpen, label: 'Programs' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <nav className="bg-slate-800/80 backdrop-blur border-b border-slate-700/60 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-emerald-400">
          <Dumbbell size={22} />
          ApexLift
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(to)
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm text-slate-400">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 transition-colors"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>

        <button className="md:hidden text-slate-400 hover:text-slate-100" onClick={() => setOpen((v) => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-slate-800 border-b border-slate-700/60 px-4 py-3 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                pathname.startsWith(to) ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-300'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-400"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
