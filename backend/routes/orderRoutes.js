import express from "express"
import authMiddleware from "../middleware/auth.js"
import {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateOrderStatus
} from "../controllers/orderController.js"

const orderRouter = express.Router()

// Đặt hàng
orderRouter.post("/place", authMiddleware, placeOrder)
// Xác nhận đơn hàng
orderRouter.post("/verify", verifyOrder)
// Lấy danh sách đơn hàng của người dùng
orderRouter.post("/userorders", authMiddleware, userOrders)
// Lấy danh sách tất cả đơn hàng
orderRouter.get("/list", listOrders)
// Cập nhật trạng thái đơn hàng
orderRouter.post("/updateStatus", authMiddleware, updateOrderStatus)

export default orderRouter
