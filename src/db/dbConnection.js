import mongoose from "mongoose";
import { DB_NAME } from "../contants.js";

const  dbConnection = async () => {
    //console.log("dbconnection is called:",process.env.MONGODB_URI,DB_NAME);
    
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${ DB_NAME}`)
        if(connectionInstance){
            console.log("database connected successfully and host is " ,connectionInstance.connection.host)
        }
        else{
            console.log("Failed to connect to Mongodb database");
            process.exit(1);
        }
    } catch (error) {
        console.log("Failed to connect and error is ",error);
    }
}

export default dbConnection;