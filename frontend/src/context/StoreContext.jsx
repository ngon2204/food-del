import { createContext, useEffect, useState } from "react" // Import React hooks để tạo context và quản lý state
import axios from "axios" // Import axios để call API

// Tạo StoreContext để chia sẻ state cho toàn bộ ứng dụng
export const StoreContext = createContext(null)

// Component Provider của StoreContext
const StoreContextProvider = (prop) => {
  // State lưu trữ giỏ hàng: dạng object, key là itemId, value là số lượng
  const [cartItems, setCartItems] = useState({})
  // URL của server backend
  const url = "https://food-del-backend-fbe8.onrender.com"
  // State token lưu trữ JWT từ đăng nhập
  const [token, setToken] = useState("")
  // State lưu danh sách món ăn lấy từ API
  const [food_list, setFoodList] = useState([])

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = async (itemId) => {
    // Cập nhật state giỏ hàng local
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }))
    // Nếu người dùng đã đăng nhập (token tồn tại), gọi API thêm sản phẩm vào giỏ hàng
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } } // Cập nhật headers cho request
      )
    }
  }

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (itemId) => {
    // Giảm số lượng sản phẩm trong state local
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    // Nếu đã có token, gọi API xóa sản phẩm khỏi giỏ hàng trên server
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } } // Cập nhật headers
      )
    }
  }

  // Hàm tính tổng số tiền của giỏ hàng dựa trên giá của sản phẩm và số lượng
  const getTotalCartAmount = () => {
    let totalAmount = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        // Tìm thông tin sản phẩm trong danh sách food_list
        let itemInfo = food_list.find((product) => product._id === item)
        totalAmount += itemInfo.price * cartItems[item]
      }
    }
    return totalAmount
  }

  // Hàm lấy danh sách món ăn từ API
  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list")
    setFoodList(response.data.data)
  }

  // Hàm load dữ liệu giỏ hàng từ server dựa trên token
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { Authorization: `Bearer ${token}` } } // Định dạng header đúng
      )
      setCartItems(response.data.cartData)
    } catch (error) {
      console.error("Failed to load cart data:", error)
    }
  }

  // Khi component mount, load danh sách món ăn và token từ localStorage, sau đó load dữ liệu giỏ hàng nếu có token
  useEffect(() => {
     async function loadData() {
     // await fetchFoodList()
     //   const storedToken = localStorage.getItem("token")
     //   if (storedToken) {
     //     setToken(storedToken)
     //     await loadCartData(storedToken)
     //   }
    }
    loadData()
  }, [])

  // Các giá trị và hàm được chia sẻ thông qua context
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  }

  return (
    <StoreContext.Provider value={contextValue}>
      {prop.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider
