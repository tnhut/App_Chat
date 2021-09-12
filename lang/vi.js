export const transValidation={
    email_incorrect:"Email phải có dạng @",
    gender_incorrect:"Gioi tính không hợp lệ",
    password_incorrect:"Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    password_confirmation_incorrect:"Mật khẩu nhập lại chưa chính xác"
};

export const transErrors={
    account_in_use:"Email này đã được sử dụng",
    account_remove:"Tài khoản này đã bị gỡ khỏi hệ thống. Vui lòng liên hệ với team support",
    account_not_active:"Email này đã được đăng ký nhưng chưa active tài khoản. Vui lòng kiểm tra Email"
    
};

export const transSuccess={
    userCreated: (userEmail)=>{
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo. Vui lòng kiểm tra Email để active tài khoản `;
    }
}