import React from "react"
import "./Sidebar.css"
import { NavLink } from "react-router-dom"
import DashboardIcon from "@mui/icons-material/Dashboard"
import AddIcon from "@mui/icons-material/Add"
import ListIcon from "@mui/icons-material/List"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import PeopleIcon from "@mui/icons-material/People"
import SettingsIcon from "@mui/icons-material/Settings"

const Sidebar = ({ userRole }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        {userRole !== "staff" && (
          <>
            <NavLink to="/dashboards" className="sidebar-option">
              <DashboardIcon />
              <p>Dashboard</p>
            </NavLink>
            <NavLink to="/add" className="sidebar-option">
              <AddIcon />
              <p>Thêm Món Ăn</p>
            </NavLink>
            <NavLink to="/list" className="sidebar-option">
              <ListIcon />
              <p>Danh Mục Món Ăn</p>
            </NavLink>
            <NavLink to="/users" className="sidebar-option">
              <PeopleIcon />
              <p>Quản Lý Người Dùng</p>
            </NavLink>
          </>
        )}
        <NavLink to="/orders" className="sidebar-option">
          <LocalShippingIcon />
          <p>Đặt Hàng</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
