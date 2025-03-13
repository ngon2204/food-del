import React, { useState } from "react"
import Navbar from "./components/Navbar/Navbar"
import Sidebar from "./components/Sidebar/Sidebar"
import { Route, Routes } from "react-router-dom"
import Add from "./pages/Add/Add"
import List from "./pages/List/List"
import Orders from "./pages/Orders/Orders"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import User from "./pages/User/User"
import Dashboard from "./pages/Dashboard/Dashboard"
import LoginPopup from "./components/LoginPopup/LoginPopup.jsx"
import UserDetails from "./pages/User/UserDetails"

const App = () => {
  const url = "https://food-del-backend-10v3.onrender.com"
  const [showLogin, setShowLogin] = useState(true)
  const [userRole, setUserRole] = useState("")

  const handleClosePopup = (role) => {
    setShowLogin(false)
    setUserRole(role)
  }

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <LoginPopup open={showLogin} onClose={handleClosePopup} />
      <hr />
      <div className="app-content">
        <Sidebar userRole={userRole} />
        <Routes>
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/users" element={<User url={url} />} />
          <Route path="/dashboards" element={<Dashboard url={url} />} />
          <Route path="/user/:id" element={<UserDetails url={url} />} />
          <Route path="/" element={<User url={url} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
