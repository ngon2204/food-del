import React, { useContext, useEffect, useState } from "react" // Import các hook cần thiết từ React
import "./MyOrders.css" // Import CSS cho component MyOrders
import { StoreContext } from "../../context/StoreContext" // Import StoreContext để lấy thông tin URL và token
import axios from "axios" // Import axios để gọi API
import { assets } from "../../assets/assets" // Import assets để sử dụng icon, hình ảnh

const MyOrders = () => {
  // Lấy giá trị url và token từ StoreContext
  const { url, token } = useContext(StoreContext)
  // State data lưu trữ danh sách đơn hàng của người dùng
  const [data, setData] = useState([])

  // Hàm fetchOrders: gọi API để lấy danh sách đơn hàng của người dùng
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {}, // Không gửi thêm dữ liệu gì trong body
        { headers: { Authorization: `Bearer ${token}` } } // Gửi token xác thực trong header
      )
      console.log("API Response:", response.data) // Debug kết quả trả về từ API
      setData(response.data.data) // Cập nhật state data với danh sách đơn hàng nhận được
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error.response?.data || error)
    }
  }

  // useEffect: khi token thay đổi, nếu token tồn tại thì gọi hàm fetchOrders để lấy đơn hàng
  useEffect(() => {
    if (token) {
      fetchOrders()
    }
  }, [token])

  // useEffect: Sử dụng Server-Sent Events (SSE) để nhận thông báo cập nhật đơn hàng thời gian thực
  useEffect(() => {
    const eventSource = new EventSource(url + "/api/order/updates")
    // Khi có tin nhắn từ SSE, cập nhật đơn hàng tương ứng trong state
    eventSource.onmessage = (event) => {
      const updatedOrder = JSON.parse(event.data)
      setData((prevData) =>
        prevData.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      )
    }
    // Khi component unmount, đóng kết nối SSE
    return () => {
      eventSource.close()
    }
  }, [url])

  return (
    <div className="my-orders">
      <h2>Đơn hàng của tôi</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              {/* Hiển thị icon của đơn hàng */}
              <img src={assets.parcel_icon} alt="" />
              {/* Hiển thị danh sách món ăn trong đơn hàng */}
              <p>
                {order.items.map((item, index) => {
                  // Nếu là món cuối cùng, không thêm dấu phẩy
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity
                  } else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              {/* Hiển thị tổng số tiền của đơn hàng */}
              <p>{order.amount.toLocaleString()} VNĐ</p>
              {/* Hiển thị số lượng món ăn trong đơn hàng */}
              <p>Số Lượng: {order.items.length}</p>
              {/* Hiển thị trạng thái của đơn hàng */}
              <p>
                <span>&#x25cf; </span>
                <b>{order.status}</b>
              </p>
              {/* Nút "Theo dõi đơn hàng" để làm mới danh sách đơn hàng */}
              <button onClick={fetchOrders}>Theo dõi đơn hàng</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders
