import { Router } from 'express';
import { getWeeklyVolume, getProgression } from '../controllers/analyticsController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/volume/weekly', getWeeklyVolume);
router.get('/progression', getProgression);

export default router;
