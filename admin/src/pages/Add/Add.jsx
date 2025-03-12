import React, { useState } from "react"
import "./Add.css"
import { assets } from "../../assets/assets.js"
import axios from "axios"
import { toast } from "react-toastify"

const Add = ({ url }) => {
  // Khởi tạo state lưu trữ file ảnh, ban đầu chưa có ảnh nên set là false
  const [image, setImage] = useState(false)
  // Khởi tạo state chứa thông tin món ăn: tên, mô tả, giá, danh mục (mặc định là "Bún")
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Bún"
  })

  // Hàm xử lý thay đổi dữ liệu từ các ô input, textarea, select,...
  const onChangeHandler = (event) => {
    // Lấy tên và giá trị của input đang thay đổi
    const name = event.target.name
    const value = event.target.value
    // Cập nhật state data bằng cách giữ lại dữ liệu cũ và thay đổi giá trị của key tương ứng
    setData((data) => ({ ...data, [name]: value }))
  }

  // Hàm xử lý gửi dữ liệu khi form được submit
  const onSubmitHandler = async (event) => {
    event.preventDefault() // Ngăn form tự động reload trang
    // Tạo đối tượng FormData để chuẩn bị gửi dữ liệu, bao gồm cả file ảnh
    const formData = new FormData()
    formData.append("name", data.name) // Thêm tên món ăn
    formData.append("description", data.description) // Thêm mô tả món ăn
    formData.append("price", Number(data.price)) // Thêm giá món ăn, chuyển sang kiểu Number
    formData.append("category", data.category) // Thêm danh mục món ăn
    formData.append("image", image) // Thêm file ảnh đã chọn

    // Gửi dữ liệu đến API thông qua axios POST request
    const response = await axios.post(`${url}/api/food/add`, formData)
    if (response.data.success) {
      // Nếu gửi thành công, reset lại form (dữ liệu và hình ảnh)
      setData({ name: "", description: "", price: "", category: "Bún" })
      setImage(false)
      // Hiển thị thông báo thành công cho người dùng
      toast.success((response.data.message = "Thêm Thành Công"))
    } else {
      // Nếu có lỗi xảy ra, hiển thị thông báo lỗi
      toast.error(response.data.message)
    }
  }

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        {/* Phần upload hình ảnh */}
        <div className="add-img-upload flex-col">
          <p>Tải Hình Ảnh Lên</p>
          <label htmlFor="image">
            {/* Nếu có ảnh được chọn thì hiển thị preview, nếu không hiển thị ảnh mặc định từ assets */}
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="upload-area"
            />
          </label>
          {/* Input file để chọn ảnh, ẩn đi để dùng label kích hoạt */}
          <input
            onChange={(e) => setImage(e.target.files[0])} // Khi chọn ảnh, lưu file ảnh vào state
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        {/* Phần nhập tên món ăn */}
        <div className="add-product-name flex-col">
          <p>Tên Món Ăn</p>
          <input
            onChange={onChangeHandler} // Xử lý khi nhập tên món ăn
            value={data.name} // Binding giá trị với state data.name
            type="text"
            name="name"
            placeholder="Hãy nhập nội dung"
          />
        </div>
        {/* Phần nhập mô tả món ăn */}
        <div className="add-product-description flex-col">
          <p>Mô Tả Món Ăn</p>
          <textarea
            onChange={onChangeHandler} // Xử lý khi thay đổi mô tả món ăn
            value={data.description} // Binding với state data.description
            name="description"
            rows="6"
            placeholder="Hãy nhập nội dung"
            required
          ></textarea>
        </div>
        {/* Phần chọn danh mục và nhập giá món ăn */}
        <div className="add-category-price">
          {/* Dropdown chọn danh mục món ăn */}
          <div className="add-category flex-col">
            <p>Danh Mục Món Ăn</p>
            <select onChange={onChangeHandler} name="category">
              <option value="Bún">Bún</option>
              <option value="Phở">Phở</option>
              <option value="Hủ Tiếu">Hủ Tiếu</option>
              <option value="Bánh Canh">Bánh Canh</option>
              <option value="Cơm">Cơm</option>
              <option value="Bò Kho">Bò Kho</option>
              <option value="Mì">Mì</option>
            </select>
          </div>
          {/* Input nhập giá món ăn */}
          <div className="add-price flex-col">
            <p>Giá Món Ăn</p>
            <input
              onChange={onChangeHandler} // Xử lý khi nhập giá
              value={data.price} // Binding với state data.price
              type="Number"
              name="price"
              placeholder="35.000 VNĐ"
            />
          </div>
        </div>
        {/* Nút submit để gửi form */}
        <button type="submit" className="add-btn">
          Thêm
        </button>
      </form>
    </div>
  )
}

export default Add
