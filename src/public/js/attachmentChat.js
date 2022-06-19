function attachmentChat(divId){
    $(`#attachment-chat-${divId}`).unbind("change").on("change", function(){
        let fileData=$(this).prop("files")[0];
       
        let limit=1048576; // byte=1M
        
        if(fileData.size >limit){
            alertify.notify("Tệp upload cho phép tối đa 1M","error",7);
            $(this).val(null);
            return false;
        }

        let targetId=$(this).data("chat");
        let isChatGroup=false;

        let messageFormData=new FormData();
        messageFormData.append("my-attachment-chat", fileData);
        messageFormData.append("uid", targetId);

        if($(this).hasClass("chat-in-group")){
            messageFormData.append("isChatGroup", true);
            isChatGroup=true;
        }

        $.ajax({
            url:"/message/add-new-attachment",
            type:"post",
            cache:false,
            contentType:false,
            processData:false,
            data:messageFormData,
            success:function(data){
                let dataToEmit={
                    message:data.message
                };
                
                // Step 01: Xử lý message data trước khi show
                let messageOfMe=$(`<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`);
               
                
                let attachtmentChat=`
                    <a href="data:${data.message.file.contentType}
                    ; base64, ${bufferToBase64(data.message.file.data.data)}" 
                    download="${data.message.file.fileName} ">
                    ${data.message.file.fileName}
                    </a>`;
                if(isChatGroup){
                    let senderAvatar=`<img src="/images/users/${data.message.sender.avatar}"
                    class="avatar-small" title="${data.message.sender.name}" />`;
                    messageOfMe.html(`${senderAvatar} ${attachtmentChat}`);
                    increaseNumberMessageGroup(divId);
                    dataToEmit.groupId=targetId;
                }
                else{
                    // Convert bieu tuong cam xuc thanh hinh anh                
                    messageOfMe.html(attachtmentChat);
                    dataToEmit.contactId=targetId;
                }

                // Step 02: Dua message data vào
                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                 // Step 03: No code

                 // Step 04: Thay đổi data khung chat bên trái để đồng bộ
                $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime")
                .html(
                    moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow())

                $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

                // Step 05: Di chuyển Converstation vừa chat lên top
                $(`.person[data-chat=${divId}]`).on("nhutdev.moveConversationToTop", function (){
                    let dataToMove=$(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("nhutdev.moveConversationToTop");
                });
                $(`.person[data-chat=${divId}]`).trigger("nhutdev.moveConversationToTop");

                 // Step 06: Emit Realtime
                 socket.emit("chat-attachment",dataToEmit);

                 // Step 07: No code
                // Step 08: No code

                //Step 09: Add to modal attatchment
             
                let attachmentChatToAddModal=`
                    <li>
                        <a href="data:${data.message.file.contentType}
                            ; base64, ${bufferToBase64(data.message.file.data.data)}" 
                            download="${data.message.file.fileName} ">
                            ${data.message.file.fileName}
                        </a>
                    </li>`;

                $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);

            },
            error:function(error){
                alertify.notify(error.responseText,"error",7);
               
            }
        })
    })
}

$(document).ready(function(){
    socket.on("response-chat-attachment",function(reponse){
        let divId="";

        // Step 01: Xử lý message data trước khi show
        let messageOfYou=$(`<div class="bubble you bubble-attachment-file" data-mess-id="${reponse.message._id}"></div>`);
       
        let attachtmentChat=`
            <a href="data:${reponse.message.file.contentType}
            ; base64, ${bufferToBase64(reponse.message.file.data.data)}" 
            download="${reponse.message.file.fileName} ">
            ${reponse.message.file.fileName}
            </a>`;

        if(reponse.currentGroupId){
            let senderAvatar=`<img src="/images/users/${reponse.message.sender.avatar}"
            class="avatar-small" title="${reponse.message.sender.name}" />`;
            messageOfYou.html(`${senderAvatar} ${attachtmentChat}`);
            divId=reponse.currentGroupId;
           

            if(reponse.currentUserId !==$("#dropdown-navbar-user").data("uid")){
               
                increaseNumberMessageGroup(divId);
             }
          
        }
        else{
            // Convert bieu tuong cam xuc thanh hinh anh                
            messageOfYou.html(attachtmentChat);
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
            moment(reponse.message.createdAt).locale("vi").startOf("seconds").fromNow());
         $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

         // Step 05: Di chuyển Converstation vừa chat lên top
        $(`.person[data-chat=${divId}]`).on("nhutdev.moveConversationToTop", function (){
            let dataToMove=$(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("nhutdev.moveConversationToTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("nhutdev.moveConversationToTop");

        //Step 6,7,8 No code

         //Step 09: Add to modal attachment
         if(reponse.currentUserId !==$("#dropdown-navbar-user").data("uid")){
           
            let attachmentChatToAddModal=`
                <li>
                    <a href="data:${reponse.message.file.contentType}
                        ; base64, ${bufferToBase64(reponse.message.file.data.data)}" 
                        download="${reponse.message.file.fileName} ">
                        ${reponse.message.file.fileName}
                    </a>
                </li>`;

            $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);
        }
    })
})