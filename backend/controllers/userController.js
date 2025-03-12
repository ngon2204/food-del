import userModel from "../models/userModel.js" // Import model người dùng
import jwt from "jsonwebtoken" // Import JWT để tạo token xác thực
import bcrypt from "bcrypt" // Dùng bcrypt để mã hóa và so sánh mật khẩu
import validator from "validator" // Dùng để kiểm tra định dạng email
import addressModel from "../models/addressModel.js" // Import model địa chỉ

// Đăng nhập người dùng
const loginUser = async (req, res) => {
  const { email, password } = req.body // Lấy email và password từ body
  const { admin } = req.query // Lấy query parameter 'admin' nếu có (kiểm tra quyền admin)
  try {
    // Tìm người dùng theo email
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: "Người dùng không tồn tại" })
    }

    // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Thông tin xác thực không hợp lệ"
      })
    }

    // Nếu yêu cầu admin nhưng người dùng không phải admin, trả về lỗi
    if (admin && user.role !== "admin") {
      return res.json({
        success: false,
        message: "Bạn không có quyền truy cập"
      })
    }

    // Tạo token JWT chứa id người dùng
    const token = createToken(user._id)
    // Trả về token và role của người dùng
    res.json({ success: true, token, role: user.role })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Đã xảy ra lỗi" })
  }
}

// Tạo token JWT dựa trên id người dùng và secret từ biến môi trường
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Đăng ký người dùng mới
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body
  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const exists = await userModel.findOne({ email })
    if (exists) {
      return res.json({ success: false, message: "Người dùng đã tồn tại" })
    }

    // Xác thực định dạng email và độ dài mật khẩu tối thiểu 8 ký tự
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Email không hợp lệ" })
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Hãy nhập mật khẩu có độ dài ít nhất 8 ký tự"
      })
    }

    // Tạo salt và mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Tạo người dùng mới với các thông tin nhận được
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      role: role || "user" // Mặc định vai trò là "user" nếu không cung cấp
    })

    const user = await newUser.save()
    // Tạo token cho người dùng mới
    const token = createToken(user._id)
    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Đã xảy ra lỗi" })
  }
}

// Lấy danh sách tất cả người dùng (chỉ lấy các trường _id, name, email, role)
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "_id name email role")
    res.json(users)
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Đã xảy ra lỗi" })
  }
}

// Cập nhật thông tin người dùng (name, email, role)
const updateUser = async (req, res) => {
  const { id, name, email, role } = req.body
  try {
    // Tìm người dùng theo id
    const user = await userModel.findById(id)
    if (!user) {
      return res.json({ success: false, message: "Người dùng không tồn tại" })
    }

    // Cập nhật thông tin nếu có giá trị mới, giữ nguyên nếu không thay đổi
    user.name = name || user.name
    user.email = email || user.email
    user.role = role || user.role

    await user.save()
    res.json({
      success: true,
      message: "Thông tin người dùng đã được cập nhật"
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Đã xảy ra lỗi" })
  }
}

// Cập nhật mật khẩu người dùng
const updateUserPassword = async (req, res) => {
  const { id, password } = req.body
  try {
    // Tìm người dùng theo id
    const user = await userModel.findById(id)
    if (!user) {
      return res.json({ success: false, message: "Người dùng không tồn tại" })
    }

    // Tạo salt và mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    await user.save()
    res.json({ success: true, message: "Mật khẩu đã được cập nhật" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Đã xảy ra lỗi" })
  }
}

// Lấy thông tin chi tiết người dùng, bao gồm cả địa chỉ
const getUserDetails = async (req, res) => {
  try {
    // Tìm người dùng theo id từ params
    const user = await userModel.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" })
    }

    // Tìm địa chỉ của người dùng
    const address = await addressModel.findOne({ user: user._id })
    if (!address) {
      return res.status(404).json({ message: "Địa chỉ không tồn tại" })
    }

    // Trả về thông tin người dùng và địa chỉ
    res.json({
      user,
      address
    })
  } catch (error) {
    console.error("Error fetching user details:", error)
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" })
  }
}

export {
  loginUser,
  registerUser,
  getAllUsers,
  updateUser,
  updateUserPassword,
  getUserDetails
}
