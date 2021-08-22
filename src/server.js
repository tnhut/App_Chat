import express from "express";
import ConnectDb from "./config/connectDB";
import ContactModel from "./models/contact.model";
let app= express();

// Connect MongoDb
ConnectDb();

app.get("/test-database", async(req,res)=>{

    try{
        let item={
            userId:"1788766",
            contactId:"122299877",
        }

        let contact=await ContactModel.createNew(item);
        res.send(contact);
    }
    catch(err){
        console.log(err);
    }
})

app.listen(process.env.APP_PORT,process.env.APP_HOST, ()=>{
    console.log("Listening");
})