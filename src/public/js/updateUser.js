let userAvatar=null;
let userInfo={};
let originAvatarSrc=null;
let originUserInfo={};
let userUpdatePassword={};

function callLogout(){
    let timerInterval;
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Tự động đăng xuất sau 5 giây",
        html:"Thời gian: <strong></strong>",
        showConfirmButton: false,
        timer: 5000,
        onBeforeOpen: ()=>{
            Swal.showLoading();
            timerInterval=setInterval(()=>{
                Swal.getContent().querySelector("strong").textContent=Math.ceil(Swal.getTimerLeft()/1000);
            },1000);
        },
        onClose:()=>{
            clearInterval(timerInterval);
        }
      })
      .then((result)=>{
        $.get("/logout", ()=>{
            location.reload();
        });
      })
}

function updateUserInfo(){
    $("#input-change-avatar").bind("change", function(){
        let fileData=$(this).prop("files")[0];
        let match=["image/png","image/jpg","image/jpeg"];
        let limit=1048576; // byte=1M

        if($.inArray(fileData.type,match)===-1){
            alertify.notify("Kiểu File không hợp lệ","error",7);
            $(this).val(null);
            return false;
        }

        if(fileData.size >limit){
            alertify.notify("Ảnh upload cho phép tối đa 1M","error",7);
            $(this).val(null);
            return false;
        }
        
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
            formData.append("my-image-chat", fileData);
            userAvatar=formData;
        }
        else{
            alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader","error",7);
        }

    })

    $("#input-change-username").bind("change",function(){
        let username=$(this).val();
        let regexUsername= new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
        if(!regexUsername.test(username) || username.length<3 || username.length>17 ){
            alertify.notify("UserName giới hạn 10->17 ký tự và không được phép chứa ký tự đặc biệt.","error",7);
            $(this).val(originUserInfo.username);
            delete userInfo.username;
            return false;
        }
        userInfo.username=$(this).val();
    })

    $("#input-change-male").bind("click",function(){
        let gender=$(this).val();
        if(gender!=="male"){
            alertify.notify("Dư liệu giới tính có vấn đề","error",7);
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }
        userInfo.gender=gender;
    })

    $("#input-change-female").bind("click",function(){
        let gender=$(this).val();
        if(gender!=="female"){
            alertify.notify("Dư liệu giới tính có vấn đề","error",7);
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }
        userInfo.gender=$(this).val();
    })

    $("#input-change-address").bind("change",function(){
        let address=$(this).val();
     
        if(address.length<3 || address.length>30){
            alertify.notify("Địa chỉ giới hạn 10->30 ký tự","error",7);
            $(this).val(originUserInfo.address);
            delete userInfo.address;
            return false;
        }
        userInfo.address=address;
    })

    $("#input-change-phone").bind("change",function(){
        let phone=$(this).val();
        let regexphone= new RegExp(/^(0)[0-9]{9,10}$/)
        if(!regexphone.test(phone)){
            alertify.notify("Số điện thoại bắt đầu từ 0, giơi hạn đến 10,11 ký tự","error",7);
            $(this).val(originUserInfo.phone);
            delete userInfo.phone;
            return false;
        }
        userInfo.phone=phone;
       
    })

    $("#input-change-current-password").bind("change",function(){
        let currentPassword=$(this).val();
        let regexPassword= new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

        if(!regexPassword.test(currentPassword)){
            alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt","error",7);
            $(this).val(null);
            delete userUpdatePassword.currentPassword;
            return false;
        }
        userUpdatePassword.currentPassword=currentPassword;
       
    })

    $("#input-change-new-password").bind("change",function(){
        let newPassword=$(this).val();
        let regexPassword= new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

        if(!regexPassword.test(newPassword)){
            alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt","error",7);
            $(this).val(null);
            delete userUpdatePassword.newPassword;
            return false;
        }
        userUpdatePassword.newPassword=newPassword;
       
    })

    $("#input-change-confirm-password").bind("change",function(){
        let confirmPassword=$(this).val();
        
        if(!userUpdatePassword.newPassword){
            alertify.notify("Bạn chưa nhập mật khẩu mới","error",7);
            $(this).val(null);
            delete userUpdatePassword.confirmPassword;
            return false;
        }

        if(confirmPassword!==userUpdatePassword.newPassword){
            alertify.notify("Nhập lại mật khẩu chưa chính xác","error",7);
            $(this).val(null);
            delete userUpdatePassword.confirmPassword;
            return false;
        }
        userUpdatePassword.confirmPassword=confirmPassword;
       
    })
}

