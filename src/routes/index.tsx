import { Routes, Route } from "react-router-dom"

import Dashboard from "../pages/Dashboard"

const Navigation = () => (
  <Routes>
    <Route path="/" Component={Dashboard} />
  </Routes>
)

export default Navigation
