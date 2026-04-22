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
  Minus,
  Flame,
  ArrowUpRight,
  Scale,
} from 'lucide-react';

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
  Maintained: 'bg-zinc-700/60 text-zinc-400',
  Regressed: 'bg-rose-500/15 text-rose-400',
} as const;

const stepColors = {
  amber: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
  orange: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
  rose: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
} as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-100">

      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/30">
              <Dumbbell className="h-4 w-4 text-amber-500" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black tracking-tight">
              Apex<span className="text-amber-500">Lift</span>
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-950 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25"
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
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-orange-600/5 blur-[100px]" />

        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
          {/* Left — copy */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
              <Flame className="h-3 w-3" />
              Performance Tracker
            </div>

            <h1 className="mb-5 text-5xl font-black leading-[1.06] tracking-tight lg:text-6xl xl:text-7xl">
              <span className="block bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Train smarter.
              </span>
              <span className="block bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Lift heavier.
              </span>
            </h1>

            <p className="mb-8 max-w-xl text-base leading-relaxed text-zinc-400 lg:text-lg">
              ApexLift is a precision performance engine — log sessions, track progressive overload, and
              visualise weekly volume so every workout compounds on the last.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/25 transition-all hover:brightness-110 hover:shadow-amber-500/40"
              >
                Start for free
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl border border-zinc-700 px-7 py-3.5 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-100"
              >
                I have an account
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-5 text-xs text-zinc-500">
              {['Free forever', 'No credit card', 'KG & LBS'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-amber-500" strokeWidth={3} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — floating workout card */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
            </div>

            <div className="relative w-full max-w-sm rotate-1 rounded-2xl border border-white/10 bg-zinc-900/90 p-5 shadow-2xl shadow-black/60 backdrop-blur-xl">
              {/* Card header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                    Today's Session
                  </p>
                  <p className="text-sm font-bold text-zinc-100">Upper Push A</p>
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
                    className="flex items-center justify-between rounded-xl bg-zinc-800/70 px-3.5 py-2.5"
                  >
                    <div>
                      <p className="text-xs font-semibold text-zinc-100">{ex.name}</p>
                      <p className="text-[11px] text-zinc-500">
                        {ex.sets} × {ex.reps} · {ex.weight}
                      </p>
                    </div>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        ex.up
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-zinc-700/60 text-zinc-400'
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
                <div className="mb-1.5 flex justify-between text-[11px] text-zinc-500">
                  <span>Session progress</span>
                  <span>2 / 3 exercises</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                </div>
              </div>

              {/* Corner accent dots */}
              <div className="absolute -right-2 -top-2 flex gap-1">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <div className="h-2 w-2 rounded-full bg-orange-500 opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────── */}
      <div className="border-y border-white/[0.06] bg-zinc-900/50">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 px-6 py-6 md:gap-14">
          {[
            { icon: Zap, value: 'Real-time', label: 'Progression feedback' },
            { icon: BarChart3, value: 'Weekly', label: 'Volume analytics' },
            { icon: Scale, value: 'KG & LBS', label: 'Unit support' },
            { icon: Target, value: 'Per-exercise', label: 'Overload tracking' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                <Icon className="h-4 w-4 text-amber-500" strokeWidth={1.75} />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white">{value}</div>
                <div className="text-xs text-zinc-500">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features bento ───────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-black tracking-tight md:text-4xl">
              Everything the serious lifter needs
            </h2>
            <p className="text-zinc-400">Built lean. No subscriptions, no bloat.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Large: Progressive Overload */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900 p-6 transition-all hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 md:col-span-2">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <TrendingUp className="h-5 w-5 text-emerald-400" strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-lg font-bold">Progressive Overload Tracking</h3>
              <p className="mb-6 text-sm leading-relaxed text-zinc-400">
                Compares your last two sessions per exercise. Surfaces progression status instantly — no
                spreadsheet required.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {progressionRows.map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-xl bg-zinc-800/60 px-3.5 py-2.5"
                  >
                    <div>
                      <p className="text-xs font-semibold text-zinc-200">{row.name}</p>
                      <p className="text-[11px] text-zinc-500">{row.vol}</p>
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
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900 p-6 transition-all hover:border-amber-500/20 hover:shadow-xl hover:shadow-amber-500/5">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
                <BarChart3 className="h-5 w-5 text-amber-500" strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-lg font-bold">Volume Analytics</h3>
              <p className="mb-6 text-sm leading-relaxed text-zinc-400">
                Weekly training volume as a time-series chart. Spot peaks, troughs, and trends at a
                glance.
              </p>
              {/* Mini bar chart */}
              <div className="flex h-20 items-end justify-between gap-1 px-1">
                {weekBars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-amber-600 to-amber-400/80 transition-all group-hover:from-amber-500 group-hover:to-amber-300"
                    style={{ height: `${(h / maxBar) * 100}%` }}
                  />
                ))}
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-zinc-600">
                <span>Wk 1</span>
                <span>Wk 7</span>
              </div>
            </div>

            {/* Workout Logger */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900 p-6 transition-all hover:border-orange-500/20 hover:shadow-xl hover:shadow-orange-500/5">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20">
                <Dumbbell className="h-5 w-5 text-orange-400" strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-lg font-bold">Workout Logging</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Fast, friction-free session logging. Sets, reps, weight, and RPE — done before the next
                set starts.
              </p>
            </div>

            {/* Programs */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900 p-6 transition-all hover:border-sky-500/20 hover:shadow-xl hover:shadow-sky-500/5 md:col-span-2">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/20">
                <Calendar className="h-5 w-5 text-sky-400" strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-lg font-bold">Training Programs</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Organise workouts into named training blocks — mesocycles, deload weeks, competition
                prep. Archive programs and start fresh each block while keeping your full history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="relative mx-auto max-w-4xl">
          <div className="pointer-events-none absolute inset-0 flex justify-center">
            <div className="h-72 w-[600px] rounded-full bg-amber-500/5 blur-3xl" />
          </div>

          <div className="relative mb-14 text-center">
            <h2 className="mb-3 text-3xl font-black tracking-tight md:text-4xl">
              Up and running in{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                minutes
              </span>
            </h2>
            <p className="text-zinc-400">No onboarding friction. No tutorials. Just lift.</p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            {/* Connecting line */}
            <div className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-8 hidden h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent md:block" />

            {steps.map((step) => (
              <div key={step.n} className="flex flex-col items-center text-center">
                <div
                  className={`relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border text-xl font-black ${
                    stepColors[step.color as keyof typeof stepColors]
                  }`}
                >
                  {step.n}
                </div>
                <h3 className="mb-2 font-bold text-zinc-100">{step.title}</h3>
                <p className="text-sm text-zinc-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits + CTA split ─────────────────────────────────────── */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-10">
              <h3 className="mb-6 text-xl font-black">What you get</h3>
              <ul className="space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-zinc-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 ring-1 ring-amber-500/30">
                      <Check className="h-3 w-3 text-amber-400" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex flex-col justify-center overflow-hidden border-t border-white/[0.06] p-8 md:border-l md:border-t-0 md:p-10">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/8 to-orange-500/5" />
              <div className="relative">
                <Target className="mb-4 h-8 w-8 text-amber-500" strokeWidth={1.5} />
                <h3 className="mb-3 text-2xl font-black leading-tight">
                  Ready to hit
                  <br />
                  your peak?
                </h3>
                <p className="mb-6 text-sm text-zinc-400">
                  Join ApexLift today. Every rep you log is a data point. Every data point is progress.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/20 transition-all hover:brightness-110 hover:shadow-amber-500/30"
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
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-10 text-center shadow-2xl shadow-amber-500/20 md:p-16">
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
            <Zap className="mx-auto mb-5 h-10 w-10 text-amber-950/60" strokeWidth={1.5} />
            <h2 className="mb-3 text-3xl font-black leading-tight tracking-tight text-zinc-950 md:text-5xl">
              Start your apex era.
            </h2>
            <p className="mx-auto mb-8 max-w-md text-amber-950/70">
              No excuses. No delays. Sign up free and log your first workout today.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-zinc-800"
            >
              Get started — it&apos;s free
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/15">
              <Dumbbell className="h-4 w-4 text-amber-500" strokeWidth={2.5} />
            </div>
            <span className="font-black">
              Apex<span className="text-amber-500">Lift</span>
            </span>
          </div>
          <p className="text-sm text-zinc-600">© 2026 ApexLift. Built for serious lifters.</p>
          <div className="flex gap-5 text-sm text-zinc-500">
            <Link to="/login" className="transition-colors hover:text-zinc-300">
              Log in
            </Link>
            <Link to="/register" className="transition-colors hover:text-zinc-300">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
