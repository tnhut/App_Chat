export let pushSocketIdToArray=(clients,userId,socketId)=>{
    // Check exists currentUserId and push socketId to array
    if(clients[userId]){
        clients[userId].push(socketId);
    }else{
        clients[userId]=[socketId];
    }
    return clients;
};

export let emitNotifyToArray=(clients,userId,io,eventName,data)=>{
    clients[userId].forEach(socketId=>io.sockets.connected[socketId].emit(eventName,data));
    
};

export let removeSocketIdFromArray=(clients,userId,socket)=>{
    // remove socketId when disconnect
    clients[userId]=clients[userId].filter(socketId=>socketId!==socket.id);

    if(!clients[userId].length){
        delete clients[userId];
    }
    return clients;
};