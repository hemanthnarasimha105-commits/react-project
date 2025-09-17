import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

import Home from "./Home";
import Veg from "./Veg";
import NonVeg from "./NonVeg";
import Drinks from "./Drinks";
import Milk from "./Milk";
import Cart from "./Cart";
import Orders from "./Orders";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import Chocolate from "./Chocolate";
import Register from "./Register";
import PageNotfound from "./PageNotfound";

import "./App.css";

function App() {
  // safely get cart from redux
  const cartItems = useSelector((state) => state.cart || []);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // user login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // account button color toggle
  const [isBlue, setIsBlue] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsBlue(false); // ✅ reset back to red when logging out
  };

  // toggle color when clicking Account button
  const toggleAccountColor = () => {
    setIsBlue(!isBlue);
  };

  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand">
            <h1 className="m-0" style={{ color: "red" }}>
              🍴 FoodieHub
            </h1>
          </NavLink>

          {/* Toggle Button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarContent"
          >
            <ul className="navbar-nav gap-3 align-items-center">
              {/* 🔍 Search */}
              <li className="nav-item">
                {/* <form className="d-flex mx-auto" style={{ width: "400px" }}>
                  <input
                    className="form-control rounded-pill text-center"
                    type="search"
                    placeholder="🔍 Search for items..."
                    aria-label="Search"
                  />
                </form> */}
              </li>

              {/* Menu Links */}
              <li>
                <NavLink to="/" className="nav-link-custom">
                  🏠 Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/veg" className="nav-link-custom">
                  🥘 Veg
                </NavLink>
              </li>
              <li>
                <NavLink to="/nonVeg" className="nav-link-custom">
                  🍗 NonVeg
                </NavLink>
              </li>
              <li>
                <NavLink to="/drinks" className="nav-link-custom">
                  🥤 Drinks
                </NavLink>
              </li>
              <li>
                <NavLink to="/milk" className="nav-link-custom">
                  🥛 Milk
                </NavLink>
              </li>
              <li>
                <NavLink to="/chocolate" className="nav-link-custom">
                  🍫 Chocolate
                </NavLink>
              </li>

              {/* Cart */}
              <li>
                <NavLink to="/cart" className="nav-link-custom">
                  🛒{" "}
                  <sup>
                    <span className="badge bg-danger ms-1">({cartCount})</span>
                  </sup>{" "}
                  Cart
                </NavLink>
              </li>

              <li>
                <NavLink to="/orders" className="nav-link-custom">
                  📦 Orders
                </NavLink>
              </li>
              <li>
                <NavLink to="/AboutUs" className="nav-link-custom">
                  👤 AboutUs
                </NavLink>
              </li>
              <li>
                <NavLink to="/ContactUs" className="nav-link-custom">
                  📞 ContactUs
                </NavLink>
              </li>

              {/* 🔑 Account Dropdown */}
              <li className="nav-item dropdown">
                <span
                  className={`nav-link dropdown-toggle px-3 py-2 rounded-pill border ${
                    isBlue
                      ? "border-primary text-primary"
                      : "border-danger text-danger"
                  }`}
                  id="accountDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ cursor: "pointer" }}
                  onClick={toggleAccountColor}
                >
                  👤 Account
                </span>
                <ul className="dropdown-menu" aria-labelledby="accountDropdown">
                  {!isLoggedIn ? (
                    <li>
                      <NavLink
                        to="/register"
                        className="dropdown-item"
                        onClick={handleLogin}
                      >
                        🔑 Login
                      </NavLink>
                    </li>
                  ) : (
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        🚪 Logout
                      </button>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Routes */}
      <div className="pt-5 mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/veg" element={<Veg />} />
          <Route path="/nonVeg" element={<NonVeg />} />
          <Route path="/drinks" element={<Drinks />} />
          <Route path="/milk" element={<Milk />} />
          <Route path="/chocolate" element={<Chocolate />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/*" element={<PageNotfound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
