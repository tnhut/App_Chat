export const transValidation={
    email_incorrect:"Email phải có dạng @",
    gender_incorrect:"Gioi tính không hợp lệ",
    password_incorrect:"Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    password_confirm_incorrect:"Nhập lại mật khẩu chưa chính xác",
    password_confirmation_incorrect:"Mật khẩu nhập lại chưa chính xác",
    update_username:"UserName giới hạn 10->17 ký tự và không được phép chứa ký tự đặc biệt.",
    update_gender:"Dư liệu giới tính có vấn đề",
    update_address:"Địa chỉ giới hạn 10->30 ký tự",
    update_phone:"Số điện thoại bắt đầu từ 0, giơi hạn đến 10,11 ký tự",
    keyword_find_user:"Lỗi từ khóa tìm kiếm, chỉ cho phép ký tự chữ và số",
    message_text_emoji_incorrect:"Tin nhắn không hợp lệ. Tối thiểu 1 ký tự, tối đa 400 ky tự"
};

export const transErrors={
    account_in_use:"Email này đã được sử dụng",
    account_remove:"Tài khoản này đã bị gỡ khỏi hệ thống. Vui lòng liên hệ với team support",
    account_not_active:"Email này đã được đăng ký nhưng chưa active tài khoản. Vui lòng kiểm tra Email",
    account_undefined:"Tài khoản này không tồn tại",
    token_underfined:"Token không tồn tại!",
    login_failed:"Sai tài khoản hoặc mật khẩu",
    server_error:"Có lỗi ở phía Server, vui lòng liên hệ với bộ phận hỗ trợ",
    avatar_type:"Kiểu File không hợp lệ",
    avatar_size:"Ảnh upload cho phép tối đa 1M",
    user_current_password_failed:"Mật khẩu hiện tại không chính xác",
    conversation_not_found:"Trò chuyện không tồn tại",
    image_message_type:"Kiểu File không hợp lệ",
    image_message_size:"Ảnh upload cho phép tối đa 1M",
    attachment_message_size:"Tệp  upload cho phép tối đa 1M"
    
};

export const transSuccess={
    userCreated: (userEmail)=>{
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo. Vui lòng kiểm tra Email để active tài khoản `;
    },
    account_actived:"Kích hoạt tài khoản thành công. Bạn có thể đăng nhập được vào ứng dụng",
    loginSuccess:(username)=>{
        return `Xin chào ${username}`;
    },
    logout_success:"Đăng xuất thành công",
    avatar_updated:"Cập nhật ảnh đại diện thành công",
    user_info_updated:"Cập nhật thông tin người dùng thành công",
    user_password_updated:"Cập nhật mật khẩu thành công"
};

export const transMail={
    subject:"Xác nhận kích hoạt tài khoản",
    template:(linkVerify)=>{
        return `
        <h2>Bạn nhận được email này vì đã đăng ký tài khoản trên AppChat</h2>
        <h3>Vui lòng click vào liên kết bên dưới để xác nhận tài khoản </h3>
        <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
        <h4>Trân trọng.</h4>
        `
    },
    send_failed:"Có lỗi trong quá trình gửi email, vui lòng liên hệ với bộ phận hỗ trợ"
};