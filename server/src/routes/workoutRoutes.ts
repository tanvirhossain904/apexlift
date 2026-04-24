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
import { protect, validateObjectIdParams } from '../middleware/auth';

const router = Router();

router.use(protect);

const validWorkoutId = validateObjectIdParams('workoutId');
const validWorkoutAndExerciseId = validateObjectIdParams('workoutId', 'exerciseId');

router.post('/', createWorkout);
router.get('/', getWorkouts);
router.get('/:workoutId', validWorkoutId, getWorkout);
router.put('/:workoutId', validWorkoutId, updateWorkout);
router.delete('/:workoutId', validWorkoutId, deleteWorkout);

router.post('/:workoutId/exercises', validWorkoutId, addExercise);
router.put('/:workoutId/exercises/:exerciseId', validWorkoutAndExerciseId, updateExercise);
router.delete('/:workoutId/exercises/:exerciseId', validWorkoutAndExerciseId, removeExercise);

export default router;
