import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config()
const { Pool } = pg;
let connection;
try{
    connection = new Pool({
        connectionString: process.env.DATABASE_URL,
    });
    await connection.connect().then(()=>console.log("Postgres connected!"))
}catch(e) {
    console.log(e)
}

export default connection;