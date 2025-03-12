import React, { useContext } from "react" // Import React và useContext hook để truy cập StoreContext
import "./Cart.css" // Import CSS cho component Cart
import { StoreContext } from "../../context/StoreContext" // Import context chứa dữ liệu giỏ hàng và danh sách món ăn
import { useNavigate } from "react-router-dom" // Import useNavigate để điều hướng người dùng

const Cart = () => {
  // Lấy các giá trị cần thiết từ StoreContext
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext)

  // Khởi tạo hàm điều hướng
  const navigate = useNavigate()

  return (
    <div className="cart">
      {/* Phần danh sách các món trong giỏ hàng */}
      <div className="cart-items">
        {/* Tiêu đề của bảng giỏ hàng */}
        <div className="cart-items-title">
          <p>Sản Phẩm</p>
          <p>Tên Sản Phẩm</p>
          <p>Giá</p>
          <p>Số lượng</p>
          <p>Tổng Cộng</p>
          <p>Xóa</p>
        </div>
        <br />
        <hr />
        {/* Duyệt qua danh sách món ăn, hiển thị những món có trong giỏ */}
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  {/* Hiển thị hình ảnh món ăn */}
                  <img src={url + "/images/" + item.image} alt="" />
                  {/* Hiển thị tên món ăn */}
                  <p>{item.name}</p>
                  {/* Hiển thị giá đơn vị */}
                  <p>{item.price.toLocaleString()} VNĐ</p>
                  {/* Hiển thị số lượng món ăn trong giỏ */}
                  <p>{cartItems[item._id]}</p>
                  {/* Hiển thị tổng giá cho món ăn đó */}
                  <p>
                    {(item.price * cartItems[item._id]).toLocaleString()} VNĐ
                  </p>
                  {/* Nút xóa món ăn khỏi giỏ */}
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      {/* Phần tổng giỏ hàng và mã ưu đãi */}
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Tổng Giỏ Hàng</h2>
          <div>
            {/* Tổng tạm tính của giỏ hàng */}
            <div className="cart-total-details">
              <p>Tổng Tạm Tính</p>
              <p>{getTotalCartAmount().toLocaleString()} VNĐ</p>
            </div>
            <hr />
            {/* Phí giao hàng (20,000 VNĐ nếu giỏ hàng không rỗng) */}
            <div className="cart-total-details">
              <p>Phí Giao Hàng</p>
              <p>
                {(getTotalCartAmount() === 0 ? 0 : 20000).toLocaleString()} VNĐ
              </p>
            </div>
            <hr />
            {/* Tổng cộng: Tổng tạm tính + phí giao hàng */}
            <div className="cart-total-details">
              <b>Tổng Cộng</b>
              <b>
                {(getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + 20000
                ).toLocaleString()}{" "}
                VNĐ
              </b>
            </div>
          </div>
          {/* Nút chuyển đến trang thanh toán */}
          <button onClick={() => navigate("/order")}>
            Tiến Hành Thanh Toán
          </button>
        </div>
        {/* Phần nhập mã ưu đãi */}
        <div className="cart-promocode">
          <div>
            <p>Nếu có mã ưu đãi, hãy điền vào đây.</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Nhập mã giảm giá" />
              <button>Xác nhận</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
