import React, { useContext, useState } from "react" // Import React, useContext và useState để quản lý state và context
import "./LoginPopup.css" // Import file CSS để style cho LoginPopup
import { assets } from "../../assets/assets" // Import assets chứa các icon, hình ảnh dùng trong popup
import { StoreContext } from "../../context/StoreContext" // Import context chứa thông tin global (url, token, ...)
import axios from "axios" // Import axios để thực hiện các HTTP request

// Component LoginPopup hiển thị popup đăng nhập/đăng ký cho người dùng
const LoginPopup = ({ setShowLogin }) => {
  // Lấy url và hàm setToken từ StoreContext
  const { url, setToken } = useContext(StoreContext)

  // State để quản lý chế độ hiện tại: "Đăng Nhập" hoặc "Đăng Ký"
  const [currState, setCurrState] = useState("Đăng Nhập")

  // State để lưu trữ dữ liệu form (name, email, password)
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  // Hàm xử lý khi nhập dữ liệu vào các ô input
  const onChangeHandler = (event) => {
    const name = event.target.name // Lấy tên trường (name, email, hoặc password)
    const value = event.target.value // Lấy giá trị người dùng nhập vào
    // Cập nhật state data bằng cách giữ lại dữ liệu cũ và thay đổi giá trị của trường vừa nhập
    setData((data) => ({ ...data, [name]: value }))
  }

  // Hàm xử lý khi submit form (đăng nhập hoặc đăng ký)
  const onLogin = async (event) => {
    event.preventDefault() // Ngăn form reload trang
    let newUrl = url // Bắt đầu từ url gốc trong context

    // Nếu đang ở trạng thái "Đăng Nhập" thì thêm endpoint login, ngược lại thêm endpoint register
    if (currState === "Đăng Nhập") {
      newUrl += "/api/user/login"
    } else {
      newUrl += "/api/user/register"
    }

    // Gửi POST request đến API với dữ liệu người dùng
    const response = await axios.post(newUrl, data)

    if (response.data.success) {
      // Nếu thành công, cập nhật token vào context và lưu vào localStorage
      setToken(response.data.token)
      localStorage.setItem("token", response.data.token)
      // Đóng popup đăng nhập
      setShowLogin(false)
    } else {
      // Nếu thất bại, hiện thông báo lỗi
      alert(response.data.message)
    }
  }

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        {/* Tiêu đề popup và nút đóng */}
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)} // Đóng popup khi click icon "cross"
            src={assets.cross_icon}
            alt=""
          />
        </div>
        {/* Các ô input của form */}
        <div className="login-popup-inputs">
          {/* Nếu trạng thái là "Đăng Nhập", không hiển thị input tên */}
          {currState === "Đăng Nhập" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Tên của bạn"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Email của bạn"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password của bạn"
            required
          />
        </div>
        {/* Nút submit: hiển thị nội dung dựa trên trạng thái (Đăng Ký hay Đăng Nhập) */}
        <button type="submit">
          {currState === "Đăng Ký" ? "Tạo tài khoản" : "Đăng Nhập"}
        </button>
        {/* Điều khoản sử dụng và chính sách bảo mật */}
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>Tôi chấp nhận các điều khoản sử dụng và chính sách bảo mật.</p>
        </div>
        {/* Liên kết chuyển đổi giữa trạng thái đăng nhập và đăng ký */}
        {currState === "Đăng Nhập" ? (
          <p>
            Tạo tài khoản mới?{" "}
            <span onClick={() => setCurrState("Đăng Ký")}>Tại đây</span>
          </p>
        ) : (
          <p>
            Đã có tài khoản?{" "}
            <span onClick={() => setCurrState("Đăng Nhập")}>
              Đăng nhập tại đây
            </span>
          </p>
        )}
      </form>
    </div>
  )
}

export default LoginPopup
