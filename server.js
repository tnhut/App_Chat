import express from "express";
let app= express();

let hostname="localhost";
let port="8018";

app.get("/helloworld", (req,res)=>{
    res.send("<h1> HELLO YOU </h1>");
})

app.listen(port,hostname, ()=>{
    console.log("Listening");
})