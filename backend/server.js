import express from "express" // Import express để tạo server và xử lý routing
import cors from "cors" // Import cors để hỗ trợ Cross-Origin Resource Sharing (CORS)
import { connectDB } from "./config/db.js" // Import hàm kết nối cơ sở dữ liệu
import foodRouter from "./routes/foodRoute.js" // Import router xử lý các endpoint liên quan đến món ăn
import userRouter from "./routes/userRoute.js" // Import router xử lý các endpoint người dùng
import "dotenv/config" // Load biến môi trường từ file .env
import cartRouter from "./routes/cartRoute.js" // Import router xử lý giỏ hàng
import orderRouter from "./routes/orderRoutes.js" // Import router xử lý đơn hàng
import statsRoutes from "./routes/statsRoutes.js" // Import router xử lý thống kê
import addressRouter from "./routes/addressRoute.js" // Import router xử lý địa chỉ
import path from "path" // Import path để xử lý đường dẫn file
import { EventEmitter } from "events" // Import EventEmitter để phát sự kiện (cho SSE)

// Cấu hình ứng dụng
const app = express()
const port = process.env.PORT || 4000

// Các middleware
app.use(express.json()) // Parse JSON body cho các request
const allowedOrigins = [
  'https://food-del-admin-oxy1.onrender.com',
  'https://food-del-frontend-fqzu.onrender.com'
]

const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép cả request không có origin (ví dụ như Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true // Cho phép gửi cookie, token
}

// Kết nối cơ sở dữ liệu
connectDB()

// Khởi tạo EventEmitter để phát sự kiện cập nhật đơn hàng (SSE)
const orderUpdateEmitter = new EventEmitter()

// Các endpoint API
app.use("/api/food", foodRouter) // Endpoint cho các thao tác với món ăn
app.use("/images", express.static("uploads")) // Cho phép truy cập file ảnh từ thư mục "uploads"
app.use("/api/user", userRouter) // Endpoint cho người dùng
app.use("/api/cart", cartRouter) // Endpoint cho giỏ hàng
app.use("/api/order", orderRouter) // Endpoint cho đơn hàng
app.use("/api/address", addressRouter) // Endpoint cho địa chỉ
app.use("/api", statsRoutes) // Endpoint cho các thống kê

// SSE endpoint: Phát sự kiện cập nhật đơn hàng theo thời gian thực
app.get("/api/order/updates", (req, res) => {
  // Thiết lập header cho Server-Sent Events
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")

  // Hàm xử lý khi có cập nhật đơn hàng, gửi dữ liệu về client
  const onOrderUpdate = (order) => {
    res.write(`data: ${JSON.stringify(order)}\n\n`)
  }

  // Lắng nghe sự kiện "orderUpdate" từ orderUpdateEmitter
  orderUpdateEmitter.on("orderUpdate", onOrderUpdate)

  // Khi kết nối của client đóng, gỡ bỏ listener
  req.on("close", () => {
    orderUpdateEmitter.removeListener("orderUpdate", onOrderUpdate)
  })
})

// Serve static files from the React app (admin panel)
// Định nghĩa __dirname để làm việc với đường dẫn tuyệt đối
const __dirname = path.resolve()
// Trả về các file tĩnh từ thư mục "admin/build"
app.use(express.static(path.join(__dirname, "admin/build")))
// Bất kỳ route nào không được định nghĩa sẽ trả về file index.html của React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "admin/build", "index.html"))
})

// Khởi động server và lắng nghe tại cổng đã định nghĩa
app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`)
})
