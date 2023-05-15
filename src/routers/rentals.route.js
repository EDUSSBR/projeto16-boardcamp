import { Router } from 'express';
import { getRentalsController,createRentalsController , finishRentalController, deleteRentalController} from '../controllers/rentals.controller.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { rentalSchema } from '../schemas/rentalSchema.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentalsController);
rentalsRouter.post('/rentals', validateSchema(rentalSchema), createRentalsController);
rentalsRouter.post('/rentals/:id/return', finishRentalController);
rentalsRouter.delete('/rentals/:id', deleteRentalController);

export { rentalsRouter };