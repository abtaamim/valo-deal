import Navbar from "./siteComponents/navbar"
import Home from "./pages/home"
import About from "./pages/about"
import Pricing from "./pages/pricing"
import { Route, Routes } from "react-router-dom"
import Cart from "./pages/cart"
import SignIn from "./pages/signin"
import SecondNavbar from "./siteComponents/second_navbar"
import Sell from "./pages/sell"


function App() {
  return (
    <>
      <Navbar />
      <SecondNavbar/>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />}/>
          <Route path="/signin" element={<SignIn />}/>
          <Route path="/sell" element={<Sell />}/>
        </Routes>
      </div>
    </>
  )
}

export default App