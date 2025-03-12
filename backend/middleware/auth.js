import jwt from "jsonwebtoken" // Import thư viện JWT để xử lý token

// Middleware xác thực: Kiểm tra token trong header của request
const authMiddleware = async (req, res, next) => {
  // Lấy token từ header Authorization (kiểu "Bearer <token>")
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    // Nếu không có token, trả về lỗi 401 (Unauthorized)
    return res.status(401).json({
      success: false,
      message: "Không được phép đăng nhập lại. Thiếu token."
    })
  }
  try {
    // Giải mã token với secret được lưu trong biến môi trường
    const token_decode = jwt.verify(token, process.env.JWT_SECRET)
    // Gán id người dùng từ token vào req.body để sử dụng sau này
    req.body.userId = token_decode.id
    // Cho phép request đi tiếp
    next()
  } catch (error) {
    console.log(error)
    // Nếu token không hợp lệ, trả về lỗi
    res.json({ success: false, message: "Token khong hop le" })
  }
}

export default authMiddleware
