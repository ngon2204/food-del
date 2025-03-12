import express from "express"
import {
  getOrderStats,
  getUserStats,
  getRevenueStats,
  getFoodRevenueStats,
  getMonthlyRevenueStats,
  getDailyRevenue,
  getBestSellingDishes
} from "../controllers/statsController.js"

const router = express.Router()

// Lấy thống kê tổng số đơn hàng
router.get("/orders/stats", getOrderStats)
// Lấy thống kê tổng số người dùng
router.get("/users/stats", getUserStats)
// Lấy thống kê tổng doanh thu
router.get("/revenue/stats", getRevenueStats)
// Lấy thống kê doanh thu cho từng món ăn
router.get("/revenue/food", getFoodRevenueStats)
// Lấy thống kê doanh thu theo tháng
router.get("/revenue/monthly", getMonthlyRevenueStats)
// Lấy thống kê doanh thu theo ngày
router.get("/revenue/daily", getDailyRevenue)
// Lấy thống kê các món ăn bán chạy nhất
router.get("/revenue/best-selling-dishes", getBestSellingDishes)

export default router
