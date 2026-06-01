// src/main.jsx
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import AppProvider from "@/app/Provider"
import "@/styles/index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter только здесь, один раз на всё приложение */}
    <BrowserRouter>
      <AppProvider />
    </BrowserRouter>
  </React.StrictMode>
)