import React, { useEffect, useState, useRef } from "react";
import { Carousel } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";
import axios from "axios";

function Home() {
  const reviews = [
    { id: 1, name: "Rahul Sharma", review: "Great products and fast delivery! Highly recommend FoodieHub.", rating: 5 },
    { id: 2, name: "Ananya Gupta", review: "Customer service is excellent. Loved the shopping experience.", rating: 4 },
    { id: 3, name: "Arjun Reddy", review: "Affordable prices and good quality items.", rating: 5 },
  ];

  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);
  const categoryRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [dealsActive, setDealsActive] = useState(true);

  const carouselImages = [
    { src: "/images/veg.png", text: "Fresh Vegetables & Meals" },
    { src: "/images/nonveg.png", text: "Delicious Non-Veg Dishes" },
    { src: "/images/drinks.png", text: "Refreshing Drinks" },
    { src: "/images/milk.png", text: "Pure & Fresh Milk" },
    { src: "/images/Chocolate.png", text: "Sweet Chocolate Treats" },
  ];

  const scrollToCategories = () => {
    categoryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    axios
      .get("https://dummyjson.com/recipes")
      .then((res) => {
        if (res.data && res.data.recipes) {
          setQuotes(res.data.recipes.map((r) => r.name));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (quotes.length > 0) {
      const pickRandom = () => {
        const random = quotes[Math.floor(Math.random() * quotes.length)];
        setCurrentQuote(random);
      };
      pickRandom();
      const interval = setInterval(pickRandom, 30000);
      return () => clearInterval(interval);
    }
  }, [quotes]);

  useEffect(() => {
    const dealEndTime = new Date().getTime() + 4 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = dealEndTime - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setDealsActive(false);
      } else {
        setTimeLeft({
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / (1000 * 60)) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sectionVariant = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div>
      {/* Dish Highlight */}
      {currentQuote && (
        <motion.div
          className="quote-lightbox my-4 text-center"
          variants={sectionVariant}
          initial="hidden"
          animate="visible"
        >
          <div className="p-4 rounded shadow-lg bg-light d-inline-block">
            <h2 className="fw-bold text-dark">🍲 Dish Highlight</h2>
            <p className="fs-4 text-primary fw-semibold">{currentQuote}</p>
          </div>
        </motion.div>
      )}

      {/* Carousel */}
      <motion.div
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Carousel interval={2500} indicators={false} pause="hover">
          {carouselImages.map((item, index) => (
            <Carousel.Item key={index}>
              <div className="carousel-frame">
                <img
                  className="carousel-img"
                  src={item.src}
                  alt={`Slide ${index + 1}`}
                  loading="lazy"
                />
                <div className="carousel-caption d-flex flex-column justify-content-center align-items-center">
                  <h3 className="fw-bold text-light bg-dark bg-opacity-50 p-2 rounded">
                    {item.text}
                  </h3>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="home-container my-5 h-200 position-relative rounded"
      >
        <video autoPlay loop muted playsInline className="bg-video">
          <source src="./images/food.mp4" type="video/mp4" />
        </video>
        <div className="overlay d-flex flex-column justify-content-center align-items-center text-center px-3">
          <h1 className="display-3 fw-bold text-light text-shadow">🍴 Welcome to FoodieHub</h1>
          <p className="lead text-light text-shadow mt-3">
            Fresh & tasty meals, refreshing drinks & chocolates – delivered fast 🚀
          </p>
          <button
            onClick={scrollToCategories}
            className="btn btn-warning btn-lg rounded-pill shadow mt-3"
          >
            🛒 Start Shopping
          </button>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.section
        ref={categoryRef}
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="container my-5"
      >
        <h2 className="text-center mb-5 fw-bold">🛍️ Shop by Category</h2>
        <div className="row g-4">
          {[
            { path: "/veg", img: "/images/veg.png", title: "🥘 Vegetarian" },
            { path: "/nonVeg", img: "/images/nonveg.png", title: "🍗 Non-Veg" },
            { path: "/drinks", img: "/images/drinks.png", title: "🥤 Drinks" },
            { path: "/milk", img: "/images/milk.png", title: "🥛 Milk" },
            { path: "/chocolate", img: "/images/Chocolate.png", title: "🍫 Chocolate" },
          ].map((cat, index) => (
            <motion.div
              key={index}
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.2 }}
              className={`col-md-${index < 3 ? "4" : "6"}`}
            >
              <NavLink to={cat.path} className="text-decoration-none">
                <div className="card category-card shadow-sm h-100">
                  <img src={cat.img} className="card-img-top" alt={cat.title} />
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">{cat.title}</h5>
                  </div>
                </div>
              </NavLink>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Deals Section */}
      {dealsActive && (
        <motion.section
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="container my-5"
        >
          <h2 className="text-center mb-3 fw-bold">🔥 Today’s Deals</h2>
          <div className="text-center mb-4">
            <h5 className="fw-bold text-danger">
              ⏳ Ends in: {timeLeft.hours.toString().padStart(2, "0")}:
              {timeLeft.minutes.toString().padStart(2, "0")}:
              {timeLeft.seconds.toString().padStart(2, "0")}
            </h5>
          </div>
          <div className="row g-4">
            {[
              { title: "Paneer Butter Masala", img: "/images/PaneerButterMasala.png", price: "₹60" },
              { title: "Chicken Biryani", img: "/images/ChickenBiryani.png", price: "₹75" },
              { title: "Chocolate Ice Cream", img: "/images/ChocolateIceCream.png", price: "₹40" },
              { title: "Milk Soda", img: "/images/MilkSoda.png", price: "₹16" },
              { title: "Chocolate Cake Slice", img: "/images/ChocolateCakeSlice.png", price: "₹40" },
              { title: "Rose Milk", img: "/images/RoseMilk.png", price: "₹20" },
            ].map((deal, i) => (
              <motion.div
                key={i}
                variants={sectionVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.2 }}
                className="col-md-4"
              >
                <div className="card shadow-sm h-100 deal-card">
                  <img src={deal.img} className="card-img-top" alt={deal.title} />
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">{deal.title}</h5>
                    <p className="text-success fw-bold">{deal.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Reviews */}
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="container my-5"
      >
        <h2 className="text-center mb-5 fw-bold">⭐ Customer Reviews</h2>
        <div className="row g-4">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.2 }}
              className="col-md-4"
            >
              <div className="card review-card shadow-sm h-100 p-3">
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{r.name}</h5>
                  <p className="card-text fst-italic">"{r.review}"</p>
                  <p className="text-warning fs-5">
                    {"⭐".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="bg-dark text-light py-4 mt-5 w-100"
      >
        <div className="container text-center">
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
      </motion.footer>
    </div>
  );
}

export default Home;
