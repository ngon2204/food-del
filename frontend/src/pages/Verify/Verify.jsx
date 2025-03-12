import React, { useContext, useEffect } from "react" // Import React và các hook cần thiết
import "./Verify.css" // Import file CSS để style cho Verify component
import { useNavigate, useSearchParams } from "react-router-dom" // Import hook để điều hướng và truy xuất query parameters từ URL
import { StoreContext } from "../../context/StoreContext" // Import StoreContext để lấy URL của API
import axios from "axios" // Import axios để gọi API

// Component Verify: Xác nhận thanh toán đơn hàng sau khi thanh toán qua cổng PayOS
const Verify = () => {
  // Lấy các query parameter "success" và "orderId" từ URL
  const [searchParams, setSearchParams] = useSearchParams()
  const success = searchParams.get("success")
  const orderId = searchParams.get("orderId")

  // Lấy URL API từ StoreContext
  const { url } = useContext(StoreContext)
  // Khởi tạo hàm điều hướng
  const navigate = useNavigate()

  // Hàm verifyPayment: Gọi API xác nhận thanh toán với thông tin từ query parameter
  const verifyPayment = async () => {
    const response = await axios.post(url + "/api/order/verify", {
      success,
      orderId
    })
    // Nếu thanh toán thành công, chuyển hướng đến trang đơn hàng của tôi
    if (response.data.success) {
      navigate("/myorders")
    } else {
      // Nếu thất bại, chuyển hướng về trang chủ
      navigate("/")
    }
  }

  // useEffect: Khi component mount, gọi verifyPayment để xác nhận thanh toán ngay lập tức
  useEffect(() => {
    verifyPayment()
  }, [])

  // Hiển thị spinner trong lúc chờ xác nhận thanh toán từ server
  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  )
}

export default Verify
