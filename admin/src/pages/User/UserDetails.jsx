import React, { useEffect, useState } from "react" // Import React và các hook cần thiết
import { useParams } from "react-router-dom" // Dùng để lấy tham số từ URL (user id)
import axios from "axios" // Dùng để call API
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress
} from "@mui/material" // Import các component từ Material UI

// Component UserDetails: hiển thị thông tin chi tiết người dùng dựa theo id từ URL
const UserDetails = ({ url }) => {
  const { id } = useParams() // Lấy id người dùng từ URL
  const [userDetails, setUserDetails] = useState(null) // State chứa dữ liệu chi tiết người dùng, ban đầu null

  // Gọi API lấy thông tin người dùng khi component mount hoặc khi id, url thay đổi
  useEffect(() => {
    axios
      .get(`${url}/api/user/${id}`) // Call API với đường dẫn chứa id
      .then((response) => setUserDetails(response.data)) // Cập nhật state với dữ liệu trả về
      .catch((error) => console.error("Error fetching user details:", error))
  }, [id, url])

  // Nếu chưa có dữ liệu, hiển thị loading spinner
  if (!userDetails) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh"
        }}
      >
        <CircularProgress />
      </Container>
    )
  }

  // Giải cấu trúc dữ liệu nhận được: user & address
  const { user, address } = userDetails

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, boxShadow: 3 }}>
        {/* Header: Avatar và tiêu đề */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar sx={{ mr: 2 }}>{user.name.charAt(0)}</Avatar>{" "}
          {/* Hiển thị chữ cái đầu của tên */}
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Chi Tiết Người Dùng
          </Typography>
        </Box>
        {/* Grid chứa các card hiển thị thông tin chi tiết */}
        <Grid container spacing={2}>
          {/* Card: Tên người dùng */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ boxShadow: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Tên:
                </Typography>
                <Typography variant="body1">{user.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Card: Email */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ boxShadow: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Email:
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Card: Vai trò */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ boxShadow: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Vai Trò:
                </Typography>
                <Typography variant="body1">{user.role}</Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Card: Số điện thoại */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ boxShadow: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Số Điện Thoại:
                </Typography>
                <Typography variant="body1">{address.phone}</Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Card: Địa chỉ */}
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Địa Chỉ:
                </Typography>
                <Typography variant="body1">{address.address}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default UserDetails
