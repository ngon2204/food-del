import React, { useContext, useState } from "react" // Import React và các hook cần thiết
import "./Navbar.css" // Import file CSS để style cho Navbar
import { assets } from "../../assets/assets" // Import assets chứa logo, icon, v.v.
import { Link, useNavigate } from "react-router-dom" // Import Link và useNavigate để xử lý chuyển trang
import { StoreContext } from "../../context/StoreContext" // Import context chứa dữ liệu global như token, giỏ hàng, danh sách món ăn

// Component Navbar hiển thị thanh điều hướng trên website
const Navbar = ({ setShowLogin }) => {
  // State quản lý menu đang được active, mặc định là "menu"
  const [menu, setMenu] = useState("menu")

  // Lấy dữ liệu và các hàm từ StoreContext
  const { getTotalCartAmount, token, setToken, cartItems, food_list } =
    useContext(StoreContext)

  const navigate = useNavigate() // Hook để chuyển trang

  // Hàm đăng xuất: Xóa token khỏi localStorage, cập nhật context và chuyển về trang chủ
  const logout = () => {
    localStorage.removeItem("token")
    setToken("")
    navigate("/")
  }

  return (
    <div className="navbar">
      {/* Logo, click vào logo sẽ chuyển về trang chủ */}
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>

      {/* Menu chính của Navbar */}
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")} // Đánh dấu menu "home" khi click
          className={menu === "home" ? "active" : ""}
        >
          Trang Chủ
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")} // Đánh dấu menu "menu" khi click
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")} // Đánh dấu menu "contact-us" khi click
          className={menu === "contact-us" ? "active" : ""}
        >
          Liên Hệ
        </a>
      </ul>

      {/* Phần bên phải của Navbar: Giỏ hàng và Profile/Đăng nhập */}
      <div className="navbar-right">
        {/* Biểu tượng giỏ hàng với số lượng đơn hàng */}
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          {/* Hiển thị dấu chấm nếu có món trong giỏ hàng */}
          <div
            className={
              cartItems && food_list && getTotalCartAmount() === 0 ? "" : "dot"
            }
          ></div>
        </div>
        {/* Nếu chưa đăng nhập, hiển thị nút "Đăng Nhập", ngược lại hiển thị profile */}
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Đăng Nhập</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              {/* Tùy chọn xem đơn hàng */}
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                <p>Đơn hàng</p>
              </li>
              <hr />
              {/* Tùy chọn xem địa chỉ */}
              <li onClick={() => navigate("/address")}>
                <img src={assets.adress_icon} alt="" />
                <p>Địa Chỉ</p>
              </li>
              <hr />
              {/* Tùy chọn đăng xuất */}
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Thoát</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
