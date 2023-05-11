import db from '../database/db.js'

export async function getGamesController(req, res) {
    try {
        const games = await db.query(`select * from games;`)
        res.send(games.rows)
    } catch (e) {
        res.status(500).send({ error: "Problemas no servidor." })
    }
}
export async function createGamesController(req, res) {
    try {
        const { name, image, stockTotal, pricePerDay } = req.body
        
        const games =  await db.query(`SELECT name FROM games WHERE name=$1;`, [name])
        if (games.rowCount>0){
            return res.status(409).send()
        }
        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, [name, image, stockTotal, pricePerDay])
        res.status(201).send()
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
}
