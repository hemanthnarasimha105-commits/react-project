import React from "react";
import "./AboutUs.css"; 
import { NavLink } from "react-router-dom";

function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="about-hero bg-warning text-dark text-center py-5">
        <div className="container">
          <h1 className="display-3 fw-bold">🍴 About FoodieHub</h1>
          <p className="lead mt-3">
            Your one-stop hub for fresh, tasty meals, refreshing drinks & chocolates – delivered fast! 🚀
          </p>
          <NavLink to="/" className="btn btn-dark btn-lg mt-3 rounded-pill shadow">
            🏠 Back to Home
          </NavLink>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="container my-5">
        <h2 className="text-center mb-4">🌟 Our Story</h2>
        <p className="text-center fs-5">
          FoodieHub was founded with a simple mission: to bring delicious food and drinks
          to your doorstep with speed, quality, and care. We believe that everyone deserves
          fresh and tasty meals without the hassle of cooking or long waits. 
        </p>
      </section>

      {/* Our Mission Section */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4">🎯 Our Mission</h2>
          <p className="text-center fs-5">
            To make food delivery an enjoyable, hassle-free experience for everyone. We aim
            to provide the best quality products at affordable prices, ensuring freshness,
            taste, and customer satisfaction every time.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container my-5">
        <h2 className="text-center mb-4">✅ Why Choose Us?</h2>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100 py-4">
              <h3>🚚 Fast Delivery</h3>
              <p>Get your favorite meals and drinks delivered in record time.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100 py-4">
              <h3>🥗 Fresh & Tasty</h3>
              <p>We ensure every item is fresh, delicious, and of top quality.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100 py-4">
              <h3>💳 Affordable Prices</h3>
              <p>Enjoy premium food and drinks without breaking your wallet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-dark text-light py-4 mt-5 w-100">
        <div className="container-fluid text-center">
          <h5 className="mb-3">🍴 FoodieHub</h5>
          <p className="mb-1">Your one-stop hub for delicious food & drinks.</p>

          <div className="d-flex justify-content-center gap-4 mb-3">
            <a href="#" className="text-light fs-3"><i className="fab fa-facebook"></i></a>
            <a href="#" className="text-light fs-3"><i className="fab fa-instagram"></i></a>
            <a href="#" className="text-light fs-3"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-light fs-3"><i className="fab fa-linkedin"></i></a>
          </div>

          <p className="mb-0">© {new Date().getFullYear()} FoodieHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default About;
