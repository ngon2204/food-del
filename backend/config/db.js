import mongoose from "mongoose" // Import thư viện mongoose để kết nối MongoDB

// Hàm connectDB: Kết nối đến cơ sở dữ liệu MongoDB sử dụng connection string
export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://hoangngon29:01102002@cluster0.zvxv6.mongodb.net/food-del"
    ) // Kết nối đến MongoDB Atlas với chuỗi kết nối đã cung cấp
    .then(() => console.log("DB connected")) // Log "DB connected" khi kết nối thành công
}
