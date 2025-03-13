import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Paper,
  Box,
  Stack,
  useMediaQuery,
  useTheme
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import { StoreContext } from "../../context/StoreContext" // Đảm bảo đường dẫn đúng với file StoreContext của bạn

const Address = () => {
  const [addresses, setAddresses] = useState([])
  const [newName, setNewName] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [editId, setEditId] = useState(null)

  const { url } = useContext(StoreContext) // Lấy URL từ context

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    axios
      .get(`${url}/api/address`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        if (res.data.success) setAddresses(res.data.addresses)
      })
      .catch((err) => console.error(err))
  }, [url])

  const addAddress = () => {
    if (!newName || !newPhone || !newAddress) return
    axios
      .post(
        `${url}/api/address`,
        { name: newName, phone: newPhone, address: newAddress },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      )
      .then((res) => {
        if (res.data.success) {
          setAddresses([...addresses, res.data.newAddress])
          setNewName("")
          setNewPhone("")
          setNewAddress("")
        }
      })
      .catch((err) => console.error(err))
  }

  const deleteAddress = (id) => {
    axios
      .delete(`${url}/api/address/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        if (res.data.success) {
          setAddresses(addresses.filter((addr) => addr._id !== id))
        }
      })
      .catch((err) => console.error(err))
  }

  const selectAddress = (addr) => {
    localStorage.setItem("selectedAddress", JSON.stringify(addr))
    alert("Đã chọn địa chỉ này để đặt hàng! 🚀")
  }

  const startEditAddress = (addr) => {
    setEditId(addr._id)
    setNewName(addr.name)
    setNewPhone(addr.phone)
    setNewAddress(addr.address)
  }

  const updateAddress = () => {
    if (!newName || !newPhone || !newAddress) return
    axios
      .put(
        `${url}/api/address/${editId}`,
        { name: newName, phone: newPhone, address: newAddress },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      )
      .then((res) => {
        if (res.data.success) {
          setAddresses(
            addresses.map((addr) =>
              addr._id === editId ? res.data.updatedAddress : addr
            )
          )
          setNewName("")
          setNewPhone("")
          setNewAddress("")
          setEditId(null)
          alert("Cập nhật thành công! 🎉")
        }
      })
      .catch((err) => console.error(err))
  }

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{ padding: isMobile ? 2 : 4, marginTop: 5, borderRadius: 3 }}
      >
        <Typography
          variant="h5"
          sx={{ textAlign: "center", fontWeight: "bold", marginBottom: 2 }}
        >
          Địa Chỉ Của Bạn
        </Typography>

        <List>
          {addresses.map((addr) => (
            <ListItem key={addr._id}>
              <ListItemText
                primary={`${addr.name} - ${addr.phone}`}
                secondary={addr.address}
              />
              <Stack direction="row" spacing={1}>
                <IconButton edge="end" onClick={() => deleteAddress(addr._id)}>
                  <DeleteIcon color="error" />
                </IconButton>
                <IconButton edge="end" onClick={() => startEditAddress(addr)}>
                  <EditIcon color="primary" />
                </IconButton>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => selectAddress(addr)}
                >
                  Chọn
                </Button>
              </Stack>
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Tên"
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Số điện thoại"
            variant="outlined"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
          <TextField
            fullWidth
            label="Địa chỉ"
            variant="outlined"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <Button
            variant="contained"
            size="large"
            color={editId ? "success" : "primary"}
            onClick={editId ? updateAddress : addAddress}
          >
            {editId ? (
              "Cập nhật địa chỉ"
            ) : (
              <>
                <AddIcon />
                Thêm Địa Chỉ
              </>
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default Address
