import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  TrendingUp,
  BarChart3,
  Zap,
  ChevronRight,
  Check,
  Target,
  Calendar,
  ChevronUp,
  ChevronDown,
  Minus,
  Flame,
  ArrowUpRight,
  Scale,
  HelpCircle,
  Mail,
} from 'lucide-react';

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true,
} as const;

const XIcon = (p: { className?: string }) => (
  <svg {...iconProps} className={p.className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = (p: { className?: string }) => (
  <svg {...iconProps} className={p.className}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const InstagramIcon = (p: { className?: string }) => (
  <svg {...iconProps} className={p.className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const YoutubeIcon = (p: { className?: string }) => (
  <svg {...iconProps} className={p.className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const weekBars = [42, 58, 53, 69, 61, 78, 90];
const maxBar = 90;

const exerciseRows = [
  { name: 'Bench Press', sets: 3, reps: 8, weight: '82.5 kg', up: true, pct: '+5.8%' },
  { name: 'OHP', sets: 4, reps: 6, weight: '55 kg', up: false, pct: 'Same' },
  { name: 'Squat', sets: 3, reps: 5, weight: '100 kg', up: true, pct: '+2.1%' },
];

const progressionRows = [
  { name: 'Bench Press', vol: '1,980 kg', delta: '+5.8%', status: 'Progressed' },
  { name: 'Squat', vol: '1,500 kg', delta: '+2.1%', status: 'Progressed' },
  { name: 'Deadlift', vol: '2,250 kg', delta: '0%', status: 'Maintained' },
  { name: 'OHP', vol: '792 kg', delta: '-3.2%', status: 'Regressed' },
];

const steps = [
  { n: '01', title: 'Create your account', desc: 'Sign up in 30 seconds — name, email, password.', color: 'amber' },
  { n: '02', title: 'Log your first session', desc: 'Add exercises, sets, reps, and weight live as you train.', color: 'orange' },
  { n: '03', title: 'Watch the data stack', desc: 'Analytics improve with every session you log.', color: 'rose' },
];

const faqs = [
  {
    q: 'What is ApexLift?',
    a: 'ApexLift is a free workout tracker built for serious lifters. You log every set, rep, and weight, and the app surfaces progressive overload status per exercise plus weekly training volume — so every session compounds on the last.',
  },
  {
    q: 'Is ApexLift free to use?',
    a: 'Yes — ApexLift is completely free. No subscription, no credit card, and no ads. Sign up with an email and start logging.',
  },
  {
    q: 'What is progressive overload and why does it matter?',
    a: 'Progressive overload is the gradual increase of stress placed on your muscles over time — more weight, more reps, or more sets. It is the foundational principle for building strength and muscle. Without progressive overload, training plateaus and adaptation stops.',
  },
  {
    q: 'How does ApexLift track progressive overload?',
    a: 'ApexLift compares your two most recent sessions for each exercise and labels the result as Progressed, Maintained, Regressed, or New. The status updates instantly after every workout you log, so you always know whether you are moving forward.',
  },
  {
    q: 'How is training volume calculated?',
    a: 'Volume per set equals weight multiplied by reps. ApexLift sums this across every set, exercise, and workout, then aggregates the totals by ISO week using a MongoDB aggregation pipeline. The result is a clean weekly volume time-series you can use to spot peaks, deloads, and trends.',
  },
  {
    q: 'Does ApexLift support kilograms (kg) and pounds (lbs)?',
    a: 'Yes. Pick your preferred unit when you sign up. Weights are stored as raw numbers internally and displayed in your unit of choice across the entire app, so unit conversion never affects your aggregation math.',
  },
  {
    q: 'Do I need to download an app from the App Store or Google Play?',
    a: 'No download required. ApexLift is a responsive web app — open it in any modern browser on your phone, tablet, or desktop. Add it to your home screen for one-tap access.',
  },
  {
    q: 'How is my workout data stored and is it private?',
    a: 'Your workout data is stored in MongoDB and tied to your authenticated account via JWT. Only you can access your sessions. We do not sell, share, or analyse your training history for ads.',
  },
  {
    q: 'What is the best way to log a workout with ApexLift?',
    a: 'Open the Workout Logger as you train. Add an exercise, then enter weight, reps, and optional RPE between sets. Each set takes under 30 seconds to log, so you stay focused on lifting — not on your phone.',
  },
  {
    q: 'How is ApexLift different from MyFitnessPal, Strong, or Hevy?',
    a: 'ApexLift is laser-focused on resistance training analytics — not nutrition, not cardio, not social feeds. You get progressive overload tracking and weekly volume aggregation out of the box, with zero noise and no paywall behind the core features.',
  },
];

const benefits = [
  'Free, no card required',
  'KG & LBS support',
  'Instant progression feedback',
  'Weekly volume charts',
  'Mobile-responsive',
  'No ads or noise',
];

const statusStyle = {
  Progressed: 'bg-emerald-500/15 text-emerald-400',
  Maintained: 'bg-slate-700/60 text-slate-400',
  Regressed: 'bg-rose-500/15 text-rose-400',
} as const;

const stepColors = {
  amber: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  orange: 'border-teal-500/40 bg-teal-500/10 text-teal-400',
  rose: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
} as const;

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-950 text-slate-100">

      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'border-b border-white/[0.08] bg-slate-950/85 shadow-lg shadow-black/20 backdrop-blur-xl'
            : 'border-b border-transparent bg-slate-950/40 backdrop-blur'
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-200 ${
            scrolled ? 'py-3' : 'py-4'
          }`}
        >
          <Link
            to="/"
            aria-label="ApexLift — home"
            className="flex items-center gap-2.5 rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30">
              <Dumbbell className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black tracking-tight">
              Apex<span className="text-emerald-500">Lift</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-slate-100"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              Get started
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 lg:pb-32 lg:pt-24">
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-teal-600/5 blur-[100px]" />

        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — copy */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
              <Flame className="h-3 w-3" />
              Performance Tracker
            </div>

            <h1 className="mb-5 text-5xl font-black leading-[1.06] tracking-tight lg:text-6xl xl:text-7xl">
              <span className="block bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Train smarter.
              </span>
              <span className="block bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Lift heavier.
              </span>
            </h1>

            <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-400 lg:text-lg">
              ApexLift is a precision performance engine — log sessions, track progressive overload, and
              visualise weekly volume so every workout compounds on the last.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:brightness-110 hover:shadow-emerald-500/40"
              >
                Start for free
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl border border-slate-700 px-7 py-3.5 text-sm font-medium text-slate-300 transition-all hover:border-slate-500 hover:bg-slate-800/50 hover:text-slate-100"
              >
                I have an account
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-5 text-xs text-slate-500">
              {['Free forever', 'No credit card', 'KG & LBS'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-emerald-500" strokeWidth={3} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — floating workout card */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
            </div>

            <div className="relative w-full max-w-sm rotate-1 rounded-2xl border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-black/60 backdrop-blur-xl">
              {/* Card header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Today's Session
                  </p>
                  <p className="text-sm font-bold text-slate-100">Upper Push A</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live
                </span>
              </div>

              {/* Exercise rows */}
              <div className="space-y-2">
                {exerciseRows.map((ex) => (
                  <div
                    key={ex.name}
                    className="flex items-center justify-between rounded-xl bg-slate-800/70 px-3.5 py-2.5"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-100">{ex.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {ex.sets} × {ex.reps} · {ex.weight}
                      </p>
                    </div>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        ex.up
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-slate-700/60 text-slate-400'
                      }`}
                    >
                      {ex.up ? (
                        <ChevronUp className="h-2.5 w-2.5" />
                      ) : (
                        <Minus className="h-2.5 w-2.5" />
                      )}
                      {ex.pct}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-[11px] text-slate-500">
                  <span>Session progress</span>
                  <span>2 / 3 exercises</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                </div>
              </div>

              {/* Corner accent dots */}
              <div className="absolute -right-2 -top-2 flex gap-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div className="h-2 w-2 rounded-full bg-teal-500 opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────── */}
      <div className="border-y border-white/[0.06] bg-slate-900/50">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 px-6 py-6 md:gap-14">
          {[
            { icon: Zap, value: 'Real-time', label: 'Progression feedback' },
            { icon: BarChart3, value: 'Weekly', label: 'Volume analytics' },
            { icon: Scale, value: 'KG & LBS', label: 'Unit support' },
            { icon: Target, value: 'Per-exercise', label: 'Overload tracking' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <Icon className="h-4 w-4 text-emerald-500" strokeWidth={1.75} />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features bento ───────────────────────────────────────────── */}
      <section id="features" className="px-6 py-24" aria-labelledby="features-heading">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 id="features-heading" className="mb-3 text-3xl font-black tracking-tight md:text-4xl">
              Everything the serious lifter needs
            </h2>
            <p className="text-slate-400">Built lean. No subscriptions, no bloat.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Large: Progressive Overload */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-900 p-6 transition-all hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 md:col-span-2">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <TrendingUp className="h-5 w-5 text-emerald-400" strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-lg font-bold">Progressive Overload Tracking</h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-400">
                Compares your last two sessions per exercise. Surfaces progression status instantly — no
                spreadsheet required.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {progressionRows.map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-xl bg-slate-800/60 px-3.5 py-2.5"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{row.name}</p>
                      <p className="text-[11px] text-slate-500">{row.vol}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        statusStyle[row.status as keyof typeof statusStyle]
                      }`}
                    >
                      {row.delta}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics card */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-900 p-6 transition-all hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <BarChart3 className="h-5 w-5 text-emerald-500" strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-lg font-bold">Volume Analytics</h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-400">
                Weekly training volume as a time-series chart. Spot peaks, troughs, and trends at a
                glance.
              </p>
              {/* Mini bar chart */}
              <div className="flex h-20 items-end justify-between gap-1 px-1">
                {weekBars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-600 to-emerald-400/80 transition-all group-hover:from-emerald-500 group-hover:to-emerald-300"
                    style={{ height: `${(h / maxBar) * 100}%` }}
                  />
                ))}
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-slate-600">
                <span>Wk 1</span>
                <span>Wk 7</span>
              </div>
            </div>

            {/* Workout Logger */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-900 p-6 transition-all hover:border-teal-500/20 hover:shadow-xl hover:shadow-teal-500/5">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10 ring-1 ring-teal-500/20">
                <Dumbbell className="h-5 w-5 text-teal-400" strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-lg font-bold">Workout Logging</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Fast, friction-free session logging. Sets, reps, weight, and RPE — done before the next
                set starts.
              </p>
            </div>

            {/* Programs */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-900 p-6 transition-all hover:border-sky-500/20 hover:shadow-xl hover:shadow-sky-500/5 md:col-span-2">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/20">
                <Calendar className="h-5 w-5 text-sky-400" strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-lg font-bold">Training Programs</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Organise workouts into named training blocks — mesocycles, deload weeks, competition
                prep. Archive programs and start fresh each block while keeping your full history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="relative mx-auto max-w-4xl">
          <div className="pointer-events-none absolute inset-0 flex justify-center">
            <div className="h-72 w-[600px] rounded-full bg-emerald-500/5 blur-3xl" />
          </div>

          <div className="relative mb-14 text-center">
            <h2 className="mb-3 text-3xl font-black tracking-tight md:text-4xl">
              Up and running in{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                minutes
              </span>
            </h2>
            <p className="text-slate-400">No onboarding friction. No tutorials. Just lift.</p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            {/* Connecting line */}
            <div className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-8 hidden h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent md:block" />

            {steps.map((step) => (
              <div key={step.n} className="flex flex-col items-center text-center">
                <div
                  className={`relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border text-xl font-black ${
                    stepColors[step.color as keyof typeof stepColors]
                  }`}
                >
                  {step.n}
                </div>
                <h3 className="mb-2 font-bold text-slate-100">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits + CTA split ─────────────────────────────────────── */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-900">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-10">
              <h3 className="mb-6 text-xl font-black">What you get</h3>
              <ul className="space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                      <Check className="h-3 w-3 text-emerald-400" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex flex-col justify-center overflow-hidden border-t border-white/[0.06] p-8 md:border-l md:border-t-0 md:p-10">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/8 to-teal-500/5" />
              <div className="relative">
                <Target className="mb-4 h-8 w-8 text-emerald-500" strokeWidth={1.5} />
                <h3 className="mb-3 text-2xl font-black leading-tight">
                  Ready to hit
                  <br />
                  your peak?
                </h3>
                <p className="mb-6 text-sm text-slate-400">
                  Join ApexLift today. Every rep you log is a data point. Every data point is progress.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 hover:shadow-emerald-500/30"
                >
                  Create free account
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full-bleed CTA banner ─────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-10 text-center shadow-2xl shadow-emerald-500/20 md:p-16">
          {/* Texture overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(0,0,0,0.35) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-black/10 blur-2xl" />

          <div className="relative">
            <Zap className="mx-auto mb-5 h-10 w-10 text-emerald-950/60" strokeWidth={1.5} />
            <h2 className="mb-3 text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
              Start your apex era.
            </h2>
            <p className="mx-auto mb-8 max-w-md text-emerald-950/70">
              No excuses. No delays. Sign up free and log your first workout today.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-slate-800"
            >
              Get started — it&apos;s free
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ accordion (SEO + AEO, pre-footer) ────────────────────── */}
      <section
        id="faq"
        className="px-6 py-24"
        aria-labelledby="faq-heading"
      >
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
              <HelpCircle className="h-3 w-3" />
              FAQ
            </div>
            <h2
              id="faq-heading"
              className="mb-3 text-3xl font-black tracking-tight text-slate-100 md:text-4xl"
            >
              Frequently asked questions
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              Everything you need to know about ApexLift, progressive overload, training volume, and how
              the app stacks up against other workout trackers.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details
                key={f.q}
                open={i === 0}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className="group rounded-xl border border-white/[0.07] bg-slate-900/60 transition-colors open:border-emerald-500/30 hover:border-emerald-500/20"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-bold leading-snug text-slate-100 [&::-webkit-details-marker]:hidden">
                  <span itemProp="name">{f.q}</span>
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180 group-open:text-emerald-400"
                    strokeWidth={2.5}
                  />
                </summary>
                <div
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                  className="border-t border-white/[0.05] px-5 py-4"
                >
                  <p itemProp="text" className="text-sm leading-relaxed text-slate-400">
                    {f.a}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Still have a question?{' '}
            <Link to="/register" className="font-semibold text-emerald-400 hover:text-emerald-300">
              Try ApexLift free
            </Link>{' '}
            and see for yourself.
          </p>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
      </section>

      {/* ── Footer (SEO-friendly, multi-column) ──────────────────────── */}
      <footer className="border-t border-white/[0.06] bg-slate-950 px-6 pt-16 pb-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-12">
            {/* Brand column */}
            <div className="md:col-span-4">
              <Link to="/" aria-label="ApexLift — home" className="inline-flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30">
                  <Dumbbell className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />
                </div>
                <span className="text-lg font-black tracking-tight">
                  Apex<span className="text-emerald-500">Lift</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                A precision performance engine for serious lifters. Track progressive overload, log every
                set, and watch your weekly volume compound.
              </p>

              <div className="mt-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  Follow us
                </p>
                <ul className="flex items-center gap-2">
                  {[
                    { name: 'X (Twitter)', href: 'https://twitter.com/apexlift', Icon: XIcon },
                    { name: 'GitHub', href: 'https://github.com/apexlift', Icon: GithubIcon },
                    { name: 'Instagram', href: 'https://instagram.com/apexlift', Icon: InstagramIcon },
                    { name: 'YouTube', href: 'https://youtube.com/@apexlift', Icon: YoutubeIcon },
                  ].map(({ name, href, Icon }) => (
                    <li key={name}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`ApexLift on ${name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-slate-900/60 text-slate-400 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Link columns */}
            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-3"
            >
              <div>
                <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-300">
                  Product
                </h3>
                <ul className="space-y-2.5 text-sm">
                  <li><a href="#features" className="text-slate-400 transition-colors hover:text-emerald-400">Features</a></li>
                  <li><a href="#how-it-works" className="text-slate-400 transition-colors hover:text-emerald-400">How it works</a></li>
                  <li><a href="#faq" className="text-slate-400 transition-colors hover:text-emerald-400">FAQ</a></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-300">
                  App
                </h3>
                <ul className="space-y-2.5 text-sm">
                  <li><Link to="/register" className="text-slate-400 transition-colors hover:text-emerald-400">Create account</Link></li>
                  <li><Link to="/login" className="text-slate-400 transition-colors hover:text-emerald-400">Sign in</Link></li>
                  <li><Link to="/log" className="text-slate-400 transition-colors hover:text-emerald-400">Workout Logger</Link></li>
                  <li><Link to="/analytics" className="text-slate-400 transition-colors hover:text-emerald-400">Analytics</Link></li>
                  <li><Link to="/programs" className="text-slate-400 transition-colors hover:text-emerald-400">Programs</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-300">
                  Contact
                </h3>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <a
                      href="mailto:hello@apexlift.app"
                      className="inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-emerald-400"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      hello@apexlift.app
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 md:flex-row">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} ApexLift. Built for serious lifters. All rights reserved.
            </p>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ApexLift',
              url: 'https://apexlift.app',
              logo: 'https://apexlift.app/logo.png',
              description:
                'A free workout tracker for serious lifters. Log sets, track progressive overload, and visualise weekly training volume.',
              sameAs: [
                'https://twitter.com/apexlift',
                'https://github.com/apexlift',
                'https://instagram.com/apexlift',
                'https://youtube.com/@apexlift',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'hello@apexlift.app',
                contactType: 'customer support',
              },
            }),
          }}
        />
      </footer>
    </div>
  );
}
