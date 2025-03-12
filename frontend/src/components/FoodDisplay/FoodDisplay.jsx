import React, { useContext } from "react" // Import React và hook useContext để truy cập context
import "./FoodDisplay.css" // Import file CSS để style cho component FoodDisplay
import { StoreContext } from "../../context/StoreContext" // Import context chứa danh sách món ăn
import FoodItem from "../FoodItem/FoodItem" // Import component FoodItem để hiển thị thông tin món ăn

// Component FoodDisplay hiển thị các món ăn dựa theo danh mục được chọn
const FoodDisplay = ({ category }) => {
  // Lấy danh sách món ăn từ StoreContext
  const { food_list } = useContext(StoreContext)

  return (
    <div className="food-display" id="food-display">
      <h2>Các món ăn được yêu thích nhất!</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          // Nếu category là "All" hoặc trùng với category của món ăn, hiển thị món đó
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            )
          }
          // Nếu không thỏa điều kiện, trả về undefined (không render gì)
        })}
      </div>
    </div>
  )
}

export default FoodDisplay
