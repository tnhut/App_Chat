import express from "express";
import ConnectDb from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";

// Init app
let app= express();

// Connect MongoDb
ConnectDb();

// Config view Engine
configViewEngine(app);

// Init all Routes
initRoutes(app);


app.listen(process.env.APP_PORT,process.env.APP_HOST, ()=>{
    console.log(`Listening: ${process.env.APP_PORT}`);
})