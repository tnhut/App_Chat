
function textAndEmojiChat(divId){
    $(".emojionearea").unbind("keyup").on("keyup", function(element){
        let currentEmojoneArea=$(this);
        if(element.which===13){
            let targetId=$(`#write-chat-${divId}`).data("chat");
            let messageVal=$(`#write-chat-${divId}`).val();

            if(!targetId.length || !messageVal.length ){
                return false;
            }

            let dataTextEmojiForSend={
                uid:targetId,
                messageVal:messageVal
            };

            if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
                dataTextEmojiForSend.isChatGroup=true;
            }
        
            // Send message to server
            $.post("/message/add-new-text-emoji",dataTextEmojiForSend, function(data){
                let dataToEmit={
                    message:data.message
                };
                // Step 01: Xử lý message data trước khi show
                let messageOfMe=$(`<div class="bubble me" data-mess-id="${data.message._id}"></div>`);
                messageOfMe.text(data.message.text);
                let convertEmojiMessage=emojione.toImage(messageOfMe.html());
                if(dataTextEmojiForSend.isChatGroup){
                    let senderAvatar=`<img src="/images/users/${data.message.sender.avatar}"
                    class="avatar-small" title="${data.message.sender.name}" />`;
                    messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);
                    increaseNumberMessageGroup(divId);
                    dataToEmit.groupId=targetId;
                }
                else{
                    // Convert bieu tuong cam xuc thanh hinh anh                
                    messageOfMe.html(convertEmojiMessage);
                    dataToEmit.contactId=targetId;
                }   

                // Step 02: Dua message data vào
                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                // Step 03: Xóa các tin nhắn khi vừa nhắn xong tại khung text
                $(`#write-chat-${divId}`).val("");
                currentEmojoneArea.find(".emojionearea-editor").text("");

                // Step 04: Thay đổi data khung chat bên trái để đồng bộ
                $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime")
                .html(
                    moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow())

                $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

                 // Step 05: Di chuyển Converstation vừa chat lên top
                $(`.person[data-chat=${divId}]`).on("nhutdev.moveConversationToTop", function (){
                    let dataToMove=$(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("nhutdev.moveConversationToTop");
                });
                $(`.person[data-chat=${divId}]`).trigger("nhutdev.moveConversationToTop");

                // Step 06: Emit Realtime
                socket.emit("chat-text-emoji",dataToEmit);

                // Step 07: Emit remove typing real-time
                typingOff(divId);

                // Step 08: If this is typing, remove it
                let checkTyping=$(`.chat[data-chat=${divId}]`).find("div.buble-typing-gif");
                if(checkTyping.length){
                    checkTyping.remove();
                }

            }).fail(function(err){
                alertify.notify(err.responseText,"error",7);
            })
        }
    })
}

$(document).ready(function(){
    socket.on("response-chat-text-emoji",function(reponse){
        let divId="";
      
        // Step 01: Xử lý message data trước khi show
        let messageOfYou=$(`<div class="bubble you" data-mess-id="${reponse.message._id}"></div>`);
        messageOfYou.text(reponse.message.text);
        let convertEmojiMessage=emojione.toImage(messageOfYou.html());
        if(reponse.currentGroupId){
            let senderAvatar=`<img src="/images/users/${reponse.message.sender.avatar}"
            class="avatar-small" title="${reponse.message.sender.name}" />`;
            messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);
            divId=reponse.currentGroupId;
            
            if(reponse.currentUserId !==$("#dropdown-navbar-user").data("uid")){
               
                increaseNumberMessageGroup(divId);
             }
          
        }
        else{
            // Convert bieu tuong cam xuc thanh hinh anh                
            messageOfYou.html(convertEmojiMessage);
            divId=reponse.currentUserId
        }

         // Step 02: Dua message data vào
         // Nếu la cuộc tro chuyen ca nhan thi moi append vao
         if(reponse.currentUserId !==$("#dropdown-navbar-user").data("uid")){
            $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
            nineScrollRight(divId);
            $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
         }
        

        // Step 03: Xóa các tin nhắn khi vừa nhắn xong tại khung text
        // Bước này bỏ qua vì mình đang bat event realtime nên ko càn

         // Step 04: Thay đổi data khung chat bên trái để đồng bộ
         $(`.person[data-chat=${divId}]`).find("span.time").html(
            moment(reponse.message.createdAt).locale("vi").startOf("seconds").fromNow())

        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(reponse.message.text));

        // Step 05: Di chuyển Converstation vừa chat lên top
        $(`.person[data-chat=${divId}]`).on("nhutdev.moveConversationToTop", function (){
            let dataToMove=$(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("nhutdev.moveConversationToTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("nhutdev.moveConversationToTop");

    })
})