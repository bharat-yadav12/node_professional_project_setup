import 'dotenv/config'
import dbConnection from './db/dbConnection.js';
import { app } from './app.js';
// const app = express();

dbConnection()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running on port ${process.env.PORT}`)
    })
    app.on("error",(err)=>{
        console.log("error", err)
    })
})
.catch((err)=>{
    console.log("mongo db connection failed",err)
})


app.get("/",(req,res)=>{
    res.send("<h1>hello world</h1>")
})