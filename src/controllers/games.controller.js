import db from '../database/db.js';

export async function getGamesController(req, res) {
    try {
        let { name, offset, limit, order, desc } = req.query;
        const gameColumns = [ 'name', 'image', 'stockTotal', 'pricePerDay'];
        let games;
        name = name || "";
        offset = Number(offset) || 0;
        limit = limit || null;
        const gameColumnIndex = gameColumns.indexOf(order);
        const orderForQuery = gameColumnIndex === -1 ? null :
        gameColumns[gameColumnIndex]==='stockTotal' ? '"stockTotal"':
        gameColumns[gameColumnIndex]==='pricePerDay' ? '"pricePerDay"':
        gameColumns[gameColumnIndex];
        console.log(orderForQuery);
        if (name || offset || limit || order!==undefined ) {
            let query = `SELECT * FROM games WHERE name ILIKE $1||'%'
            ORDER BY ${orderForQuery || 'id'} ${desc === 'true' ? 'DESC' : 'ASC'}
            OFFSET $2 LIMIT $3;`;
            console.log(query);
            games = await db.query(query, [name, offset, limit]);
        } else {
            games = await db.query(`SELECT * FROM games;`);
        }
        res.send(games.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: "Problemas no servidor." });
    }
}
export async function createGamesController(req, res) {
    try {
        const { name, image, stockTotal, pricePerDay } = req.body;

        const games = await db.query(`SELECT name FROM games WHERE name=$1;`, [name]);
        if (games.rowCount > 0) {
            return res.status(409).send();
        }
        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, [name, image, stockTotal, pricePerDay]);
        res.status(201).send();
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}
