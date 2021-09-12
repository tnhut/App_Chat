import express from "express";
import ConnectDb from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";

// Init app
let app= express();

// Connect MongoDb
ConnectDb();

// Config view Engine
configViewEngine(app);

// Enable postdata when request
app.use(bodyParser.urlencoded({extended:true}))

// Init all Routes
initRoutes(app);


app.listen(process.env.APP_PORT,process.env.APP_HOST, ()=>{
    console.log(`Listening: ${process.env.APP_PORT}`);
})