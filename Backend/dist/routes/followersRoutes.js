"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const followersController_1 = require("../controllers/followersController");
const router = express_1.default.Router();
// Route to make a user follow a vacation
router.post('/follow/:vacationId', followersController_1.followVacation);
// Route to make a user unfollow a vacation
router.post('/unfollow/:vacationId', followersController_1.unfollowVacation);
// Route to get all vacations with followers count for each
router.get('/vacations', followersController_1.getAllVacationsWithFollowers);
// Route to download all vacations with followers count for each as CSV
router.get('/download-vacations-csv', followersController_1.downloadVacationsWithFollowersAsCsv);
exports.default = router;
