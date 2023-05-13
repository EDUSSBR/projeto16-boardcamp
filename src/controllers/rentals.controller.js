import db from '../database/db.js'
export async function getRentalsController(req, res) {
    try {
        let { customerId: queryCustomerID, gameId: queryGameID, offset, limit, order, desc, status } = req.query
        let rentals;
        const rentalColumns = ['id', 'customerId', 'rentDate', 'daysRented', 'returnDate', 'originalPrice', 'delayFee'];
        queryCustomerID = queryCustomerID || null;
        queryGameID = queryGameID || null;
        offset = Number(offset) || 0;
        limit = limit || null;
        const thereIsNoStatus = status !== 'open' && status !== 'closed';
        status = thereIsNoStatus ? null : status;
        const orderedColumnExists = rentalColumns.some(item => item === order)
        if (queryGameID || queryCustomerID || offset || limit || orderedColumnExists || !thereIsNoStatus || desc === "DESC") {
            let query = `SELECT r.id, r."customerId", r."gameId", r."rentDate", r."daysRented", r."returnDate", r."originalPrice", r."delayFee", c.name AS "customerName", g.name AS "gameName" 
            FROM rentals r  
            JOIN customers c ON r."customerId"=c.id 
            JOIN games g ON g.id=r."gameId"
            WHERE COALESCE(c.id = $1, TRUE) 
            AND COALESCE(g.id = $2, TRUE) 
            AND (CASE $5
                WHEN 'open' THEN r."returnDate" IS NULL
                WHEN 'closed' THEN r."returnDate" IS NOT NULL
                ELSE TRUE
              END)
            OFFSET $3
            LIMIT $4
            `
            if (orderedColumnExists) {
                query += ` ORDER BY ${order} ${desc === "true" ? "DESC" : "ASC"}`
            }
            query += ';'
            rentals = await db.query(query, [
                queryCustomerID,
                queryGameID,
                offset,
                limit,
                status])
        } else {
            rentals = await db.query(`SELECT r.id, r."customerId", r."gameId", r."rentDate", r."daysRented", r."returnDate", r."originalPrice", r."delayFee", c.name AS "customerName", g.name AS "gameName" 
            FROM rentals r  
            JOIN customers c ON r."customerId"=c.id 
            JOIN games g ON g.id=r."gameId";`)
        }
        const mappedRentals = rentals.rows.map(item => {
            return {
                id: item.id,
                customerId: item.customerId,
                gameId: item.gameId,
                rentDate: item.rentDate,
                daysRented: item.daysRented,
                returnDate: item.returnDate,
                originalPrice: item.originalPrice,
                delayFee: item.delayFee,
                customer: {
                    id: item.customerId,
                    name: item.customerName
                },
                game: {
                    id: item.gameId,
                    name: item.gameName
                }
            }
        })
        res.send(mappedRentals)
    } catch (e) {
        console.log(e)
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

        const hadGameForHowManyDays = Math.floor((Date.now() - oldRentDate) / (1000 * 60 * 60 * 24))
        let delayFee = (hadGameForHowManyDays - daysRented) * (originalPrice / daysRented)
        if (delayFee < 0) {
            delayFee = 0
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
        if (!alreadyReturned) {
            return res.status(400).send()
        }
        await db.query(`DELETE FROM rentals WHERE id=$1;`, [id])
        res.send()
    } catch (e) {
        res.status(400).send(e)
    }
}
