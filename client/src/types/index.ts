export interface User {
  id: string;
  name: string;
  email: string;
  preferredUnit: 'kg' | 'lbs';
}

export interface ExerciseSet {
  reps: number;
  weight: number;
  rpe?: number;
}

export interface Exercise {
  _id: string;
  name: string;
  muscleGroup: string;
  sets: ExerciseSet[];
  notes?: string;
}

export interface Workout {
  _id: string;
  userId: string;
  programId?: string;
  name: string;
  date: string;
  exercises: Exercise[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyVolumePoint {
  _id: { year: number; week: number };
  totalVolume: number;
  workoutCount: number;
}

export interface MuscleDistributionPoint {
  muscleGroup: string;
  totalVolume: number;
  totalSets: number;
}

export type ProgressionStatus = 'progressed' | 'maintained' | 'regressed' | 'new';

export interface ProgressionResult {
  exerciseName: string;
  status: ProgressionStatus;
  currentVolume: number;
  previousVolume: number | null;
  delta: number | null;
}
