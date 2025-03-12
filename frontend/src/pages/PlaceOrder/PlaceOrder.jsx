import React, { useContext, useEffect, useState } from "react" // Import React và các hook cần thiết
import "./PlaceOrder.css" // Import CSS cho component PlaceOrder
import { StoreContext } from "../../context/StoreContext" // Import StoreContext để lấy dữ liệu global (token, giỏ hàng, món ăn, v.v.)
import axios from "axios" // Import axios để call API
import { useNavigate } from "react-router-dom" // Import useNavigate để điều hướng người dùng

// Component PlaceOrder: Xử lý đặt hàng, bao gồm thu thập thông tin giao hàng và lựa chọn phương thức thanh toán
const PlaceOrder = () => {
  // Lấy các giá trị cần thiết từ StoreContext
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext)

  // State lưu trữ thông tin giao hàng (tên, email, điện thoại, địa chỉ)
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })

  // State cho phương thức thanh toán: mặc định là "COD" (Thanh toán khi nhận hàng)
  const [paymentMethod, setPaymentMethod] = useState("COD")

  // Khi component mount, load thông tin địa chỉ đã chọn từ localStorage (nếu có)
  useEffect(() => {
    const selectedAddress = JSON.parse(localStorage.getItem("selectedAddress"))
    if (selectedAddress) {
      setData({
        name: selectedAddress.name || "",
        phone: selectedAddress.phone || "",
        address: selectedAddress.address || "",
        email: ""
      })
    }
  }, [])

  // Hàm xử lý thay đổi dữ liệu trong form
  const onChangeHandler = (event) => {
    const { name, value } = event.target
    // Cập nhật state data cho field tương ứng
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const navigate = useNavigate() // Khởi tạo hàm điều hướng

  // Kiểm tra: nếu chưa đăng nhập hoặc giỏ hàng trống thì chuyển về trang giỏ hàng
  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart")
    }
  }, [token])

  // Hàm placeOrder: Xử lý việc đặt hàng, gọi API và xử lý phản hồi từ server
  const placeOrder = async (event) => {
    event.preventDefault() // Ngăn form reload trang khi submit

    // Gom dữ liệu sản phẩm trong giỏ hàng: duyệt qua danh sách món ăn và lấy các món có số lượng > 0
    let orderItems = []
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] }
        orderItems.push(itemInfo)
      }
    })

    // Chuẩn bị payload cho API: thông tin user (dùng token làm định danh), địa chỉ, danh sách món, tổng tiền, phương thức thanh toán
    let orderData = {
      userId: token,
      address: data,
      items: orderItems,
      amount: getTotalCartAmount(),
      paymentMethod: paymentMethod // Gửi lên server để server biết user chọn COD hay Card
    }

    try {
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        // Nếu đặt hàng thành công, chuyển hướng dựa theo phương thức thanh toán
        if (paymentMethod === "COD") {
          // Với COD, chuyển thẳng tới trang "Đơn hàng của tôi"
          navigate("/myorders")
        } else {
          // Với thanh toán bằng thẻ, chuyển hướng tới cổng thanh toán
          window.location.href = response.data.paymentUrl
        }
      } else {
        alert("Lỗi đặt hàng")
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error)
      alert("Có lỗi xảy ra. Vui lòng thử lại!")
    }
  }

  return (
    <form onSubmit={placeOrder} className="place-order">
      {/* Phần bên trái: Thông tin giao hàng */}
      <div className="place-order-left">
        <p className="title">Thông Tin Giao Hàng</p>
        <input
          required
          name="name"
          onChange={onChangeHandler}
          value={data.name}
          type="text"
          placeholder="Tên "
        />

        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Số Điện Thoại"
        />
        <input
          required
          name="address"
          onChange={onChangeHandler}
          value={data.address}
          type="text"
          placeholder="Địa Chỉ"
        />
      </div>

      {/* Phần bên phải: Thông tin giỏ hàng và thanh toán */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Tổng Giỏ Hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tổng Tạm Tính</p>
              <p>{getTotalCartAmount().toLocaleString()} VNĐ</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí Giao Hàng</p>
              <p>20,000 VNĐ</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Tổng Cộng</b>
              <b>{(getTotalCartAmount() + 20000).toLocaleString()} VNĐ</b>
            </div>
          </div>

          {/* Phần chọn phương thức thanh toán */}
          <div className="payment-method">
            <h3>Phương Thức Thanh Toán</h3>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              COD (Thanh toán khi nhận hàng)
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="CARD"
                checked={paymentMethod === "CARD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Thẻ Tín Dụng / Ghi Nợ
            </label>
          </div>

          {/* Nút submit để đặt hàng */}
          <button type="submit">Thanh Toán Đơn Hàng</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
