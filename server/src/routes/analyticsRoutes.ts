import { Router } from 'express';
import { getWeeklyVolume, getMuscleDistribution, getProgression } from '../controllers/analyticsController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/volume/weekly', getWeeklyVolume);
router.get('/muscle-distribution', getMuscleDistribution);
router.get('/progression', getProgression);

export default router;
