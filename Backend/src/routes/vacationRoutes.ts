import express from 'express';
import { getVacations, addVacation, editVacation, deleteVacation, getImage } from '../controllers/vacationController';


const router = express.Router();
// Route to get vacations with pagination
router.get('/', getVacations);

// Route to get vacations image
router.get('/image', getImage);

// Route to add a new vacation
router.post('/add', addVacation);

// Route to edit an existing vacation
router.put('/edit/:id', editVacation);

// Route to delete a vacation
router.delete('/remove/:id', deleteVacation);

export default router;