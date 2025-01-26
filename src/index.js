import 'dotenv/config'
import express from "express"
import dbConnection from './db/dbConnection.js';
const app = express();

dbConnection();

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})