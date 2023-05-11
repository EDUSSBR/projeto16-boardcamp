import { Router } from 'express';
import { getGamesController, createGamesController } from '../controllers/games.controller.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { gameSchema } from '../schemas/gamesSchema.js';

const gameRouter = Router()

gameRouter.get('/games',  getGamesController)
gameRouter.post('/games', validateSchema(gameSchema), createGamesController)

export { gameRouter };