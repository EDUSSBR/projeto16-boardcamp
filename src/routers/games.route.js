import { Router } from 'express';
import { getGamesController, createGamesController } from '../controllers/games.controller.js';

const gameRouter = Router()

gameRouter.get('/games', getGamesController)
gameRouter.post('/games', createGamesController)

export { gameRouter };