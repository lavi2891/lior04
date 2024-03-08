import express from 'express';
import {
  followVacation,
  unfollowVacation,
  getAllVacationsWithFollowers,
  downloadVacationsWithFollowersAsCsv,
} from '../controllers/followersController';

const router = express.Router();

// Route to make a user follow a vacation
router.post('/follow/:vacationId', followVacation);

// Route to make a user unfollow a vacation
router.post('/unfollow/:vacationId', unfollowVacation);

// Route to get all vacations with followers count for each
router.get('/vacations', getAllVacationsWithFollowers);

// Route to download all vacations with followers count for each as CSV
router.get('/download-vacations-csv', downloadVacationsWithFollowersAsCsv);

export default router;
