import mongoose from "mongoose"

// Định nghĩa schema cho người dùng
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên người dùng
    email: { type: String, required: true, unique: true }, // Email người dùng
    password: { type: String, required: true }, // Mật khẩu người dùng
    role: { type: String, default: "user" }, // Vai trò người dùng, mặc định là "user"
    phone: { type: String, required: true }, // Số điện thoại người dùng
    address: { type: String, required: true }, // Địa chỉ người dùng
    cartData: { type: Object, default: {} } // Dữ liệu giỏ hàng
  },
  { minimize: false }
)

// Kiểm tra nếu model đã tồn tại thì không tạo lại
const userModel = mongoose.model.user || mongoose.model("user", userSchema)
export default userModel
