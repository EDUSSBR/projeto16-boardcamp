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

    } catch (e) {

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
