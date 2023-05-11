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
        const { name, phone, cpf, birthday } = req.body
        
        const customers =  await db.query(`SELECT name FROM customers WHERE cpf=$1;`, [cpf])
        if (customers.rowCount>0){
            return res.status(409).send()
        }
        await db.query(`INSERT INTO customers (name, phone, cpf, birthday ) VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday ])
        res.status(201).send()
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
}
export async function updateCustomersByIDController (req,res){
    try {
        
    } catch (e) {
        
    }
}
