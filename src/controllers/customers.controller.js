import db from '../database/db.js'
export async function getCustomersController (req,res){
    try {
        const customers = await db.query(`select * from customers;`)
        res.send(customers.rows)
    } catch (e) {
        res.status(500).send({ error: "Problemas no servidor."})
    }
}
export async function getCustomersByIDController (req,res){
    try {
        
    } catch (e) {
        
    }
}
export async function createCustomersController (req,res){
    try {
        
    } catch (e) {
        
    }
}
export async function updateCustomersByIDController (req,res){
    try {
        
    } catch (e) {
        
    }
}
