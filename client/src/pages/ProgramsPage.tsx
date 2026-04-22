import { BookOpen } from 'lucide-react';
import Layout from '../components/Layout';

export default function ProgramsPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Programs</h1>
      <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-12 text-center">
        <BookOpen size={40} className="text-zinc-600 mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Coming soon</h2>
        <p className="text-zinc-400 text-sm max-w-sm mx-auto">
          Programs let you group workouts into structured training blocks (e.g. 12-week strength cycle).
          Track volume and progression across the full program.
        </p>
        <span className="inline-block mt-4 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
          In roadmap
        </span>
      </div>
    </Layout>
  );
}
