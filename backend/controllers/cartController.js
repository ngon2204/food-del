import userModel from "../models/userModel.js"

// Thêm sản phẩm vào giỏ hàng của người dùng
const addToCart = async (req, res) => {
  try {
    // Tìm người dùng theo userId từ body
    let userData = await userModel.findById(req.body.userId)
    // Lấy thông tin giỏ hàng của người dùng
    let cartData = await userData.cartData
    // Nếu sản phẩm chưa có, đặt số lượng = 1, nếu đã có thì tăng số lượng lên 1
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1
    } else {
      cartData[req.body.itemId] += 1
    }
    // Cập nhật lại giỏ hàng trong database
    await userModel.findByIdAndUpdate(req.body.userId, { cartData })
    // Trả về kết quả thành công
    res.json({ success: true, message: "Thêm vào giỏ hàng thành công" })
  } catch (error) {
    console.log(error)
    // Trả về lỗi nếu có sự cố xảy ra
    res.json({ success: false, message: "Thêm vào giỏ hàng thất bại" })
  }
}

// Xóa sản phẩm khỏi giỏ hàng của người dùng
const removeFromCart = async (req, res) => {
  try {
    // Tìm người dùng theo userId từ body
    let userData = await userModel.findById(req.body.userId)
    // Lấy thông tin giỏ hàng của người dùng
    let cartData = await userData.cartData
    // Nếu sản phẩm có trong giỏ và số lượng lớn hơn 0, giảm số lượng đi 1
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1
    }
    // Cập nhật giỏ hàng trong database
    await userModel.findByIdAndUpdate(req.body.userId, { cartData })
    // Trả về kết quả thành công
    res.json({ success: true, message: "Xóa khỏi giỏ hàng thành công" })
  } catch (error) {
    console.log(error)
    // Trả về lỗi nếu có sự cố xảy ra
    res.json({ success: false, message: "Xóa khỏi giỏ hàng thất bại" })
  }
}

// Lấy dữ liệu giỏ hàng của người dùng
const getCart = async (req, res) => {
  try {
    // Tìm người dùng theo userId từ body
    let userData = await userModel.findById(req.body.userId)
    // Lấy dữ liệu giỏ hàng
    let cartData = await userData.cartData
    // Trả về dữ liệu giỏ hàng
    res.json({ success: true, cartData })
  } catch (error) {
    console.log(error)
    // Trả về lỗi nếu có sự cố xảy ra
    res.json({ success: false, message: "Lấy dữ liệu giỏ hàng thất bại" })
  }
}

// Xuất các hàm để sử dụng ở nơi khác
export { addToCart, removeFromCart, getCart }
