import React, { useContext } from "react" // Import React và hook useContext để truy cập context
import "./FoodItem.css" // Import file CSS để style cho component FoodItem
import { assets } from "../../assets/assets" // Import assets chứa các icon, hình ảnh
import { StoreContext } from "../../context/StoreContext" // Import context để lấy dữ liệu và các hàm thao tác giỏ hàng

// Component FoodItem hiển thị thông tin của một món ăn và cho phép thêm/xóa món đó vào giỏ hàng
const FoodItem = ({ id, name, price, description, image }) => {
  // Lấy dữ liệu và các hàm xử lý từ StoreContext
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext)

  return (
    <div className="food-item">
      {/* Container chứa hình ảnh món ăn và các nút thêm/xóa */}
      <div className="food-item-img-container">
        {/* Hiển thị hình ảnh món ăn */}
        <img
          className="food-item-image"
          src={url + "/images/" + image}
          alt=""
        />
        {/* Nếu món ăn chưa có trong giỏ, hiển thị nút "thêm" (icon trắng) */}
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)} // Khi click, gọi hàm addToCart với id món ăn
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          // Nếu món ăn đã có trong giỏ, hiển thị bộ đếm số lượng và các nút thêm/xóa
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)} // Click vào icon trừ để giảm số lượng
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartItems[id]}</p> {/* Hiển thị số lượng món ăn trong giỏ */}
            <img
              onClick={() => addToCart(id)} // Click vào icon cộng để tăng số lượng
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      {/* Container hiển thị thông tin món ăn */}
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p> {/* Hiển thị tên món ăn */}
          {/* Có thể thêm rating ở đây (đoạn code hiện đang comment) */}
          {/* <img src={assets.rating_starts} alt="" /> */}
        </div>
        <p className="food-item-desc">{description}</p> {/* Mô tả món ăn */}
        <p className="food-item-price">
          {new Intl.NumberFormat("vi-VN", {
            // Định dạng giá theo tiền Việt Nam
            style: "currency",
            currency: "VND"
          }).format(price)}
        </p>
      </div>
    </div>
  )
}

export default FoodItem
