import express from "express" // Import express để tạo router và xử lý HTTP request
import Address from "../models/addressModel.js" // Import model Address để thao tác với collection địa chỉ
import authMiddleware from "../middleware/auth.js" // Import middleware xác thực người dùng

const router = express.Router() // Tạo router để định nghĩa các route cho địa chỉ

// Lấy danh sách địa chỉ của user
// Endpoint GET "/" - chỉ cho phép người dùng đã xác thực
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Tìm tất cả địa chỉ có trường user trùng với req.body.userId (đã được set bởi authMiddleware)
    const addresses = await Address.find({ user: req.body.userId })
    res.json({ success: true, addresses })
  } catch (error) {
    // Nếu có lỗi server, trả về status 500
    res.status(500).json({ success: false, message: "Lỗi server" })
  }
})

// Thêm địa chỉ mới
// Endpoint POST "/" - chỉ cho phép người dùng đã xác thực
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Lấy thông tin địa chỉ từ req.body
    const { userId, name, phone, address } = req.body
    // Tạo đối tượng Address mới với các thông tin nhận được
    const newAddress = new Address({
      user: userId,
      name,
      phone,
      address
    })
    // Lưu địa chỉ mới vào database
    await newAddress.save()
    // Trả về kết quả thành công kèm đối tượng newAddress vừa tạo
    res.json({ success: true, newAddress })
  } catch (error) {
    // Xử lý lỗi server
    res.status(500).json({ success: false, message: "Lỗi server" })
  }
})

// Xóa địa chỉ
// Endpoint DELETE "/:id" - chỉ cho phép người dùng đã xác thực
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Xóa địa chỉ dựa trên id được truyền qua params
    await Address.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: "Địa chỉ đã bị xóa" })
  } catch (error) {
    // Xử lý lỗi server nếu xóa thất bại
    res.status(500).json({ success: false, message: "Lỗi server" })
  }
})

export default router
