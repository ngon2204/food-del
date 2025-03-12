import React, { useEffect, useState } from "react" // Import React và các hook cần thiết
import axios from "axios" // Dùng axios để call API
import { toast } from "react-toastify" // Dùng toast hiển thị thông báo cho người dùng
import "react-toastify/dist/ReactToastify.css" // CSS cho toast
import { useNavigate } from "react-router-dom" // Dùng để chuyển trang (navigate)
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem
} from "@mui/material" // Các component từ Material UI để xây dựng giao diện

// Component quản lý người dùng
const User = ({ url }) => {
  // State chứa danh sách người dùng
  const [users, setUsers] = useState([])
  // State chứa người dùng đang được chọn để chỉnh sửa
  const [selectedUser, setSelectedUser] = useState(null)
  // State lưu mật khẩu mới khi đổi mật khẩu
  const [newPassword, setNewPassword] = useState("")
  // Hook navigate để chuyển hướng trang
  const navigate = useNavigate()

  // Khi component load, fetch danh sách người dùng từ API
  useEffect(() => {
    fetch(`${url}/api/user`)
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error))
  }, [url])

  // Hàm cập nhật thông tin người dùng (name, email, role)
  const handleUpdateUser = async () => {
    try {
      // Call API PUT để cập nhật thông tin của selectedUser
      const response = await axios.put(`${url}/api/user/update`, {
        id: selectedUser._id,
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role
      })
      // Nếu cập nhật thành công, thông báo và đóng dialog chỉnh sửa
      if (response.data.success) {
        toast.success("Đã cập nhật thành công")
        setSelectedUser(null)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Lỗi khi cập nhật người dùng")
    }
  }

  // Hàm chuyển sang trang chi tiết của người dùng
  const handleViewDetails = (user) => {
    navigate(`/user/${user._id}`)
  }

  // Hàm cập nhật mật khẩu cho người dùng
  const handleUpdatePassword = async () => {
    try {
      // Call API PUT để cập nhật mật khẩu của selectedUser
      const response = await axios.put(`${url}/api/user/update-password`, {
        id: selectedUser._id,
        password: newPassword
      })
      if (response.data.success) {
        toast.success("Mật khẩu đã được cập nhật")
        setNewPassword("") // Reset mật khẩu sau cập nhật
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error updating password:", error)
      toast.error("Lỗi khi cập nhật mật khẩu")
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      {/* Tiêu đề trang */}
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "#6d6d6d", marginBottom: "16px" }}
      >
        Quản Lý Người Dùng
      </Typography>

      {/* Bảng hiển thị danh sách người dùng */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>STT</b>
              </TableCell>
              <TableCell>
                <b>Tên</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Vai Trò</b>
              </TableCell>
              <TableCell>
                <b>Hành Động</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {/* Nút Chỉnh Sửa: mở dialog chỉnh sửa */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSelectedUser(user)}
                  >
                    Chỉnh Sửa
                  </Button>
                  {/* Nút Hiển Thị Chi Tiết: chuyển sang trang chi tiết người dùng */}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleViewDetails(user)}
                    sx={{ ml: 1 }}
                  >
                    Hiển Thị Chi Tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog chỉnh sửa thông tin người dùng */}
      {selectedUser && (
        <Dialog open={true} onClose={() => setSelectedUser(null)}>
          <DialogTitle>Chỉnh Sửa Người Dùng</DialogTitle>
          <DialogContent>
            {/* Input chỉnh sửa tên */}
            <TextField
              label="Tên"
              fullWidth
              value={selectedUser.name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, name: e.target.value })
              }
              sx={{ my: 1 }}
            />
            {/* Input chỉnh sửa email */}
            <TextField
              label="Email"
              fullWidth
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
              sx={{ my: 1 }}
            />
            {/* Dropdown chọn vai trò */}
            <Select
              fullWidth
              value={selectedUser.role}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, role: e.target.value })
              }
              sx={{ my: 1 }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </Select>
            {/* Input nhập mật khẩu mới */}
            <TextField
              label="Mật Khẩu Mới"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ my: 1 }}
            />
          </DialogContent>
          <DialogActions>
            {/* Nút Hủy: đóng dialog */}
            <Button onClick={() => setSelectedUser(null)} color="secondary">
              Hủy
            </Button>
            {/* Nút Cập Nhật thông tin người dùng */}
            <Button onClick={handleUpdateUser} color="primary">
              Cập Nhật
            </Button>
            {/* Nút Đổi Mật Khẩu */}
            <Button onClick={handleUpdatePassword} color="success">
              Đổi Mật Khẩu
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  )
}

export default User
