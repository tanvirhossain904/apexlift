import { Types } from 'mongoose';
import Workout, { IExercise, IExerciseSet } from '../models/Workout';

export type ProgressionStatus = 'progressed' | 'maintained' | 'regressed' | 'new';

export interface ProgressionResult {
  exerciseName: string;
  status: ProgressionStatus;
  currentVolume: number;
  previousVolume: number | null;
  delta: number | null;
}

// Escape special regex characters so user-supplied exercise names are safe
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const exerciseVolume = (exercises: IExercise[], name: string): number => {
  const ex = exercises.find(
    (e) => e.name.toLowerCase() === name.toLowerCase()
  );
  if (!ex) return 0;
  return ex.sets.reduce((sum: number, s: IExerciseSet) => sum + s.weight * s.reps, 0);
};

// Compare the last two workouts that contained this exercise.
// Returns 'new' until there are at least two data points to compare.
export const getExerciseProgression = async (
  userId: string,
  exerciseName: string,
  programId?: string
): Promise<ProgressionResult> => {
  const filter: Record<string, unknown> = {
    userId: new Types.ObjectId(userId),
    'exercises.name': { $regex: new RegExp(`^${escapeRegex(exerciseName)}$`, 'i') },
  };
  if (programId) filter.programId = new Types.ObjectId(programId);

  const workouts = await Workout.find(filter).sort({ date: -1 }).limit(2).lean();

  if (workouts.length === 0) {
    return { exerciseName, status: 'new', currentVolume: 0, previousVolume: null, delta: null };
  }

  const current = exerciseVolume(workouts[0].exercises as IExercise[], exerciseName);

  if (workouts.length === 1) {
    return { exerciseName, status: 'new', currentVolume: current, previousVolume: null, delta: null };
  }

  const previous = exerciseVolume(workouts[1].exercises as IExercise[], exerciseName);
  const delta = current - previous;
  const status: ProgressionStatus =
    delta > 0 ? 'progressed' : delta < 0 ? 'regressed' : 'maintained';

  return { exerciseName, status, currentVolume: current, previousVolume: previous, delta };
};
