import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "./store";
import Pagination from "./Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Veg.css";

function Veg() {
  const vegItems = useSelector((state) => state.products?.veg || []);
  const dispatch = useDispatch();

  // ✅ Price filter state
  const [selectedFilters, setSelectedFilters] = useState([]);

  const priceRanges = [
    { label: "Below ₹100", min: 0, max: 100 },
    { label: "₹100 - ₹200", min: 100, max: 200 },
    { label: "₹200 - ₹300", min: 200, max: 300 },
    { label: "Above ₹300", min: 300, max: Infinity },
  ];

  const handleFilterChange = (label) => {
    setSelectedFilters((prev) =>
      prev.includes(label)
        ? prev.filter((f) => f !== label) // remove if unchecked
        : [...prev, label] // add if checked
    );
  };

  // ✅ Filter items by price
  const filteredItems =
    selectedFilters.length > 0
      ? vegItems.filter((dish) =>
          selectedFilters.some((filter) => {
            const range = priceRanges.find((r) => r.label === filter);
            return dish.price >= range.min && dish.price < range.max;
          })
        )
      : vegItems;

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ✅ Show toast on adding to cart
  const handleAddToCart = (dish) => {
    dispatch(addToCart(dish));
    toast.success(`${dish.name} added to cart! 🛒`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="container mt-4">
      {/* Heading */}
      <h2 className="mb-4 text-center">🥘 Vegetarian Dishes</h2>

      {/* ✅ Price Filter Options */}
      <div className="mb-4 text-center">
        <h5 className="mb-3">Filter by Price</h5>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {priceRanges.map((range) => (
            <div key={range.label} className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id={range.label}
                checked={selectedFilters.includes(range.label)}
                onChange={() => handleFilterChange(range.label)}
              />
              <label className="form-check-label" htmlFor={range.label}>
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Dish Cards */}
      <div className="row">
        {currentItems.length > 0 ? (
          currentItems.map((dish) => (
            <div className="col-md-4 mb-4" key={dish.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={dish.image}
                  className="card-img-top card-img-custom"
                  alt={dish.name}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{dish.name}</h5>
                  <p className="card-text text-muted">
                    <small>{dish.description}</small>
                  </p>
                  <h4 className="mt-auto">₹{dish.price}</h4>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(dish)}
                    className="btn btn-success mt-3"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No vegetarian dishes available.</p>
        )}
      </div>

      {/* Pagination */}
      {filteredItems.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}

export default Veg;
