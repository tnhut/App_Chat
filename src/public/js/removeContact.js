function removeContact(){
    $(".user-remove-contact").unbind("click").on("click", function(){
        // Dùng unbind de tranh bị goi nhieu lan
        let targetId=$(this).data("uid");
        let username=$(this).parent().find("div.user-name p").text();
        Swal.fire({
            title: `Bạn có chắc muốn xóa ${username} khỏi danh bạ ?`,
            text: "Bạn không thể hoàn tất lại quá trình này nhé",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2ECC71;',
            cancelButtonColor: 'ff7675',
            confirmButtonText: 'Xác nhận!',
            cancelButtonText: 'Hủy'
          }).then((result) => {
                if(!result.value){
                    
                    return false;
                }
                $.ajax({
                    url:"/contact/remove-contact",
                    type:"delete",
                    data:{uid:targetId},
                    success: function(data){
                        if(data.success){
                            $("#contacts").find(`ul li[data-uid=${targetId}]`).remove();
                            // Giảm so luong ben tab yeu cau ket ban
                            decreaseNumberNotifContact("count-contacts");
                            // Sau này làm chat thì quay lại bổ sung
        
                            socket.emit("remove-contact",{contactId:targetId});
                        }
                    }
                });
          })


        
    })

    
}

socket.on("response-remove-contact",function(user){
    $("#contacts").find(`ul li[data-uid=${user.id}]`).remove();
    // Giảm so luong ben tab yeu cau ket ban
    decreaseNumberNotifContact("count-contacts");
    // Sau này làm chat thì quay lại bổ sung
})

$(document).ready(function(){
    removeContact();
})