function saveUserInfo(){
    $("#input-btn-update-user").bind("click", function(){
        if($.isEmptyObject(userInfo) && !userAvatar){
            alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu","error",7);
            return false;
        }
        if(userAvatar){
            callUpdateUserAvatar();
        }
        if(!$.isEmptyObject(userInfo)){
            callUpdateUserInfo();
        }
              
    })

    $("#input-btn-update-user-password").bind("click", function(){
        if(!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmPassword)
        {
            alertify.notify("Bạn phải thay đổi đầy đủ thông tin","error",7);
        }

        Swal.fire({
            title: 'Bạn có chắc muốn thay đổi mật khẩu?',
            text: "Bạn không thể hoàn tất lại quá trình này nhé",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#2ECC71;',
            cancelButtonColor: 'ff7675',
            confirmButtonText: 'Xác nhận!',
            cancelButtonText: 'Hủy'
          }).then((result) => {
                if(!result.value){
                    $("#input-btn-cancel-update-user").click();
                    return false;
                }

                callUpdateUserPassword();
          })

     
              
    })
}

function cancelUserInfo(){
    $("#input-btn-cancel-update-user").bind("click", function(){
         userAvatar=null;
         userInfo={};
         $("#input-change-avatar").val(null);
         $("#user-modal-avatar").attr('src',originAvatarSrc);

         $("#input-change-username").val(originUserInfo.username);
         (originUserInfo.gender==="male")?$("#input-change-gender-male").click():$("#input-change-gender-female").click();
         $("#input-change-address").val(originUserInfo.address);
         $("#input-change-phone").val(originUserInfo.phone);
    })

    $("#input-btn-cancel-user-password").bind("click", function(){
        userUpdatePassword={};
        $("#input-change-current-password").val(null);
        $("#input-change-new-password").val(null);
        $("#input-change-confirm-password").val(null);
   })
}

function callUpdateUserAvatar(){

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
}

function callUpdateUserInfo(){
  
    $.ajax({
        url:"/user/update-info",
        type:"put",
        data:userInfo,
        success:function(result){
            // Show text notification
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display","block");
           
            // Update Origin userInfo
            originUserInfo=Object.assign(originUserInfo,userInfo);

            // update username on navbar
            $("#navbar-username").text(originUserInfo.username);
            // reset all
            $("#input-btn-cancel-update-user").click();
        },
        error:function(error){
            
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display","block");
            // reset all
            $("#input-btn-cancel-update-user").click();
        }
    })
}

function callUpdateUserPassword(){

    $.ajax({
        url:"/user/update-password",
        type:"put",
        data:userUpdatePassword,
        success:function(result){
            // Show text notification
            $(".user-modal-password-alert-success").find("span").text(result.message);
            $(".user-modal-password-alert-success").css("display","block");
           
            // reset all
            $("#input-btn-cancel-update-user").click();

            // Logout after change password
            callLogout();

        },
        error:function(error){
            
            $(".user-modal-password-alert-error").find("span").text(error.responseText);
            $(".user-modal-password-alert-error").css("display","block");
            // reset all
            $("#input-btn-cancel-update-user").click();
        }
    })
}


$(document).ready(function(){
    
    originAvatarSrc=$("#user-modal-avatar").attr('src');
    originUserInfo={
        username:$("#input-change-username").val(),
        gender:($("#input-change-gender-male").is(":checked"))?$("#input-change-gender-male").val():$("#input-change-gender-female").val(),
        address:$("#input-change-address").val(),
        phone:$("#input-change-phone").val()
    };

    updateUserInfo();
    saveUserInfo();
    cancelUserInfo();
})