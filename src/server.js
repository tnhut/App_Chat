import express from "express";
import ConnectDb from "./config/connectDB";
import configViewEngine from "./config/viewEngine";

// Init app
let app= express();

// Connect MongoDb
ConnectDb();

// Config view Engine
configViewEngine(app);

app.get("/", (req,res)=>{

   return res.render("main/master");
})

app.get("/login-register", (req,res)=>{

    return res.render("auth/loginRegister");
 })

app.listen(process.env.APP_PORT,process.env.APP_HOST, ()=>{
    console.log(`Listening: ${process.env.APP_PORT}`);
})