import React from "react" // Import React để sử dụng JSX
import "./ExploreMenu.css" // Import file CSS để style cho component ExploreMenu
import { menu_list } from "../../assets/assets" // Import danh sách menu từ assets

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      {/* Tiêu đề và mô tả giới thiệu bộ sưu tập món ăn */}
      <h1>Khám phá bộ sưu tập món ăn đặc sắc của chúng tôi!</h1>
      <p className="explore-menu-text">
        Chúng tôi mang đến thực đơn đa dạng, đáp ứng cơn thèm của bạn và nâng
        tầm trải nghiệm ẩm thực, từng món ăn một.
      </p>
      {/* Danh sách các mục menu */}
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              key={index}
              className="explore-menu-list-item"
              // Khi click vào mục menu: nếu mục đã được chọn thì chuyển về "All", ngược lại chuyển sang menu đó
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
            >
              {/* Hiển thị hình ảnh của menu. Nếu mục đang chọn, thêm class "active" để highlight */}
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt=""
              />
              {/* Hiển thị tên menu */}
              <p>{item.menu_name}</p>
            </div>
          )
        })}
      </div>
      <hr /> {/* Đường kẻ phân cách */}
    </div>
  )
}

export default ExploreMenu
