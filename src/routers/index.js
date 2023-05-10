import { Router } from "express"
import { gameRouter } from "./games.route"
import { customerRouter } from "./customers.route"
import { rentalsRouter } from "./rentals.route"

const route = Router()

route.use(gameRouter)
route.use(customerRouter)
route.use(rentalsRouter)

export default route;