import { Response } from 'express';
import { Types } from 'mongoose';
import Workout from '../models/Workout';
import { getExerciseProgression } from '../services/progressionService';
import { AuthRequest } from '../middleware/auth';

interface WeeklyVolumePoint {
  _id: { year: number; week: number };
  totalVolume: number;
  workoutCount: number;
}

interface MuscleDistributionPoint {
  muscleGroup: string;
  totalVolume: number;
  totalSets: number;
}

const parseDateParam = (v: unknown): Date | null => {
  if (typeof v !== 'string') return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

// GET /api/analytics/volume/weekly?from=&to=
// Returns ISO-week volume totals for the authenticated user as a time series.
export const getWeeklyVolume = async (req: AuthRequest, res: Response): Promise<void> => {
  const from = parseDateParam(req.query.from);
  const to = parseDateParam(req.query.to);

  const dateFilter: Record<string, Date> = {};
  if (from) dateFilter.$gte = from;
  if (to) dateFilter.$lte = to;

  const matchStage: Record<string, unknown> = {
    userId: new Types.ObjectId(req.userId!),
  };
  if (Object.keys(dateFilter).length > 0) matchStage.date = dateFilter;

  const results = await Workout.aggregate<WeeklyVolumePoint>([
    { $match: matchStage },
    {
      $addFields: {
        isoWeek: { $isoWeek: '$date' },
        isoWeekYear: { $isoWeekYear: '$date' },
      },
    },
    { $unwind: '$exercises' },
    { $unwind: '$exercises.sets' },
    {
      $group: {
        _id: { year: '$isoWeekYear', week: '$isoWeek' },
        totalVolume: {
          $sum: { $multiply: ['$exercises.sets.weight', '$exercises.sets.reps'] },
        },
        workoutIds: { $addToSet: '$_id' },
      },
    },
    { $addFields: { workoutCount: { $size: '$workoutIds' } } },
    { $sort: { '_id.year': 1, '_id.week': 1 } },
    { $project: { workoutIds: 0 } },
  ]);

  res.json(results);
};

// GET /api/analytics/muscle-distribution?from=&to=
// Returns total volume and set counts grouped by muscle group for the authenticated user.
export const getMuscleDistribution = async (req: AuthRequest, res: Response): Promise<void> => {
  const from = parseDateParam(req.query.from);
  const to = parseDateParam(req.query.to);

  const dateFilter: Record<string, Date> = {};
  if (from) dateFilter.$gte = from;
  if (to) dateFilter.$lte = to;

  const matchStage: Record<string, unknown> = {
    userId: new Types.ObjectId(req.userId!),
  };
  if (Object.keys(dateFilter).length > 0) matchStage.date = dateFilter;

  const results = await Workout.aggregate<MuscleDistributionPoint>([
    { $match: matchStage },
    { $unwind: '$exercises' },
    { $unwind: '$exercises.sets' },
    {
      $group: {
        _id: '$exercises.muscleGroup',
        totalVolume: {
          $sum: { $multiply: ['$exercises.sets.weight', '$exercises.sets.reps'] },
        },
        totalSets: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        muscleGroup: '$_id',
        totalVolume: 1,
        totalSets: 1,
      },
    },
    { $sort: { totalVolume: -1 } },
  ]);

  res.json(results);
};

// GET /api/analytics/progression?exerciseName=Squat&programId=
export const getProgression = async (req: AuthRequest, res: Response): Promise<void> => {
  const { exerciseName, programId } = req.query;

  if (typeof exerciseName !== 'string' || !exerciseName.trim()) {
    res.status(400).json({ message: 'exerciseName query param is required' });
    return;
  }

  if (programId !== undefined) {
    if (typeof programId !== 'string' || !Types.ObjectId.isValid(programId)) {
      res.status(400).json({ message: 'Invalid programId' });
      return;
    }
  }

  const result = await getExerciseProgression(
    req.userId!,
    exerciseName,
    typeof programId === 'string' ? programId : undefined
  );
  res.json(result);
};
