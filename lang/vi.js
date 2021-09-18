export const transValidation={
    email_incorrect:"Email phải có dạng @",
    gender_incorrect:"Gioi tính không hợp lệ",
    password_incorrect:"Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    password_confirmation_incorrect:"Mật khẩu nhập lại chưa chính xác"
};

export const transErrors={
    account_in_use:"Email này đã được sử dụng",
    account_remove:"Tài khoản này đã bị gỡ khỏi hệ thống. Vui lòng liên hệ với team support",
    account_not_active:"Email này đã được đăng ký nhưng chưa active tài khoản. Vui lòng kiểm tra Email",
    token_underfined:"Token không tồn tại!",
    login_failed:"Sai tài khoản hoặc mật khẩu",
    server_error:"Có lỗi ở phía Server, vui lòng liên hệ với bộ phận hỗ trợ"
    
};

export const transSuccess={
    userCreated: (userEmail)=>{
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo. Vui lòng kiểm tra Email để active tài khoản `;
    },
    account_actived:"Kích hoạt tài khoản thành công. Bạn có thể đăng nhập được vào ứng dụng",
    loginSuccess:(username)=>{
        return `Xin chào ${username}`;
    }
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