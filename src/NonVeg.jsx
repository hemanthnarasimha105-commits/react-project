import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "./store";
import "./Nonveg.css";
import Pagination from "./Pagination.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NonVeg() {
  const nonVegItems = useSelector((state) => state.products?.nonveg || []);
  const dispatch = useDispatch();

  // ✅ Price filter state
  const [selectedFilters, setSelectedFilters] = useState([]);

  const priceRanges = [
    { label: "Below ₹150", min: 0, max: 150 },
    { label: "₹150 - ₹300", min: 150, max: 300 },
    { label: "₹300 - ₹500", min: 300, max: 500 },
    { label: "Above ₹500", min: 500, max: Infinity },
  ];

  const handleFilterChange = (label) => {
    setSelectedFilters((prev) =>
      prev.includes(label)
        ? prev.filter((f) => f !== label)
        : [...prev, label]
    );
  };

  // ✅ Apply price filters
  const filteredItems =
    selectedFilters.length > 0
      ? nonVegItems.filter((product) =>
          selectedFilters.some((filter) => {
            const range = priceRanges.find((r) => r.label === filter);
            return product.price >= range.min && product.price < range.max;
          })
        )
      : nonVegItems;

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // ✅ Toast function
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart 🛒`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">🍗 Non-Veg Dishes</h2>

      {/* ✅ Price Filter Checkboxes */}
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

      <div className="row">
        {currentItems.length > 0 ? (
          currentItems.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "200px", objectFit: "cover" }}
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
                    className="btn btn-danger mt-2"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No Non-Veg dishes available.</p>
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

export default NonVeg;
