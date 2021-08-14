var express= require("express");
var app= express();

var hostname="localhost";
var port="8018";

app.get("/helloworld", (req,res)=>{
    res.send("<h1> HELLO YOU </h1>");
})

app.listen(port,hostname, ()=>{
    console.log("Listening");
})