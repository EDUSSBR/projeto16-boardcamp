import { Router } from 'express';
import { getRentalsController,createRentalsController , finishRentalController, deleteRentalController} from '../controllers/rentals.controller.js';

const rentalsRouter = Router()

rentalsRouter.get('/rentals', getRentalsController)
rentalsRouter.post('/rentals', createRentalsController)
rentalsRouter.post('/rentals/:id/return', finishRentalController)
rentalsRouter.delete('/rentals/:id', deleteRentalController)

export { rentalsRouter };