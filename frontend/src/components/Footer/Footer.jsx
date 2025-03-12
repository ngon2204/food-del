import React from "react" // Import React để sử dụng JSX
import "./Footer.css" // Import file CSS style cho Footer
import { assets } from "../../assets/assets" // Import assets chứa logo và icon

// Component Footer hiển thị phần chân trang của website
const Footer = () => {
  return (
    <div className="footer" id="footer">
      {/* Nội dung chính của Footer */}
      <div className="footer-content">
        {/* Phần bên trái: logo, mô tả và icon mạng xã hội */}
        <div className="footer-content-left">
          <img src={assets.logo} alt="" /> {/* Hiển thị logo */}
          <p>
            Nơi vị giác thăng hoa, mang đến những trải nghiệm ẩm thực tuyệt vời,
            ấm áp như gia đình, nơi mỗi món ăn không chỉ là thức ăn mà còn là
            những kỷ niệm gắn bó.
          </p>
          {/* Các icon mạng xã hội */}
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.instagram_icon} alt="" />
          </div>
        </div>
        {/* Phần giữa: thông tin về quán ăn */}
        <div className="footer-content-center">
          <h2>Quán Ăn Sáu Hằng</h2>
          <ul>
            <li>Trang chủ</li>
            <li>Về chúng tôi</li>
            <li>Giao hàng</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>
        {/* Phần bên phải: thông tin liên hệ */}
        <div className="footer-content-right">
          <h2>Liên Hệ</h2>
          <ul>
            <li>+0347-020-083</li>
            <li>hoangngon29@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr /> {/* Đường kẻ ngang phân cách nội dung */}
      <p className="footer-copyright">
        Copyright © 2024 SauHang.com - All Right Reserved.
      </p>
    </div>
  )
}

export default Footer
