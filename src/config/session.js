import session from "express-session";
import connectMongo from "connect-mongo";

let MongoStore=connectMongo(session);

/*
vairable is where save seesion, in this case is mongodb

*/ 
let seesionStore= new MongoStore({
    url:`${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    autoReconnect:true,
    //autoRemove:"native"
})
/*
Config Session for app
*/ 
let configSession=(app)=>{
    app.use(session({
        key:"express.id",
        secret:"mySecret",
        store:seesionStore,
        resave:true,
        saveUninitialized:false,
        cookie:{
            maxAge:1000*60*60*24
        }
    }))
};

module.exports=configSession;