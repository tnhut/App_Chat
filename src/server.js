import express from "express";
import ConnectDb from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";

// Init app
let app= express();

// Connect MongoDb
ConnectDb();

// Config session
configSession(app);

// Config view Engine
configViewEngine(app);

// Enable postdata when request
app.use(bodyParser.urlencoded({extended:true}))

// Enable Flash message
app.use(connectFlash());

// Init all Routes
initRoutes(app);


app.listen(process.env.APP_PORT,process.env.APP_HOST, ()=>{
    console.log(`Listening: ${process.env.APP_PORT}`);
})