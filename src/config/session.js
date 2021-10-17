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
let config=(app)=>{
    app.use(session({
        key:process.env.SESSION_KEY,
        secret:process.env.SESSION_SECRET,
        store:seesionStore,
        resave:true,
        saveUninitialized:false,
        cookie:{
            maxAge:1000*60*60*24
        }
    }))
};

module.exports={
    config:config,
    seesionStore:seesionStore
};