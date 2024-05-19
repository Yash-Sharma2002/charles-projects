import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';


dotenv.config({ path: './data.env' })


export async function closeConn(conn : MongoClient) {
    conn.close();    
}