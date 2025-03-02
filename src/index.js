import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app,server } from "./app.js";

dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log(("ERR:",error));
        throw error
        
    })
    server.listen(process.env.PORT||8000)
    console.log("server is running at port ",process.env.PORT)
})
.catch((err)=>{
    console.log("mongo db connection failed ",err)
}
)