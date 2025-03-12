import React, { useState, useEffect } from "react"
import "./Navbar.css"
import { assets } from "../../assets/assets"
import LoginPopup from "../LoginPopup/LoginPopup"

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false)

  const handleProfileClick = () => {
    setShowLogin(true)
  }

  const handleClosePopup = () => {
    setShowLogin(false)
  }

  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="" />
      <img
        className="profile"
        src={assets.profile_image}
        alt=""
        onClick={handleProfileClick}
      />
      <LoginPopup open={showLogin} onClose={handleClosePopup} />
    </div>
  )
}

export default Navbar
