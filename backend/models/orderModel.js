import mongoose from "mongoose"
import { v4 as uuidv4 } from "uuid" // Import UUID để tạo orderId duy nhất

// Định nghĩa schema cho đơn hàng
const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, default: uuidv4 }, // Thêm orderId tự động
  userId: { type: String, required: true }, // ID người dùng
  items: { type: Array, required: true }, // Danh sách món ăn
  amount: { type: Number, required: true }, // Tổng số tiền
  address: { type: Object, required: true }, // Địa chỉ giao hàng
  status: { type: String, default: "Đang chuẩn bị món ăn" }, // Trạng thái đơn hàng
  date: { type: Date, default: Date.now }, // Ngày đặt hàng
  payment: { type: Boolean, default: true }, // Trạng thái thanh toán
  // THÊM TRƯỜNG paymentMethod để xác định COD hoặc CARD
  paymentMethod: {
    type: String,
    enum: ["COD", "CARD"],
    default: "COD"
  }
})

// Kiểm tra nếu model đã tồn tại thì không tạo lại
const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)
export default orderModel
