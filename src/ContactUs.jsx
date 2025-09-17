import React, { useState } from "react";
import "./ContactUs.css"; 
import { NavLink } from "react-router-dom";

function Contact() {
  //  Single statement for email
  const email = "hemanthreddysatti10@gmail.com";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="contact-hero bg-warning text-dark text-center py-5">
        <div className="container">
          <h1 className="display-3 fw-bold">📬 Contact FoodieHub</h1>
          <p className="lead mt-3">
            We’d love to hear from you! Reach out for feedback, questions, or support.
          </p>
          <NavLink to="/" className="btn btn-dark btn-lg mt-3 rounded-pill shadow">
            🏠 Back to Home
          </NavLink>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="container my-5">
        <h2 className="text-center mb-4">📍 Our Contact Info</h2>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100 py-4">
              <h3>📞 Phone</h3>
              <p>+91 9493893297</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100 py-4">
              <h3>📧 Email</h3>
              <p>
                <a href={`mailto:${email}`} className="text-dark text-decoration-none">
                  {email}
                </a>
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100 py-4">
              <h3>🏢 Address</h3>
              <p>123, Food Street, Hyderabad, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="container my-5">
        <h2 className="text-center mb-4">✉️ Send Us a Message</h2>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Your Email"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Subject"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                  placeholder="Your Message"
                ></textarea>
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-warning btn-lg rounded-pill shadow">
                  📩 Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
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

export default Contact;
