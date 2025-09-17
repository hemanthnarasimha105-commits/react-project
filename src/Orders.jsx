import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Read orders from localStorage
    const stored = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(stored);
  }, []);

  // Helper to safely parse numbers
  const n = (v) => Number(v ?? 0);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📦 Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-muted text-center">
          😕 You have not placed any orders yet.
        </p>
      ) : (
        orders
          .slice()
          .reverse() // Show latest first
          .map((order) => {
            // Support both snake_case and camelCase keys
            const normal = n(order.normal_discount ?? order.normalDiscount).toFixed(2);
            const coupon = n(order.coupon_discount ?? order.couponDiscount).toFixed(2);
            const subtotal = n(order.subtotal).toFixed(2);
            const shipping = n(order.shipping).toFixed(2);
            const taxes = n(order.taxes).toFixed(2);
            const total = n(order.total).toFixed(2);

            return (
              <div key={order.orderId} className="card mb-3 shadow-sm">
                <div className="card-header bg-success text-white">
                  <strong>Order ID:</strong> {order.orderId} <br />
                  <small>🗓️ {order.date}</small>
                </div>

                <div className="card-body">
                  <h5 className="card-title">🛍️ Items</h5>
                  <ul className="list-group mb-3">
                    {order.items?.map((item, i) => (
                      <li
                        key={i}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            width="40"
                            height="40"
                            className="me-2"
                            style={{ objectFit: "cover", borderRadius: "5px" }}
                          />
                          <div>
                            <strong>{item.name}</strong> × {item.quantity} <br />
                            <small className="text-muted">₹{n(item.price).toFixed(2)} each</small>
                          </div>
                        </div>
                        <span>₹{(n(item.price) * n(item.quantity)).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Billing Summary */}
                  <div className="text-end">
                    <h6>Subtotal: ₹{subtotal}</h6>
                    <h6 className="text-danger">Normal Discount: -₹{normal}</h6>
                    <h6 className="text-danger">Coupon Discount: -₹{coupon}</h6>
                    <h6>Shipping: ₹{shipping}</h6>
                    <h6>Taxes: ₹{taxes}</h6>
                    <h5 className="text-success">Total: ₹{total}</h5>
                  </div>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
}

export default Orders;
