import express from "express" // Import express để tạo router
import {
  addToCart,
  getCart,
  removeFromCart
} from "../controllers/cartController.js" // Import controller xử lý giỏ hàng
import authMiddleware from "../middleware/auth.js" // Import middleware xác thực người dùng

const cartRouter = express.Router() // Tạo router riêng cho các route liên quan đến giỏ hàng

// Route: Thêm sản phẩm vào giỏ hàng
// Chỉ cho phép người dùng đã xác thực
cartRouter.post("/add", authMiddleware, addToCart)

// Route: Xóa sản phẩm khỏi giỏ hàng
// Chỉ cho phép người dùng đã xác thực
cartRouter.post("/remove", authMiddleware, removeFromCart)

// Route: Lấy dữ liệu giỏ hàng của người dùng
// Chỉ cho phép người dùng đã xác thực
cartRouter.post("/get", authMiddleware, getCart)

export default cartRouter
