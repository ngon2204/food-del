import express from "express"
import {
  loginUser,
  registerUser,
  getAllUsers,
  updateUser,
  updateUserPassword,
  getUserDetails
} from "../controllers/userController.js"

const userRouter = express.Router()

// Đăng ký người dùng
userRouter.post("/register", registerUser)
// Đăng nhập người dùng
userRouter.post("/login", loginUser)
// Lấy danh sách tất cả người dùng
userRouter.get("/", getAllUsers)
// Cập nhật thông tin người dùng
userRouter.put("/update", updateUser)
// Cập nhật mật khẩu người dùng
userRouter.put("/update-password", updateUserPassword)
// Route để lấy thông tin chi tiết người dùng
userRouter.get("/:id", getUserDetails)

export default userRouter
