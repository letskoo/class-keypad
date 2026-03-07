import { BrowserRouter, Routes, Route } from "react-router-dom"

import Keypad from "./pages/Keypad"
import Dashboard from "./pages/Dashboard"

function App() {

return (

<BrowserRouter>

<Routes>

<Route path="/" element={<Keypad />} />

<Route path="/dashboard" element={<Dashboard />} />

</Routes>

</BrowserRouter>

)

}

export default App