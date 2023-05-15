import { Router } from "express";
import { gameRouter } from "./games.route.js";
import { customerRouter } from "./customers.route.js";
import { rentalsRouter } from "./rentals.route.js";

const route = Router();

route.use(gameRouter);
route.use(customerRouter);
route.use(rentalsRouter);

export default route;