
$(document).ready(function(){
    // link at icon notifaction
    $("#popup-mark-notif-as-read").bind("click",function(){
        let targetUser=[];
        $(".noti_content").find("div.notif-readed-false").each((index,notification)=>{
            targetUser.push($(notification).data("uid"))
        });
        if(!targetUser.length){
            alertify.notify("Bạn không còn thông báo nào chưa đọc","error",7);
            return false;
        }
        markNotificationsAsRead(targetUser);
    })
    // link at popup modal
    $("#modal-mark-notif-as-read").bind("click",function(){
        let targetUser=[];
        $("ul.list-notifications").find("li>div.notif-readed-false").each((index,notification)=>{
            targetUser.push($(notification).data("uid"))
        });
        if(!targetUser.length){
            alertify.notify("Bạn không còn thông báo nào chưa đọc","error",7);
            return false;
        }
        markNotificationsAsRead(targetUser);
    })
})

function markNotificationsAsRead(targetUsers){
    $.ajax({
        url:"/notification/mark-all-as-read",
        type:"put",
        data:{targetUsers:targetUsers},
        success:function(result){
            if(result){
                targetUsers.forEach((uid)=>{
                    $(".noti_content").find(`div[data-uid=${uid}]`).removeClass("notif-readed-false");
                    $("ul.list-notifications").find(`li>div[data-uid=${uid}]`).removeClass("notif-readed-false");
                });
                decreaseNumberNotification("noti_counter",targetUsers.length);
            }
        }
    });
}
