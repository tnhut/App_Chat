let userAvatar=null;
let userInfo={};
let originAvatarSrc=null;
function updateUserInfo(){
    $("#input-change-avatar").bind("change", function(){
        let fileData=$(this).prop("files")[0];
        let match=["image/png","image/jpg","image/jpeg"];
        let limit=1048576; // byte=1M

        // if($.inArray(fileData.type,match)===-1){
        //     alertify.notify("Kiểu File không hợp lệ","error",7);
        //     $(this).val(null);
        //     return false;
        // }

        // if(fileData.size >limit){
        //     alertify.notify("Ảnh upload cho phép tối đa 1M","error",7);
        //     $(this).val(null);
        //     return false;
        // }
        
        if(typeof(FileReader)!="undefined"){
            let imagePreview=$("#image-edit-profile");
            imagePreview.empty();
            let fileReader=new FileReader();
            fileReader.onload= function(element){
                $("<img>",{
                    "src":element.target.result,
                    "class":"avatar img-circle",
                    "id":"user-modal-avatar",
                    "alt":"avatar"
                }).appendTo(imagePreview);
            }
            imagePreview.show();
            fileReader.readAsDataURL(fileData);

            let formData=new FormData();
            formData.append("avatar", fileData);
            userAvatar=formData;
        }
        else{
            alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader","error",7);
        }

    })

    $("#input-change-username").bind("change",function(){
        userInfo.username=$(this).val();
    })

    $("#input-change-gender-male").bind("click",function(){
        userInfo.gender=$(this).val();
    })

    $("#input-change-gender-female").bind("click",function(){
        userInfo.gender=$(this).val();
    })

    $("#input-change-address").bind("change",function(){
        userInfo.gender=$(this).val();
    })

    $("#input-change-phone").bind("change",function(){
        userInfo.phone=$(this).val();
    })
}

function saveUserInfo(){
    $("#input-btn-update-user").bind("click", function(){
        if($.isEmptyObject(userInfo) && !userAvatar){
            alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu","error",7);
            return false;
        }
        $.ajax({
            url:"/user/update-avatar",
            type:"put",
            cache:false,
            contentType:false,
            processData:false,
            data:userAvatar,
            success:function(result){
                // Show text notification
                $(".user-modal-alert-success").find("span").text(result.message);
                $(".user-modal-alert-success").css("display","block");
                // Update avatar on navbar
                $("#navbar-avatar").attr("src",result.imageSrc);
                // Update originAvatarSrc to new
                originAvatarSrc=result.imageSrc;
                $("#input-btn-cancel-update-user").click();
            },
            error:function(error){
                
                $(".user-modal-alert-error").find("span").text(error.responseText);
                $(".user-modal-alert-error").css("display","block");
                // reset all
                $("#input-btn-cancel-update-user").click();
            }
        })
        // console.log(userAvatar);
        // console.log(userInfo);
    })
}

function cancelUserInfo(){
    $("#input-btn-cancel-update-user").bind("click", function(){
         userAvatar=null;
         userInfo={};
         $("#input-change-avatar").val(null);
         $("#user-modal-avatar").attr('src',originAvatarSrc);
    })
}

$(document).ready(function(){
    updateUserInfo();
    originAvatarSrc=$("#user-modal-avatar").attr('src');
    saveUserInfo();
    cancelUserInfo();
})