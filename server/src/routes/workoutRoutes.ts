import { Router } from 'express';
import {
  createWorkout,
  getWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  addExercise,
  updateExercise,
  removeExercise,
} from '../controllers/workoutController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect); // all workout routes require auth

router.post('/', createWorkout);
router.get('/', getWorkouts);
router.get('/:workoutId', getWorkout);
router.put('/:workoutId', updateWorkout);
router.delete('/:workoutId', deleteWorkout);

router.post('/:workoutId/exercises', addExercise);
router.put('/:workoutId/exercises/:exerciseId', updateExercise);
router.delete('/:workoutId/exercises/:exerciseId', removeExercise);

export default router;
