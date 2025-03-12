// Import các thư viện cần thiết: React, CSS, axios (call API) và toast (thông báo)
import React, { useEffect, useState } from "react"
import "./List.css"
import axios from "axios"
import { toast } from "react-toastify"

// Component List: Hiển thị danh sách món ăn và hỗ trợ xóa món ăn
const List = ({ url }) => {
  // Khởi tạo state 'list' để chứa danh sách món ăn, ban đầu rỗng
  const [list, setList] = useState([])

  // Hàm fetchList: Gọi API lấy danh sách món ăn
  const fetchList = async () => {
    // Gọi API tại đường dẫn `${url}/api/food/list`
    const response = await axios.get(`${url}/api/food/list`)
    console.log(response.data) // Log dữ liệu nhận về để debug

    // Nếu API trả về thành công thì cập nhật state 'list' với dữ liệu
    if (response.data.success) {
      setList(response.data.data)
    } else {
      // Nếu có lỗi, hiển thị toast báo lỗi
      toast.error("Error")
    }
  }

  // Hàm removeFood: Gọi API xóa món ăn dựa theo id, sau đó cập nhật lại danh sách
  const removeFood = async (foodId) => {
    // Gọi API xóa món ăn tại `${url}/api/food/remove` với id truyền vào
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
    // Cập nhật lại danh sách món ăn sau khi xóa
    await fetchList()
    // Nếu xóa thành công, hiện thông báo thành công
    if (response.data.success) {
      toast.success((response.data.message = "Xóa Thành Công"))
    } else {
      // Nếu không thành công, hiện thông báo lỗi
      toast.error("Error")
    }
  }

  // useEffect: Khi component mount, gọi fetchList để lấy danh sách món ăn
  useEffect(() => {
    fetchList()
  }, [])

  // JSX: Giao diện hiển thị danh sách món ăn với bảng thông tin
  return (
    <div className="list add flex-col">
      {/* Tiêu đề danh sách */}
      <p>Tất Cả Món Ăn</p>
      <div className="list-table">
        {/* Tiêu đề cột của bảng */}
        <div className="list-table-format title">
          <b>Ảnh</b>
          <b>Tên</b>
          <b>Danh Mục</b>
          <b>Giá</b>
          <b>Xóa </b>
        </div>
        {/* Duyệt qua 'list' và hiển thị từng món ăn */}
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              {/* Hiển thị hình ảnh món ăn */}
              <img src={`${url}/images/` + item.image} alt="" />
              {/* Hiển thị tên món ăn */}
              <p>{item.name}</p>
              {/* Hiển thị danh mục món ăn */}
              <p>{item.category}</p>
              {/* Hiển thị giá món ăn */}
              <p>{item.price}</p>
              {/* Nút "Xóa" gọi hàm removeFood với id món ăn khi được click */}
              <p onClick={() => removeFood(item._id)} className="cursor">
                Xóa
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Export component List để sử dụng ở nơi khác
export default List
