import React, { useState } from "react"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Typography
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { toast } from "react-toastify"

const LoginPopup = ({ open, onClose, url }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${url}/api/user/login`, {
        email,
        password
      })
      if (response.data.success) {
        const role = response.data.role
        const successMessage =
          role === "admin"
            ? "Admin đăng nhập thành công!"
            : "Staff đăng nhập thành công!"
        toast.success(successMessage)
        onClose(role) // Truyền role cho hàm onClose
      } else {
        setError(response.data.message)
        toast.error("Đăng nhập thất bại: " + response.data.message)
      }
    } catch (error) {
      setError(
        "Đã xảy ra lỗi khi đăng nhập. Vui lòng kiểm tra quyền truy cập của bạn."
      )
      toast.error(
        "Đăng nhập thất bại: Đã xảy ra lỗi khi đăng nhập. Vui lòng kiểm tra quyền truy cập của bạn."
      )
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        Đăng Nhập
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Typography color="error" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Email của bạn"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Mật khẩu của bạn"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#ff5722",
            color: "#fff",
            marginTop: 2,
            borderRadius: 2
          }}
          onClick={handleLogin}
        >
          Đăng Nhập
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default LoginPopup
