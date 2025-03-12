import foodModel from "../models/foodModel.js" // Import model món ăn
import fs from "fs" // Import fs để xử lý file (xóa ảnh)

// Thêm món ăn vào database
const addFood = async (req, res) => {
  // Lấy tên file ảnh đã upload từ req.file
  let image_filename = `${req.file.filename}`

  // Tạo đối tượng food mới với thông tin nhận từ req.body và tên file ảnh
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename
  })
  try {
    // Lưu món ăn vào database
    await food.save()
    // Trả về thông báo thành công
    res.json({ success: true, message: "Đã thêm món ăn" })
  } catch (error) {
    console.log(error)
    // Trả về thông báo lỗi nếu có exception
    res.json({ success: false, message: "Lỗi" })
  }
}

// Lấy danh sách tất cả món ăn
const listFood = async (req, res) => {
  try {
    // Tìm tất cả món ăn trong database
    const foods = await foodModel.find({})
    // Trả về danh sách món ăn nếu thành công
    res.json({ success: true, data: foods })
  } catch (error) {
    console.log(error)
    // Trả về lỗi nếu có vấn đề xảy ra
    res.json({ success: false, message: "Lỗi" })
  }
}

// Xóa món ăn khỏi database và xóa file ảnh liên quan
const removeFood = async (req, res) => {
  try {
    // Tìm món ăn cần xóa theo id từ req.body
    const food = await foodModel.findById(req.body.id)
    // Xóa file ảnh trong thư mục uploads (để tránh file rác trên server)
    fs.unlink(`uploads/${food.image}`, () => {})
    // Xóa món ăn khỏi database
    await foodModel.findByIdAndDelete(req.body.id)
    // Trả về thông báo thành công
    res.json({ success: true, message: "Đã xóa món ăn" })
  } catch (error) {
    console.log(error)
    // Trả về thông báo lỗi nếu có exception
    res.json({ success: false, message: "Lỗi" })
  }
}

// Xuất các hàm để sử dụng ở nơi khác
export { addFood, listFood, removeFood }
