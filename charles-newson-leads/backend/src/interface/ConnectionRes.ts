import {  MongoClient } from "mongodb";

export default interface ConnectionRes {
    error: string;
    message: string;
    conn: MongoClient | string;
}