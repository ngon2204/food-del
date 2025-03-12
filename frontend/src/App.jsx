import React, { useState } from "react"
import Navbar from "./components/Navbar/Navbar"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Cart from "./pages/Cart/Cart"
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder"
import Footer from "./components/Footer/Footer"
import LoginPopup from "./components/LoginPopup/LoginPopup"
import Verify from "./pages/Verify/Verify"
import MyOrders from "./pages/MyOrders/MyOrders"
import Address from "./pages/Address/Address"

// Khai báo thành phần chính App
const App = () => {
  // Khởi tạo state showLogin với giá trị ban đầu là false
  // Hàm setShowLogin dùng để thay đổi giá trị của showLogin

  const [showLogin, setShowLogin] = useState(false)

  // Giao diện của ứng dụng (JSX)
  return (
    <>
      {/* Nếu showLogin là true, hiển thị LoginPopup, nếu không thì không hiển thị gì */}
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}

      <div className="app">
        {/* Thành phần Navbar được truyền prop setShowLogin */}
        <Navbar setShowLogin={setShowLogin} />

        {/* Điều hướng giữa các trang bằng Routes và Route */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Trang chủ */}
          <Route path="/cart" element={<Cart />} /> {/* Trang giỏ hàng */}
          <Route path="/order" element={<PlaceOrder />} />{" "}
          {/* Trang đặt hàng */}
          <Route path="/verify" element={<Verify />} />{" "}
          {/* Trang xác nhận đơn hàng */}
          <Route path="/myorders" element={<MyOrders />} />{" "}
          {/* Trang lịch sử đơn hàng */}
          <Route path="/address" element={<Address />} /> {/* Trang địa chỉ */}
        </Routes>
      </div>

      {/* Footer hiển thị ở cuối trang */}
      <Footer />
    </>
  )
}

// Xuất thành phần App để sử dụng ở các nơi khác
export default App
