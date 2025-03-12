import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { StoreProvider } from "./context/StoreContext.jsx"
import { BrowserRouter as Router } from "react-router-dom"

ReactDOM.render(
  <StoreProvider>
    <Router>
      <App />
    </Router>
  </StoreProvider>,
  document.getElementById("root")
)
