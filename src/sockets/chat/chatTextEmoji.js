import {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray} from "./../../helpers/socketHelper";

/**
 * @param {*} io from socket.io lib
 */
let chatTextEmoji=(io)=>{
    let clients={};
    io.on("connection", (socket)=>{
        
        clients=pushSocketIdToArray(clients,socket.request.user._id,socket.id);
        // Lấy ra groupId cua user roi push vao array
        socket.request.user.chatGroupIds.forEach(group=>{
            clients=pushSocketIdToArray(clients,group._id,socket.id);
        })
      
        socket.on("chat-text-emoji", (data)=>{
            console.log('data',data);
           if(data.groupId){
                let response={
                    currentGroupId:data.groupId,
                    currentUserId:socket.request.user._id,
                    message:data.message
                };

                // Check user xxx is Online and emit notifi
                if(clients[data.groupId]){               
                    emitNotifyToArray(clients,data.groupId,io,"response-chat-text-emoji",response);
                }
           }
           if(data.contactId){
                let response={
                    currentUserId:socket.request.user._id,
                    message:data.message
               };

                 // Check user xxx is Online and emit notifi
                if(clients[data.contactId]){               
                    emitNotifyToArray(clients,data.contactId,io,"response-chat-text-emoji",response);
                }
           }
                    
        });

        socket.on("disconnect",()=>{
            // remove socketId when disconnect
            clients=removeSocketIdFromArray(clients,socket.request.user._id,socket);
            socket.request.user.chatGroupIds.forEach(group=>{
                clients=removeSocketIdFromArray(clients,group._id,socket);
            })
        });

       
    })
};

module.exports=chatTextEmoji;