import orderModel from "../models/orderModel.js" // Import model đơn hàng
import userModel from "../models/userModel.js" // Import model người dùng

// Lấy thống kê tổng số đơn hàng
const getOrderStats = async (req, res) => {
  try {
    // Đếm số lượng đơn hàng trong collection
    const totalOrders = await orderModel.countDocuments()
    res.json({ success: true, totalOrders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Lỗi lấy thống kê đơn hàng" })
  }
}

// Lấy thống kê tổng số người dùng
const getUserStats = async (req, res) => {
  try {
    // Đếm số lượng người dùng trong collection
    const totalUsers = await userModel.countDocuments()
    res.json({ success: true, totalUsers })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Lỗi lấy thống kê người dùng" })
  }
}

// Lấy thống kê tổng doanh thu từ các đơn hàng đã thanh toán
const getRevenueStats = async (req, res) => {
  try {
    // Lấy tất cả đơn hàng mà đã thanh toán (payment: true)
    const orders = await orderModel.find({ payment: true })
    console.log("Fetched Orders:", orders) // Debug: in ra các đơn hàng đã thanh toán
    // Tính tổng doanh thu từ các đơn hàng
    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0)
    res.json({ success: true, totalRevenue })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Lỗi lấy thống kê doanh thu" })
  }
}

// Lấy thống kê doanh thu cho từng món ăn
const getFoodRevenueStats = async (req, res) => {
  try {
    // Sử dụng aggregate để nhóm doanh thu theo từng món ăn
    const foodRevenue = await orderModel.aggregate([
      { $match: { payment: true } }, // Chỉ lấy đơn hàng đã thanh toán
      { $unwind: "$items" }, // Tách mảng items thành từng document riêng
      {
        $group: {
          _id: "$items.foodName", // Nhóm theo tên món ăn
          revenue: { $sum: "$items.price" } // Tính tổng doanh thu cho mỗi món
        }
      },
      {
        $project: {
          _id: 0,
          foodName: "$_id", // Đổi _id thành foodName
          revenue: 1
        }
      }
    ])
    res.json({ success: true, foodRevenue })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Lỗi lấy thống kê doanh thu món ăn" })
  }
}

// Lấy thống kê doanh thu theo tháng
const getMonthlyRevenueStats = async (req, res) => {
  try {
    // Aggregate để nhóm đơn hàng theo tháng dựa trên trường 'date'
    const monthlyRevenue = await orderModel.aggregate([
      { $match: { payment: true } }, // Chỉ tính đơn hàng đã thanh toán
      {
        $group: {
          _id: { $month: "$date" }, // Nhóm theo tháng (số 1-12)
          totalRevenue: { $sum: "$amount" } // Tính tổng doanh thu của tháng đó
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id", // Đổi _id thành month
          totalRevenue: 1
        }
      },
      { $sort: { month: 1 } } // Sắp xếp theo thứ tự tháng tăng dần
    ])
    res.json({ success: true, monthlyRevenue })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: "Lỗi lấy thống kê doanh thu theo tháng"
    })
  }
}

// Lấy thống kê doanh thu theo ngày
const getDailyRevenue = async (req, res) => {
  const { date } = req.query // Nhận ngày cần thống kê từ query
  try {
    // Aggregate để tính tổng doanh thu của ngày cụ thể
    const dailyRevenue = await orderModel.aggregate([
      {
        $match: {
          payment: true,
          date: {
            $gte: new Date(date + "T00:00:00.000Z"), // Bắt đầu ngày
            $lt: new Date(date + "T23:59:59.999Z") // Kết thúc ngày
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1
        }
      }
    ])
    res.json({
      success: true,
      dailyRevenue: dailyRevenue[0]?.totalRevenue || 0
    })
  } catch (error) {
    console.error("Error fetching daily revenue:", error)
    res
      .status(500)
      .json({ success: false, message: "Error fetching daily revenue" })
  }
}

// Lấy thống kê các món ăn bán chạy nhất
const getBestSellingDishes = async (req, res) => {
  try {
    // Aggregate để nhóm và tính tổng số lượng bán ra cho mỗi món ăn
    const bestSellingDishes = await orderModel.aggregate([
      { $unwind: "$items" }, // Tách mảng items thành từng document riêng
      {
        $group: {
          _id: {
            name: "$items.name", // Nhóm theo tên món ăn
            image: "$items.image" // Lưu lại hình ảnh của món ăn
          },
          totalQuantity: { $sum: "$items.quantity" } // Tổng số lượng bán ra
        }
      },
      { $sort: { totalQuantity: -1 } }, // Sắp xếp giảm dần theo số lượng bán ra
      { $limit: 5 } // Lấy 5 món bán chạy nhất
    ])
    res.json({ success: true, bestSellingDishes })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Lỗi lấy thống kê món bán chạy" })
  }
}

export {
  getOrderStats,
  getUserStats,
  getRevenueStats,
  getFoodRevenueStats,
  getMonthlyRevenueStats,
  getDailyRevenue,
  getBestSellingDishes
}
