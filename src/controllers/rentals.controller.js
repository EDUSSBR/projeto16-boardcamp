import db from '../database/db.js'
export async function getRentalsController(req, res) {
    try {
        const rentals = await db.query(`select * from rentals;`)
        res.send(rentals.rows)
    } catch (e) {
        res.status(500).send({ error: "Problemas no servidor." })
    }
}
export async function createRentalsController(req, res) {
    try {
        const { customerId, gameId, daysRented } = req.body
        const rentDate = new Date().toISOString().slice(0, 10);
        const returnDate = null;
        const delayFee = null;
        const [customerInfo, gameInfo, rentalsCount] = await Promise.all([
            db.query(`SELECT id FROM customers WHERE id=$1;`, [customerId]),
            db.query(`SELECT "pricePerDay", "stockTotal" FROM games WHERE id=$1;`, [gameId]),
            db.query(`SELECT COUNT(*) FROM rentals WHERE "returnDate" IS NULL;`)
        ])
        const gameExists = gameInfo?.rowCount > 0
        const customerExists = customerInfo?.rowCount > 0
        const gamesInStock = Number(rentalsCount?.rows[0]?.count) < gameInfo?.rows[0]?.stockTotal
        if ( !gameExists || !customerExists || !gamesInStock ) {
            return res.status(400).send()
        }
        const originalPrice = gameInfo.rows[0].pricePerDay * daysRented
        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee])
        res.status(201).send()
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
}
export async function finishRentalController(req, res) {
    try {

    } catch (e) {

    }
}
export async function deleteRentalController(req, res) {
    try {

    } catch (e) {

    }
}
