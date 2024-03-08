"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vacationController_1 = require("../controllers/vacationController");
const router = express_1.default.Router();
// Route to get vacations with pagination
router.get('/', vacationController_1.getVacations);
// Route to get vacations image
router.get('/image', vacationController_1.getImage);
// Route to add a new vacation
router.post('/add', vacationController_1.addVacation);
// Route to edit an existing vacation
router.put('/edit/:id', vacationController_1.editVacation);
// Route to delete a vacation
router.delete('/remove/:id', vacationController_1.deleteVacation);
exports.default = router;
