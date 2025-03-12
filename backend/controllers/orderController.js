import orderModel from "../models/orderModel.js" // Import model đơn hàng
import userModel from "../models/userModel.js" // Import model người dùng
import mongoose from "mongoose" // Dùng để xác thực ObjectId
import PayOS from "@payos/node" // Import PayOS cho tích hợp thanh toán

// Khởi tạo PayOS với key, secret và partner key
const payOS = new PayOS(
  "95daf7cf-d8aa-468d-b4ec-14359f932070",
  "3333667a-c7db-401a-9e88-9ce3394f07d6",
  "6e1a3ca478a8f9f8b15e5f81d5bb3b8884b5581574230ae5bf501e9f38ae40c2"
)

// Đặt hàng
const placeOrder = async (req, res) => {
  try {
    // Nhận thông tin đơn hàng từ body, bao gồm phương thức thanh toán
    const { userId, address, items, amount, paymentMethod } = req.body

    // Kiểm tra đầy đủ thông tin đầu vào
    if (!userId || !address || !items || !amount || !paymentMethod) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin đơn hàng" })
    }

    // Kiểm tra định dạng userId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "userId không hợp lệ" })
    }

    const userObjectId = new mongoose.Types.ObjectId(userId)

    // Tìm người dùng để lấy tên (dùng trong đơn hàng)
    const user = await userModel.findById(userObjectId)
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" })
    }

    // Tính tổng tiền đơn hàng (bao gồm phí ship: 20,000)
    const totalAmount = amount + 20000

    // Tạo đơn hàng mới với các thông tin đã nhận và tính toán
    const newOrder = new orderModel({
      userId: userObjectId,
      userName: user.name, // Lưu tên người dùng vào đơn hàng
      items: items,
      amount: totalAmount,
      address: address,
      paymentMethod: paymentMethod,
      // payment: false cho đến khi thanh toán xong (có thể tùy chỉnh theo logic)
      payment: false
    })

    await newOrder.save()

    // Xóa giỏ hàng sau khi đặt hàng thành công
    await userModel.findByIdAndUpdate(userObjectId, { cartData: {} })

    // Nếu thanh toán bằng thẻ, tạo link thanh toán qua PayOS
    if (paymentMethod === "CARD") {
      const paymentResponse = await payOS.createPaymentLink({
        orderCode: Number(String(Date.now()).slice(-6)), // Tạo order code từ thời gian hiện tại
        amount: totalAmount,
        currency: "USD",
        description: "Order payment",
        orderId: newOrder._id.toString(),
        returnUrl: process.env.PAYOS_RETURN_URL, // URL chuyển hướng sau khi thanh toán thành công
        cancelUrl: process.env.PAYOS_CANCEL_URL // URL chuyển hướng nếu thanh toán bị hủy
      })

      return res.json({
        success: true,
        message: "Đặt hàng thành công, chuyển hướng thanh toán thẻ",
        paymentUrl: paymentResponse.checkoutUrl
      })
    }

    // Nếu thanh toán COD, trả về kết quả ngay mà không cần link thanh toán
    if (paymentMethod === "COD") {
      return res.json({
        success: true,
        message: "Đặt hàng thành công với COD",
        orderId: newOrder._id
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Lỗi đặt hàng" })
  }
}

// Xác nhận đơn hàng sau khi thanh toán
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body
  try {
    if (success === "true") {
      // Nếu thanh toán thành công, cập nhật trạng thái payment = true
      await orderModel.findByIdAndUpdate(orderId, { payment: true })
      res.json({ success: true, message: "Đặt hàng thành công" })
    } else {
      // Nếu thanh toán không thành công, xóa đơn hàng
      await orderModel.findByIdAndDelete(orderId)
      res.json({ success: false, message: "Xác nhận đặt hàng thất bại" })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Lỗi xác nhận đặt hàng" })
  }
}

// Lấy danh sách đơn hàng của người dùng (dựa trên userId gửi từ client)
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId })
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Lỗi lấy danh sách đơn hàng" })
  }
}

// Lấy danh sách tất cả đơn hàng (cho admin hoặc quản lý)
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Lỗi lấy danh sách đơn hàng" })
  }
}

// Cập nhật trạng thái đơn hàng (ví dụ: đang giao, đã giao,...)
const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body
  try {
    await orderModel.findByIdAndUpdate(orderId, { status })
    res.json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công"
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Lỗi cập nhật trạng thái đơn hàng" })
  }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateOrderStatus }
