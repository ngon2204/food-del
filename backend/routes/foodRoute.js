import express from "express" // Import express để tạo router và xử lý request
import { addFood, listFood, removeFood } from "../controllers/foodController.js" // Import các controller xử lý món ăn
import multer from "multer" // Import multer để xử lý upload file

const foodRouter = express.Router() // Tạo router riêng cho các route liên quan đến món ăn

// Cấu hình lưu trữ hình ảnh sử dụng multer
const storage = multer.diskStorage({
  destination: "uploads", // Chỉ định thư mục "uploads" để lưu trữ file ảnh
  filename: (req, file, cb) => {
    // Đặt tên file dựa trên thời gian hiện tại kết hợp với tên gốc của file
    return cb(null, `${Date.now()}${file.originalname}`)
  }
})

const upload = multer({ storage: storage }) // Khởi tạo middleware upload với cấu hình lưu trữ đã định nghĩa

// Thêm món ăn: xử lý file ảnh (dưới dạng single với field "image") trước khi gọi controller addFood
foodRouter.post("/add", upload.single("image"), addFood)

// Lấy danh sách tất cả món ăn
foodRouter.get("/list", listFood)

// Xóa món ăn
foodRouter.post("/remove", removeFood)

export default foodRouter
