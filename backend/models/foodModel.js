import mongoose from "mongoose"

// Định nghĩa schema cho món ăn
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên món ăn
  description: { type: String, required: true }, // Mô tả món ăn
  price: { type: Number, required: true }, // Giá món ăn
  image: { type: String, required: true }, // Hình ảnh món ăn
  category: { type: String, required: true } // Danh mục món ăn
})

// Kiểm tra nếu model đã tồn tại thì không tạo lại
const foodModel = mongoose.model.food || mongoose.model("Food", foodSchema)

export default foodModel
