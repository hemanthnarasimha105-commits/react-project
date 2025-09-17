import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "./store";
import "./Drinks.css";
import Pagination from "./Pagination.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Drinks() {
  const drinksItems = useSelector((state) => state.products?.drinks || []);
  const dispatch = useDispatch();

  // ✅ Price filter state
  const [selectedFilters, setSelectedFilters] = useState([]);

  const priceRanges = [
    { label: "Below ₹50", min: 0, max: 50 },
    { label: "₹50 - ₹100", min: 50, max: 100 },
    { label: "₹100 - ₹200", min: 100, max: 200 },
    { label: "Above ₹200", min: 200, max: Infinity },
  ];

  const handleFilterChange = (label) => {
    setSelectedFilters((prev) =>
      prev.includes(label)
        ? prev.filter((f) => f !== label) // remove if unchecked
        : [...prev, label] // add if checked
    );
  };

  // ✅ Apply filter
  const filteredItems =
    selectedFilters.length > 0
      ? drinksItems.filter((product) =>
          selectedFilters.some((filter) => {
            const range = priceRanges.find((r) => r.label === filter);
            return product.price >= range.min && product.price < range.max;
          })
        )
      : drinksItems;

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // ✅ Toast Handler
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart 🛒`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">🥤 Drinks Items</h2>

      {/* ✅ Price Filters */}
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

      {/* ✅ Drink Cards */}
      <div className="row">
        {currentItems.length > 0 ? (
          currentItems.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={product.image}
                  className="card-img-custom"
                  alt={product.name}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">
                    <small>{product.description}</small>
                  </p>
                  <h4 className="mt-auto text-success">₹{product.price}</h4>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-info mt-2"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No drinks available.</p>
        )}
      </div>

      {/* ✅ Pagination */}
      {filteredItems.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <ToastContainer />
    </div>
  );
}

export default Drinks;
