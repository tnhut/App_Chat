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
                // Step 01: Xử lý message data trước khi show
                let messageOfMe=$(`<div class="bubble me data-mess-id="${data.message._id}"></div>`);
                if(dataTextEmojiForSend.isChatGroup){
                    messageOfMe.html(`<img src="/images/users/${data.message.sender.avatar}"
                    class="avatar-small" title="${data.message.sender.name}`);
                    messageOfMe.text(data.message.text);
                    increaseNumberMessageGroup(divId);
                }
                else{
                    messageOfMe.text(data.message.text);
                }

                // Convert bieu tuong cam xuc thanh hinh anh
                let convertEmojiMessage=emojione.toImage(messageOfMe.html());
                messageOfMe.html(convertEmojiMessage);

                // Step 02: Dua message data vào
                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                // Step 03: Xóa các tin nhắn khi vừa nhắn xong tại khung text
                $(`#write-chat-${divId}`).val("");
                currentEmojoneArea.find(".emojionearea-editor").text("");

                // Step 04: Thay đổi data khung chat bên trái để đồng bộ
                $(`.person[data-chat=${divId}]`).find("span.time").html(
                    moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow())

                $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

                // Step 05: Di chuyển Converstation vừa chat lên top
                $(`.person[data-chat=${divId}]`).on("click.moveConversationToTop", function (){
                    let dataToMove=$(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("click.moveConversationToTop");
                })
                $(`.person[data-chat=${divId}]`).click();

                // Step 06: Emit Realtime

            }).fail(function(err){
                alertify.notify(err.responseText,"error",7);
            })
        }
    })
}