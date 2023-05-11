import db from '../database/db.js'

export async function getGamesController(req, res) {
    try {
        const games = await db.query(`select * from games;`)
        res.send(games.rows)
    } catch (e) {
        res.status(500).send({ error: "Problemas no servidor."})
    }
}
export async function createGamesController(req, res) {
    try {

    } catch (e) {

    }
}


// gameRouter.get('/games', getGamesController)
// gameRouter.post('/games', createGamesController)