import React, { useState, useEffect } from "react" // Import React cùng hook useState, useEffect
import "./Orders.css" // Import file CSS cho giao diện của Orders
import axios from "axios" // Dùng axios để gọi API
import { toast } from "react-toastify" // Thông báo toast cho người dùng
import { assets } from "../../assets/assets" // Import các assets (ví dụ: icon)

const Orders = ({ url }) => {
  // State chứa danh sách đơn hàng, ban đầu rỗng
  const [orders, setOrders] = useState([])

  // Hàm fetchAllOrders: Lấy tất cả đơn hàng từ API
  const fetchAllOrders = async () => {
    try {
      // Gọi API lấy danh sách đơn hàng
      const response = await axios.get(url + "/api/order/list")
      console.log("Response from API:", response.data) // Debug kết quả trả về
      // Nếu API trả về thành công, cập nhật state orders
      if (response.data.success) {
        setOrders(response.data.data)
      } else {
        toast.error("Lỗi lấy đơn hàng")
      }
    } catch (error) {
      console.error("API error:", error)
      toast.error("Không thể tải đơn hàng")
    }
  }

  // Hàm updateOrderStatus: Cập nhật trạng thái của đơn hàng
  const updateOrderStatus = async (orderId, status) => {
    try {
      // Lấy token từ localStorage để xác thực
      const token = localStorage.getItem("token")
      // Gọi API cập nhật trạng thái đơn hàng, truyền orderId, status và token trong header
      const response = await axios.post(
        url + "/api/order/updateStatus",
        { orderId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) {
        toast.success("Cập nhật trạng thái đơn hàng thành công")
        fetchAllOrders() // Làm mới danh sách đơn hàng sau khi cập nhật

        // Phát sự kiện cập nhật đơn hàng
        const updatedOrder = orders.find((order) => order._id === orderId)
        if (updatedOrder) {
          updatedOrder.status = status
          // Mở EventSource để lắng nghe cập nhật và phát sự kiện (giả sử có orderUpdateEmitter)
          const eventSource = new EventSource(url + "/api/order/updates")
          eventSource.onopen = () => {
            eventSource.close()
            orderUpdateEmitter.emit("orderUpdate", updatedOrder)
          }
        }
      } else {
        toast.error("Lỗi cập nhật trạng thái đơn hàng")
      }
    } catch (error) {
      console.error("API error:", error)
      toast.error("Không thể cập nhật trạng thái đơn hàng")
    }
  }

  // useEffect: Khi component mount, gọi fetchAllOrders để load đơn hàng
  useEffect(() => {
    fetchAllOrders()
  }, [])

  return (
    <div className="order add">
      <h3>Danh Sách Đơn Hàng</h3>
      <div className="order-list">
        {/* Nếu không có đơn hàng nào, hiển thị thông báo */}
        {orders.length === 0 ? (
          <p>Không có đơn hàng nào.</p>
        ) : (
          // Duyệt qua danh sách orders và hiển thị từng đơn hàng
          orders.map((order, index) => (
            <div key={index} className="order-item">
              {/* Icon đơn hàng */}
              <img src={assets.parcel_icon} alt="" />
              <div>
                {/* Hiển thị danh sách món ăn của đơn hàng */}
                <p className="order-item-food">
                  {order.items.map(
                    (item, i) =>
                      `${item.name} x ${item.quantity}${
                        i < order.items.length - 1 ? ", " : ""
                      }`
                  )}
                </p>
                {/* Hiển thị tên người nhận (nếu có thông tin địa chỉ) */}
                <p className="order-item-name">
                  {order.address
                    ? `${order.address.name || ""} ${
                        order.address.lastName || ""
                      }`
                    : "Không có thông tin"}
                </p>
                {/* Hiển thị địa chỉ nhận hàng */}
                <div className="order-item-address">
                  <p>{order.address?.address || "Không có địa chỉ"}</p>
                  <p>
                    {order.address?.city || ""} {order.address?.ward || ""}{" "}
                    {order.address?.conscious || ""}
                  </p>
                </div>
                {/* Hiển thị số điện thoại */}
                <p className="order-item-phone">
                  {order.address?.phone || "Không có số điện thoại"}
                </p>
              </div>
              {/* Hiển thị số lượng món ăn và tổng tiền của đơn hàng */}
              <p>Số lượng: {order.items.length}</p>
              <p>{order.amount.toLocaleString()} VNĐ</p>
              {/* Dropdown cập nhật trạng thái đơn hàng */}
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
              >
                <option value="Đang chuẩn bị món ăn">
                  Đang Chuẩn Bị Món Ăn
                </option>
                <option value="Đang giao hàng">Đang Giao Hàng</option>
                <option value="Đã xử lý xong">Đã Xử Lý Xong</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
//
export default Orders
