import React, { useEffect, useState } from "react" // Import React cùng hook useEffect, useState
import axios from "axios" // Dùng axios để call API
import { Bar } from "react-chartjs-2" // Biểu đồ cột từ ChartJS
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js" // Các module cần thiết cho ChartJS
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Avatar
} from "@mui/material" // Các component từ Material UI để xây dựng giao diện
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  Label,
  LabelList
} from "recharts" // Các component từ Recharts để vẽ biểu đồ tròn

// Đăng ký các module cho ChartJS (bắt buộc để biểu đồ hoạt động)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Mảng màu dùng cho các phần tử trong biểu đồ tròn (pie chart)
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"]

// Component Dashboard: Hiển thị các thống kê và biểu đồ
const Dashboard = ({ url }) => {
  // State chứa thống kê chung: tổng đơn hàng, người dùng và doanh thu
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  })
  // State lưu doanh thu theo tháng (cho biểu đồ cột)
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([])
  // State lưu ngày đang được chọn (mặc định "today")
  const [timeFilter, setTimeFilter] = useState("today")
  // State kiểm soát hiển thị biểu đồ tròn doanh thu theo ngày
  const [showPieChart, setShowPieChart] = useState(false)
  // State chứa danh sách các món ăn bán chạy nhất
  const [popularItems, setPopularItems] = useState([])
  // State chứa doanh thu trong ngày đã chọn
  const [dailyRevenue, setDailyRevenue] = useState(0)

  // useEffect gọi API để lấy dữ liệu thống kê khi component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Call đồng thời 5 API: đơn hàng, người dùng, doanh thu tổng, doanh thu theo tháng và món ăn bán chạy
        const [
          ordersRes,
          usersRes,
          revenueRes,
          monthlyRevenueRes,
          popularItemsRes
        ] = await Promise.all([
          axios.get(`${url}/api/orders/stats`),
          axios.get(`${url}/api/users/stats`),
          axios.get(`${url}/api/revenue/stats`),
          axios.get(`${url}/api/revenue/monthly`),
          axios.get(`${url}/api/revenue/best-selling-dishes`)
        ])

        // Cập nhật các thống kê chung
        setStats({
          totalOrders: ordersRes.data.totalOrders,
          totalUsers: usersRes.data.totalUsers,
          totalRevenue: revenueRes.data.totalRevenue
        })

        // Cập nhật doanh thu theo tháng và danh sách món ăn bán chạy
        setMonthlyRevenueData(monthlyRevenueRes.data.monthlyRevenue)
        setPopularItems(popularItemsRes.data.bestSellingDishes)
        console.log("Popular Items:", popularItemsRes.data.bestSellingDishes) // Debug: in ra danh sách món ăn bán chạy
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [url]) // Chạy lại khi URL thay đổi

  // Hàm xử lý khi thay đổi ngày trong date picker
  const handleDateChange = async (date) => {
    setTimeFilter(date) // Cập nhật ngày mới
    setShowPieChart(true) // Bật hiển thị biểu đồ tròn
    try {
      // Gọi API để lấy doanh thu trong ngày đã chọn
      const response = await axios.get(`${url}/api/revenue/daily`, {
        params: { date }
      })
      setDailyRevenue(response.data.dailyRevenue)
    } catch (error) {
      console.error("Error fetching daily revenue:", error)
    }
  }

  // Hàm định dạng ngày từ "YYYY-MM-DD" sang "DD/MM/YYYY"
  const formatDate = (date) => {
    const [year, month, day] = date.split("-")
    return `${day}/${month}/${year}`
  }

  // Hàm định dạng tiền tệ theo chuẩn VN (VND)
  const formatCurrency = (amount) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })

  // Dữ liệu cho biểu đồ cột (bar chart) doanh thu theo tháng
  const chartData = {
    labels: monthlyRevenueData.map((item) => `Tháng ${item.month}`),
    datasets: [
      {
        label: "Doanh Thu",
        data: monthlyRevenueData.map((item) => item.totalRevenue),
        backgroundColor: "rgba(33, 150, 243, 0.5)",
        borderColor: "rgba(33, 150, 243, 1)",
        borderWidth: 1
      }
    ]
  }

  // Dữ liệu cho biểu đồ tròn (pie chart) doanh thu ngày
  // So sánh doanh thu trong ngày với tổng doanh thu còn lại
  const pieData = [
    { name: "Doanh Thu", value: dailyRevenue },
    { name: "Khác", value: stats.totalRevenue - dailyRevenue }
  ]

  return (
    <Container sx={{ mt: 4 }}>
      {/* Tiêu đề Dashboard */}
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "#6d6d6d", marginBottom: "16px" }}
      >
        Dashboard
      </Typography>

      {/* Grid hiển thị 3 thẻ thống kê: Tổng Đơn Hàng, Tổng Người Dùng, Tổng Doanh Thu */}
      <Grid container spacing={3}>
        {["Tổng Đơn Hàng", "Tổng Người Dùng", "Tổng Doanh Thu"].map(
          (title, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card
                sx={{
                  backgroundColor: ["#FFA500", "#4caf50", "#2196f3"][i], // Màu nền khác nhau cho từng thẻ
                  color: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  p: 2,
                  textAlign: "center"
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {title}
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {/* Hiển thị doanh thu dưới dạng tiền tệ, các thẻ còn lại hiển thị số */}
                    {i === 2
                      ? formatCurrency(stats.totalRevenue)
                      : [stats.totalOrders, stats.totalUsers][i]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        )}
      </Grid>

      {/* Grid chứa 2 card: Top 5 món bán chạy và Date Picker */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Card hiển thị Top 5 món bán chạy */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">Top 5 Món Bán Chạy</Typography>
              {popularItems.map((item, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", mt: 2 }}
                >
                  {/* Avatar hiển thị số thứ tự và hình ảnh món ăn */}
                  <Avatar
                    sx={{ bgcolor: COLORS[index % COLORS.length], mr: 2 }}
                    src={`${url}/images/${item._id.image}`}
                  >
                    {index + 1}
                  </Avatar>
                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography variant="body1">{item._id.name}</Typography>
                  </Box>
                  {/* Hiển thị số đơn hàng của món ăn */}
                  <Typography variant="body2">
                    {item.totalQuantity} đơn
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Card chứa Date Picker để chọn ngày lấy doanh thu */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">Chọn Ngày</Typography>
              <TextField
                type="date"
                value={timeFilter}
                onChange={(e) => handleDateChange(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Nếu đã chọn ngày, hiển thị biểu đồ tròn doanh thu trong ngày */}
      {showPieChart && (
        <Card sx={{ mt: 3, p: 2, maxWidth: 800, mx: "auto" }}>
          <Typography variant="h6" align="center">
            Doanh Thu Ngày {formatDate(timeFilter)}
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <PieChart width={450} height={350}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              >
                <Cell fill="#0088FE" />
                <Label
                  value={formatCurrency(dailyRevenue)}
                  position="center"
                  fill="#333"
                  style={{ fontSize: "20px", fontWeight: "bold" }}
                />
              </Pie>
              <RechartsTooltip formatter={(value) => formatCurrency(value)} />
              <RechartsLegend
                layout="vertical"
                align="right"
                verticalAlign="middle"
              />
            </PieChart>
          </div>
        </Card>
      )}

      {/* Card chứa biểu đồ cột hiển thị doanh thu theo tháng */}
      <Card sx={{ mt: 3, p: 2, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h6" align="center">
          Doanh Thu Theo Tháng
        </Typography>
        <Bar data={chartData} height={80} /> {/* Giảm chiều cao biểu đồ */}
      </Card>
    </Container>
  )
}

export default Dashboard
