function approveRequestContactReceived(){
    $(".user-approve-request-contact-received").unbind("click").on("click", function(){
        // Dùng unbind de tranh bị goi nhieu lan
        let targetId=$(this).data("uid");
        
        $.ajax({
            url:"/contact/approve-request-contact-received",
            type:"put",
            data:{uid:targetId},
            success: function(data){
                if(data.success){
                    let userInfo=$("#request-contact-received").find(`ul li[data-uid=${targetId}]`);
                    $(userInfo).find("div.user-approve-request-contact-received").remove();
                    $(userInfo).find("div.user-remove-request-contact-received").remove();
                    $(userInfo).find("div.contactPanel")
                    .append(`
                        <div class="user-talk" data-uid="${targetId}">
                            Trò chuyện
                        </div>
                        <div class="user-remove-contact action-danger" data-uid="${targetId}">
                            Xóa liên hệ
                        </div>`);
                    
                    let userInfoHtml=userInfo.get(0).outerHTML; 
                    $("#contacts").find("ul").prepend(userInfoHtml);
                    $(userInfo).remove();
                    // Giảm so luong ben tab yeu cau ket ban
                    decreaseNumberNotifContact("count-request-contact-received");
                    // Tăng so luong ben tab Danh bạ
                    increaseNumberNotifContact("count-contacts");
                    // Giảm so luong thông báo ngoài icon
                    decreaseNumberNotification("noti_contact_counter",1);

                    removeContact();// Khởi tạo hàm xóa liên hệ

                    // Sau này làm chat thì quay lại bổ sung


                    socket.emit("approve-request-contact-received",{contactId:targetId});
                }
            }
        });
    })

    
}

socket.on("response-approve-request-contact-received",function(user){
    let notif=` <div class="notif-readed-false" data-uid="${user.id}">
                    <img class="avatar-small" src="images/users/${user.avatar}"alt="">
                    <strong>${ user.username }</strong> đã chấp nhận lời mời kết bạn!
                </div>`;
    // popup notif
    $(".noti_content").prepend(notif);
    // modal notif
    $("ul.list-notifications").prepend(`<li>${notif}</li>`)

    decreaseNumberNotification("noti_contact_counter",1);
    increaseNumberNotification("noti_counter",1);

    // Giảm so luong ben tab dang cho xac nhan
    decreaseNumberNotifContact("count-request-contact-sent");
    // Tăng so luong ben tab Danh bạ
    increaseNumberNotifContact("count-contacts");

    $("#request-contact-sent").find(`ul li[data-uid=${user.id}]`).remove();
    $("#find-user").find(`ul li[data-uid=${user.id}]`).remove();
    let userInfoHtml=`
        <li class="_contactList" data-uid="${user.id}">
            <div class="contactPanel">
                <div class="user-avatar">
                    <img src="images/users/${user.avatar}" alt="">
                </div>
                <div class="user-name">
                    <p>
                        ${user.username}
                    </p>
                </div>
                <br>
                <div class="user-address">
                    <span>&nbsp ${user.address}.</span>
                </div>
                <div class="user-talk" data-uid="${user.id}">
                    Trò chuyện
                </div>
                <div class="user-remove-contact action-danger" data-uid="${user.id}">
                    Xóa liên hệ
                </div>
            </div>
        </li>
    `
    $("#contacts").find("ul").prepend(userInfoHtml);

    removeContact();// Khởi tạo hàm xóa liên hệ
    
     // Sau này làm chat thì quay lại bổ sung
})

$(document).ready(function(){
    approveRequestContactReceived();
})
