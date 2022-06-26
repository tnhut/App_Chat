import express from "express";
import ConnectDb from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParser from "cookie-parser";
import configSocketIo from "./config/socketio";
import events from "events";
import * as configApp from "./config/app";

// import pem from "pem";
// import https from "https";

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//     if (err) {
//       throw err
//     }
//     // Init app
//     let app= express();

//     // Connect MongoDb
//     ConnectDb();

//     // Config session
//     configSession(app);

//     // Config view Engine
//     configViewEngine(app);

//     // Enable postdata when request
//     app.use(bodyParser.urlencoded({extended:true}))

//     // Enable Flash message
//     app.use(connectFlash());

//     // Config passport
//     app.use(passport.initialize());
//     app.use(passport.session());

//     // Init all Routes
//     initRoutes(app);
   
//     https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT,process.env.APP_HOST, ()=>{
//         console.log(`Listening: ${process.env.APP_PORT}`);
//     });
// })


 // Init app
 let app= express();

 // Set max connection event listeners
 events.EventEmitter.defaultMaxListeners=configApp.app.max_event_listeners;

 // Init server with socket.io & express app
 let server=http.createServer(app); 
 let io=socketio(server);
 // Connect MongoDb
 ConnectDb();

 // Config session
 session.config(app);

 // Config view Engine
 configViewEngine(app);

 // Enable postdata when request
 app.use(bodyParser.urlencoded({extended:true}))

 // Enable Flash message
 app.use(connectFlash());

 // User Cookie Parser
 app.use(cookieParser()); 

 // Config passport
 app.use(passport.initialize());
 app.use(passport.session());

 // Init all Routes
 initRoutes(app);

 //Config for socketIo
 configSocketIo(io,cookieParser,session.seesionStore);

 // Init all Sockets
 initSockets(io);

 server.listen(process.env.APP_PORT,process.env.APP_HOST, ()=>{
    console.log(`Listening: ${process.env.APP_PORT}`);
})