import passportSocketIo from "passport.socketio";

let configSocketIo=(io,cookieParser,seesionStore)=>{
    io.use(passportSocketIo.authorize({
        cookieParser:cookieParser,
        key:process.env.SESSION_KEY,
        secret:process.env.SESSION_SECRET,
        store:seesionStore,
        success:(data,accept)=>{
           if(!data.user.logged_in){
               return accept("Invalid User",false);
           }
           return accept(null,true); 
        },
        fail:(data,message,error,accept)=>{
           if(error){
               console.log("failed connection to socketio",message);
               return accept(new Error(message),false);
           }
        }
    }))
};

module.exports=configSocketIo;