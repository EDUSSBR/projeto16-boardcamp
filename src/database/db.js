import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;
let connection;

const configDatabase = {
    connectionString: process.env.DATABASE_URL,
};
if (process.env.MODE === "prod") configDatabase.ssl = true;

try{
    connection = new Pool(configDatabase);
    await connection.connect().then(()=>console.log("Postgres connected!"));
}catch(e) {
    console.log(e);
}

export default connection;