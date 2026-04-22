import { Response } from 'express';
import { Types } from 'mongoose';
import Workout from '../models/Workout';
import { AuthRequest } from '../middleware/auth';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toObjectId = (id: string) => new Types.ObjectId(id);

const ownerFilter = (workoutId: string, userId: string) => ({
  _id: toObjectId(workoutId),
  userId: toObjectId(userId),
});

// ─── Workout CRUD ─────────────────────────────────────────────────────────────

// POST /api/workouts
export const createWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, date, programId, notes } = req.body;

  if (!name) {
    res.status(400).json({ message: 'Workout name is required' });
    return;
  }

  const workout = await Workout.create({
    userId: req.userId,
    name,
    date: date ?? new Date(),
    programId: programId ?? undefined,
    notes,
  });

  res.status(201).json(workout);
};

// GET /api/workouts  — supports ?programId=&from=&to= query params
export const getWorkouts = async (req: AuthRequest, res: Response): Promise<void> => {
  const { programId, from, to } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { userId: toObjectId(req.userId!) };

  if (programId) filter.programId = toObjectId(programId);
  if (from || to) {
    filter.date = {
      ...(from && { $gte: new Date(from) }),
      ...(to && { $lte: new Date(to) }),
    };
  }

  const workouts = await Workout.find(filter).sort({ date: -1 }).lean();
  res.json(workouts);
};

// GET /api/workouts/:workoutId
export const getWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  const { workoutId } = req.params as { workoutId: string };
  const workout = await Workout.findOne(ownerFilter(workoutId, req.userId!)).lean();

  if (!workout) {
    res.status(404).json({ message: 'Workout not found' });
    return;
  }

  res.json(workout);
};

// PUT /api/workouts/:workoutId  — update top-level fields only
export const updateWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  const { workoutId } = req.params as { workoutId: string };
  const { name, date, notes } = req.body;

  const workout = await Workout.findOneAndUpdate(
    ownerFilter(workoutId, req.userId!),
    { $set: { ...(name && { name }), ...(date && { date }), ...(notes !== undefined && { notes }) } },
    { new: true }
  );

  if (!workout) {
    res.status(404).json({ message: 'Workout not found' });
    return;
  }

  res.json(workout);
};

// DELETE /api/workouts/:workoutId
export const deleteWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  const { workoutId } = req.params as { workoutId: string };
  const result = await Workout.deleteOne(ownerFilter(workoutId, req.userId!));

  if (result.deletedCount === 0) {
    res.status(404).json({ message: 'Workout not found' });
    return;
  }

  res.status(204).send();
};

// ─── Exercise operations ──────────────────────────────────────────────────────

// POST /api/workouts/:workoutId/exercises
export const addExercise = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, muscleGroup, notes } = req.body;

  if (!name || !muscleGroup) {
    res.status(400).json({ message: 'Exercise name and muscleGroup are required' });
    return;
  }

  const { workoutId } = req.params as { workoutId: string };
  const workout = await Workout.findOneAndUpdate(
    ownerFilter(workoutId, req.userId!),
    { $push: { exercises: { name, muscleGroup, notes, sets: [] } } },
    { new: true }
  );

  if (!workout) {
    res.status(404).json({ message: 'Workout not found' });
    return;
  }

  res.status(201).json(workout);
};

// PUT /api/workouts/:workoutId/exercises/:exerciseId
// Accepts: { name?, muscleGroup?, notes?, sets? }
// Sending `sets` replaces the entire sets array for that exercise — this is
// intentional; sets have no _id so array replacement is the safe update path.
export const updateExercise = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, muscleGroup, notes, sets } = req.body;
  const { workoutId, exerciseId } = req.params as { workoutId: string; exerciseId: string };

  const update: Record<string, unknown> = {};
  if (name) update['exercises.$[ex].name'] = name;
  if (muscleGroup) update['exercises.$[ex].muscleGroup'] = muscleGroup;
  if (notes !== undefined) update['exercises.$[ex].notes'] = notes;
  if (sets !== undefined) update['exercises.$[ex].sets'] = sets;

  const workout = await Workout.findOneAndUpdate(
    ownerFilter(workoutId, req.userId!),
    { $set: update },
    {
      new: true,
      arrayFilters: [{ 'ex._id': toObjectId(exerciseId) }],
    }
  );

  if (!workout) {
    res.status(404).json({ message: 'Workout or exercise not found' });
    return;
  }

  res.json(workout);
};

// DELETE /api/workouts/:workoutId/exercises/:exerciseId
export const removeExercise = async (req: AuthRequest, res: Response): Promise<void> => {
  const { workoutId, exerciseId } = req.params as { workoutId: string; exerciseId: string };

  const workout = await Workout.findOneAndUpdate(
    ownerFilter(workoutId, req.userId!),
    { $pull: { exercises: { _id: toObjectId(exerciseId) } } },
    { new: true }
  );

  if (!workout) {
    res.status(404).json({ message: 'Workout or exercise not found' });
    return;
  }

  res.json(workout);
};
