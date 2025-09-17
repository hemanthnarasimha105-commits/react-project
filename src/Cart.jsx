import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart, removeFromCart, removeItem } from "./store";
import { applyCoupon } from "./DiscountCalculation";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Cart.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [normalDiscountPercent, setNormalDiscountPercent] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastOrderId, setLastOrderId] = useState("");
  const [showEmailField, setShowEmailField] = useState(false);

  const [customerEmail, setCustomerEmail] = useState(() => {
    return localStorage.getItem("customerEmail") || "";
  });
  useEffect(() => {
    localStorage.setItem("customerEmail", customerEmail);
  }, [customerEmail]);

  const [selectedPayment, setSelectedPayment] = useState(() => {
    return localStorage.getItem("selectedPayment") || "upi";
  });
  useEffect(() => {
    localStorage.setItem("selectedPayment", selectedPayment);
  }, [selectedPayment]);

  const [showPaymentModal, setShowPaymentModal] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("showPaymentModal")) || false;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    localStorage.setItem("showPaymentModal", JSON.stringify(showPaymentModal));
  }, [showPaymentModal]);

  // Price calculations
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    0
  );
  const shipping = cartItems.length > 0 ? 10 : 0;
  const couponDiscountAmount = (totalPrice * couponDiscountPercent) / 100;
  const normalDiscountAmount = (totalPrice * normalDiscountPercent) / 100;
  const discountedSubtotal = totalPrice - couponDiscountAmount - normalDiscountAmount;
  const taxes = discountedSubtotal * 0.05;
  const finalPrice = discountedSubtotal + shipping + taxes;

  useEffect(() => {
    if (cartItems.length === 0) {
      setCouponDiscountPercent(0);
      setNormalDiscountPercent(0);
      setCouponCode("");
      setMessage("");
      setShowEmailField(false);
    }
  }, [cartItems]);

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode.trim().toUpperCase());
    if (result && result.success) {
      setCouponDiscountPercent(result.discount || 0);
      setMessage(`🎉 Coupon Applied: ${result.discount}% OFF`);
      Swal.fire("🎉 Success!", `Coupon Applied: ${result.discount}% OFF`, "success");
    } else {
      setCouponDiscountPercent(0);
      setMessage("❌ Invalid Coupon Code");
      Swal.fire("❌ Invalid!", "Please enter a valid coupon code.", "error");
    }
  };

  const handleNormalDiscount = (percent) => {
    if (percent === 0) {
      setNormalDiscountPercent(0);
      setMessage("🔄 Normal discount removed.");
      Swal.fire("🔄 Reset", "Normal discount removed.", "info");
    } else {
      setNormalDiscountPercent(percent);
      setMessage(`✅ Normal ${percent}% Discount Applied`);
      Swal.fire("✅ Discount Applied", `Normal ${percent}% OFF added!`, "success");
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleCheckout = () => {
    if (!customerEmail) {
      Swal.fire("⚠ Missing Email", "Please enter your email address.", "warning");
      return;
    }
    if (!isValidEmail(customerEmail)) {
      Swal.fire("❌ Invalid Email", "Enter a valid email address.", "error");
      return;
    }

    setLoading(true);
    const orderId = `ORD-${Date.now()}`;
    setLastOrderId(orderId);

    const templateParams = {
      logo: "https://i.ibb.co/0Kwm5JH/2422df6d-0864-4909-ab9d-466f0f4e8d31.png",
      email: customerEmail,
      order_id: orderId,
      orders: cartItems.map((item) => ({
        name: item.name,
        units: item.quantity,
        price: Number(item.price).toFixed(2),
        subtotal: (Number(item.price) * Number(item.quantity)).toFixed(2),
        image: item.image,
      })),
      subtotal: totalPrice.toFixed(2),
      coupon_discount: couponDiscountAmount.toFixed(2),
      normal_discount: normalDiscountAmount.toFixed(2),
      shipping: shipping.toFixed(2),
      taxes: taxes.toFixed(2),
      total: finalPrice.toFixed(2),
    };

    emailjs
      .send("service_m5r125g", "template_r4dfm4g", templateParams, "P8azFJcNQgrXtqomj")
      .then(() => {
        Swal.fire("📧 Receipt Sent!", `Sent to ${customerEmail}`, "success");
      })
      .catch((error) => {
        console.error("❌ Failed to send email:", error);
        Swal.fire("❌ Failed", "Could not send receipt. Try again.", "error");
      })
      .finally(() => setLoading(false));
  };

  const handleOrders = () => {
    if (cartItems.length === 0) {
      toast.info("Cart is empty", { position: "top-right", autoClose: 2000 });
      return;
    }

    Swal.fire({
      title: "Confirm Order",
      text: "Do you want to place this order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "✅ Place Order",
      cancelButtonText: "❌ Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setShowPaymentModal(true);
        localStorage.setItem("showPaymentModal", "true");
      }
    });
  };

  const handlePaymentComplete = () => {
    const orderId = `ORD-${Date.now()}`;
    const orderData = {
      orderId,
      items: cartItems,
      subtotal: totalPrice.toFixed(2),
      couponDiscount: couponDiscountAmount.toFixed(2),
      normalDiscount: normalDiscountAmount.toFixed(2),
      shipping: shipping.toFixed(2),
      taxes: taxes.toFixed(2),
      total: finalPrice.toFixed(2),
      date: new Date().toLocaleString(),
      paymentMode: selectedPayment,
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    dispatch(clearCart());
    setShowPaymentModal(false);
    localStorage.setItem("showPaymentModal", "false");

    let timerInterval;
    let timeLeft = 5;

    Swal.fire({
      title: "✅ Payment Successful!",
      html: `Your order <b>${orderId}</b> is confirmed.<br/><br/>Redirecting to Orders page in <b>${timeLeft}</b> seconds...`,
      icon: "success",
      timer: 5000,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        const content = Swal.getHtmlContainer().querySelector("b:last-child");
        timerInterval = setInterval(() => {
          timeLeft--;
          if (content) content.textContent = timeLeft;
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
        navigate("/orders");
      },
    });
  };

  const handleRemoveItem = (item) => {
    dispatch(removeItem(item));
    toast.error(`🗑 ${item.name} removed from cart`, { position: "top-right", autoClose: 2000 });
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(removeFromCart(item));
      toast.info(`Decreased ${item.name} quantity`, { position: "top-right", autoClose: 2000 });
    } else {
      toast.warning("⚠ Minimum 1 quantity required", { position: "top-right", autoClose: 2000 });
    }
  };

  const upiValue = `upi://pay?pa=9493893297@ybl&pn=${encodeURIComponent(
    "Hemanth Reddy.Satti"
  )}&am=${finalPrice.toFixed(2)}&cu=INR`;

  return (
    <div className="cart-container d-flex justify-content-center align-items-start pt-5">
      <div className="cart-card">
        <h4 className="text-center mb-3">🛒 Your Cart</h4>
        <p>
          <strong>Total Items:</strong> {cartCount}
        </p>

        {/* Discounts */}
        {cartItems.length > 0 && (
          <div className="mb-3">
            <p>
              <strong>Apply Discounts:</strong>
            </p>
            <div className="input-group mb-2">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="form-control"
              />
              <button className="btn btn-outline-primary" onClick={handleApplyCoupon}>
                Apply
              </button>
            </div>
            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleNormalDiscount(10)}>
              Normal 10% OFF
            </button>
            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleNormalDiscount(20)}>
              Normal 20% OFF
            </button>
            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleNormalDiscount(30)}>
              Normal 30% OFF
            </button>
            <button className="btn btn-sm btn-secondary ms-2" onClick={() => handleNormalDiscount(0)}>
              Reset
            </button>
            {message && <p className="mt-2">{message}</p>}
          </div>
        )}

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <p className="text-center">🛍 Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="flex-grow-1">
                  <h6>{item.name}</h6>
                  <p className="mb-1 text-muted">₹{item.price}</p>
                  <p>Qty: {item.quantity}</p>
                  <div>
                    <button className="btn btn-sm btn-success me-2" onClick={() => dispatch(addToCart(item))}>
                      ➕
                    </button>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleDecrease(item)}>
                      ➖
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleRemoveItem(item)}>
                      🗑 Remove
                    </button>
                  </div>
                </div>
                <p className="fw-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <button className="btn btn-danger mt-2 w-100" onClick={() => dispatch(clearCart())}>
              🗑 Clear Cart
            </button>
          </>
        )}

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <div className="order-summary mt-3 p-3 border rounded">
            <h6>📦 Order Summary</h6>
            <table className="table table-sm mb-0">
              <tbody>
                <tr>
                  <td>💰Subtotal</td>
                  <td className="text-end">₹{totalPrice.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>🎟Coupon Discount</td>
                  <td className="text-end text-success">-₹{couponDiscountAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>💸Normal Discount</td>
                  <td className="text-end text-success">-₹{normalDiscountAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>🚚Shipping</td>
                  <td className="text-end">₹{shipping.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>📊GST (5%)</td>
                  <td className="text-end">₹{taxes.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <hr />
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>🧾Total</strong>
                  </td>
                  <td className="text-end">
                    <strong>₹{finalPrice.toFixed(2)}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Email Confirmation */}
        {cartItems.length > 0 && (
          <div className="mt-3">
            <label>Confirmation Options:</label>
            <select
              className="form-select mb-2"
              onChange={(e) => setShowEmailField(e.target.value === "email")}
              defaultValue=""
            >
              <option value="">-- Select --</option>
              <option value="email">📧 Email Confirmation</option>
            </select>

            {showEmailField && (
              <div className="input-group mb-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="example@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleCheckout} disabled={loading || !customerEmail}>
                  {loading ? "⏳ Sending..." : "📧 Send Receipt"}
                </button>
              </div>
            )}

            {lastOrderId && showEmailField && (
              <p className="text-success mt-2">
                📑 Receipt Number: <strong>{lastOrderId}</strong>
              </p>
            )}
          </div>
        )}

        {/* Place Order */}
        {cartItems.length > 0 && (
          <button type="button" className="btn btn-success w-100 mt-3" onClick={handleOrders}>
            🛒 Order Now
          </button>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="payment-modal">
            <div className="payment-content p-4 text-center">
              <h5>💳 Pay ₹{finalPrice.toFixed(2)}</h5>
              <div className="mb-3">
                <label>Select Payment Option:</label>
                <select
                  className="form-select"
                  value={selectedPayment}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                >
                  <option value="upi">UPI (QR Code)</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>

              {selectedPayment === "upi" && (
                <div>
                  <QRCodeCanvas value={upiValue} size={180} />
                  <p className="mt-2">📱 Scan & Pay using UPI App</p>
                  <button className="btn btn-primary w-100 mt-2" onClick={handlePaymentComplete}>
                    ✅ Confirm Payment
                  </button>
                </div>
              )}

              {selectedPayment === "card" && (
                <div className="card-form text-start">
                  <div className="mb-2">
                    <label>Card Number</label>
                    <input type="text" className="form-control" placeholder="1234 5678 9012 3456" maxLength="16" />
                  </div>
                  <div className="row">
                    <div className="col-6 mb-2">
                      <label>Expiry</label>
                      <input type="text" className="form-control" placeholder="MM/YY" maxLength="5" />
                    </div>
                    <div className="col-6 mb-2">
                      <label>CVV</label>
                      <input type="password" className="form-control" placeholder="*" maxLength="3" />
                    </div>
                  </div>
                  <button className="btn btn-primary w-100 mt-2" onClick={handlePaymentComplete}>
                    ✅ Pay Now
                  </button>
                </div>
              )}

              {selectedPayment === "cod" && (
                <div>
                  <p className="mb-3">
                    💵 You have selected <strong>Cash on Delivery</strong>. Pay at the time of delivery.
                  </p>
                  <button className="btn btn-success w-100" onClick={handlePaymentComplete}>
                    ✅ Confirm COD Order
                  </button>
                </div>
              )}

              <button
                className="btn btn-outline-danger w-100 mt-3"
                onClick={() => {
                  setShowPaymentModal(false);
                  localStorage.setItem("showPaymentModal", "false");
                  Swal.fire("❌ Cancelled", "Payment process cancelled", "info");
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Cart;
