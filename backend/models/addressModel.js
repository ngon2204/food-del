import mongoose from "mongoose" // Import mongoose để kết nối với MongoDB

// Định nghĩa schema cho địa chỉ, bao gồm:
// - user: tham chiếu đến đối tượng người dùng (ObjectId) từ model "User"
// - name: tên của người nhận hoặc địa chỉ
// - phone: số điện thoại liên hệ
// - address: địa chỉ cụ thể
const AddressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }
})

// Tạo model Address từ AddressSchema và xuất nó để sử dụng ở nơi khác
const Address = mongoose.model("Address", AddressSchema)
export default Address
