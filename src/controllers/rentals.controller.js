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
        if (!gameExists || !customerExists || !gamesInStock) {
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
        const { id } = req.params
        const returnDate = new Date().toISOString().slice(0, 10);
        const rentals = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id])
        const rentalsExists = rentals?.rowCount > 0
        if (!rentalsExists) {
            return res.status(404).send()
        }
        const isFinished = rentals.rows[0].returnDate !== null
        if (isFinished) {
            return res.status(400).send()
        }
        const oldRentDate = new Date(rentals?.rows[0]?.rentDate)
        const daysRented = rentals?.rows[0]?.daysRented
        const originalPrice = rentals?.rows[0]?.originalPrice 

        const hadGameForHowManyDays = Math.floor((Date.now()-oldRentDate) / (1000 * 60 * 60 * 24))
        let delayFee = (hadGameForHowManyDays - daysRented) * (originalPrice / daysRented) 
        if (delayFee<0){
            delayFee=0
        }
        await db.query(`UPDATE rentals SET "returnDate"=$1,"delayFee"=$2 WHERE id=$3;`, [returnDate, delayFee, id])
        res.send()
    } catch (e) {
        
        res.status(400).send(e)
        
    }
}
export async function deleteRentalController(req, res) {
    try {
        const { id } = req.params
        const rentals = await db.query(`SELECT "returnDate" FROM rentals WHERE id=$1;`, [id])
        const rentalsExists = rentals?.rowCount > 0
        if (!rentalsExists) {
            return res.status(404).send()
        }
        const alreadyReturned = rentals?.rows[0]?.returnDate !== null
        if (!alreadyReturned){
            return res.status(400).send()
        }
        await db.query(`DELETE FROM rentals WHERE id=$1;`, [id])
        res.send()
    } catch (e) {
        res.status(400).send(e)
    }
}
