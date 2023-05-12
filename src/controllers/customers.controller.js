import db from '../database/db.js'
export async function getCustomersController (req,res){
    try {
        const { cpf } = req.query
        let customers;
        if (cpf){
            customers = await db.query(`SELECT * FROM customers WHERE cpf LIKE $1||'%';`,[cpf])
        } else {
            customers =await db.query(`SELECT * FROM customers;`)
        }
        res.send(customers.rows)
    } catch (e) {
        res.status(500).send({ error: "Problemas no servidor."})
    }
}
export async function getCustomersByIDController (req,res){
    try {
        const { id } = req.params
        const customers =  await db.query(`SELECT * FROM customers WHERE id=$1;`, [id])
        if(customers.rowCount===0){
            return res.status(404).send()
        }
        res.send(customers.rows[0])
    } catch (e) {
        res.status(400).send()
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
        const { name, phone, cpf, birthday } = req.body
        const { id } = req.params
        const cpfInfo =  await db.query(`SELECT cpf FROM customers WHERE cpf=$1 and id<>$2;`, [cpf, id])
        const cpfExists = cpfInfo.rowCount > 0
        if(cpfExists){
            return res.status(409).send()
        } 
        await db.query(`UPDATE customers SET name=$1,phone=$2,cpf=$3,birthday=$4 WHERE id=$5;`, [name, phone, cpf, birthday,id])
        res.send("passou")
    } catch (e) {
        res.status(400).send(e)
        
    }
}
