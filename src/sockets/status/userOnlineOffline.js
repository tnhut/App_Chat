import {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper";

/**
 * @param {*} io from socket.io lib
 */
let userOnlineOffline=(io)=>{
    let clients={};
    io.on("connection", (socket)=>{
        
        clients=pushSocketIdToArray(clients,socket.request.user._id,socket.id);
        // Lấy ra groupId cua user roi push vao array
        socket.request.user.chatGroupIds.forEach(group=>{
            clients=pushSocketIdToArray(clients,group._id,socket.id);
        })
        
        let listUserOnline=Object.keys(clients);
        //Step 01: Emit to user after login or f5 web
        socket.emit("server-send-list-users-online", listUserOnline);

        //Step 02: Emit to all another user when has new user online
        socket.broadcast.emit("server-send-when-new-user-online",socket.request.user._id);
        socket.on("disconnect",()=>{
            // remove socketId when disconnect
            clients=removeSocketIdFromArray(clients,socket.request.user._id,socket);
            socket.request.user.chatGroupIds.forEach(group=>{
                clients=removeSocketIdFromArray(clients,group._id,socket);
            })
            //Step 03: Emit to all another user when has new user Offline
            socket.broadcast.emit("server-send-when-new-user-offline",socket.request.user._id);
        });

       
    })
};

module.exports=userOnlineOffline;