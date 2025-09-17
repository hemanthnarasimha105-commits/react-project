import React, { useRef, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { registerUser, loginUser } from "./store"; // ✅ import actions

function Register() {
  let userRef = useRef(null);
  let passwordRef = useRef(null);
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const [userError, setUserError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  // ✅ react-hook-form for Signup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const password = watch("password");

  // 🔑 Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setUserError("");
    setPasswordError("");

    const username = userRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (!username) {
      setUserError("Username is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    // ✅ Get stored signup user (localStorage)
    const storedUser = JSON.parse(localStorage.getItem("signupUser"));

    if (
      (username === "Hemanth" && password === "12345") || // default user
      (storedUser &&
        storedUser.username === username &&
        storedUser.password === password) // signed up user
    ) {
      // ✅ Save logged in user
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ username, password })
      );

      // ✅ Dispatch to Redux store
      dispatch(loginUser({ username, password }));

      Swal.fire({
        title: "✅ Login Successful!",
        text: `Welcome back, ${username}!`,
        icon: "success",
        confirmButtonColor: "#3085d6",
      }).then(() => navigate("/"));
    } else {
      Swal.fire({
        title: "❌ Invalid Credentials",
        text: "Please try again with correct username & password",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  // 📝 Handle Signup
  const onSignup = (data) => {
    // ✅ Save signup user in localStorage
    localStorage.setItem(
      "signupUser",
      JSON.stringify({
        username: data.username,
        password: data.password,
      })
    );

    // ✅ Dispatch to Redux store
    dispatch(
      registerUser({
        email: data.email,
        username: data.username,
        password: data.password,
      })
    );

    Swal.fire({
      title: "🎉 Signup Successful!",
      html: `
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Username:</b> ${data.username}</p>
      `,
      icon: "success",
      confirmButtonColor: "#28a745",
    }).then(() => {
      // ✅ Redirect back to Login tab
      document.getElementById("login-tab").click();
      reset();
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🔐 FoodieHub Access</h2>

      <div
        className="card mx-auto shadow-lg p-4"
        style={{ maxWidth: "500px", borderRadius: "15px", minHeight: "auto" }}
      >
        {/* Tabs */}
        <ul className="nav nav-tabs mb-3" id="accessTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active" // ✅ Signup tab active first
              id="signup-tab"
              data-bs-toggle="tab"
              data-bs-target="#signupTab"
              type="button"
              role="tab"
            >
              Signup
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="login-tab"
              data-bs-toggle="tab"
              data-bs-target="#loginTab"
              type="button"
              role="tab"
            >
              Login
            </button>
          </li>
        </ul>

        <div className="tab-content" id="accessTabsContent">
          {/* Signup Tab */}
          <div className="tab-pane fade show active" id="signupTab" role="tabpanel">
            <form onSubmit={handleSubmit(onSignup)}>
              <div className="mb-3">
                <label className="form-label">Email ID</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email.message}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter username"
                  {...register("username", { required: "Username is required" })}
                />
                {errors.username && (
                  <small className="text-danger">{errors.username.message}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Create Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                      message:
                        "Must include 1 uppercase, 1 number & 1 special character",
                    },
                  })}
                />
                {errors.password && (
                  <small className="text-danger">{errors.password.message}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm password"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <small className="text-danger">
                    {errors.confirmPassword.message}
                  </small>
                )}
              </div>

              <button type="submit" className="btn btn-success w-100">
                Signup
              </button>
            </form>
          </div>

          {/* Login Tab */}
          <div className="tab-pane fade" id="loginTab" role="tabpanel">
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="loginUsername" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="loginUsername"
                  ref={userRef}
                  className="form-control"
                  placeholder="Enter username"
                />
                {userError && <small className="text-danger">{userError}</small>}
              </div>
              <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="loginPassword"
                  ref={passwordRef}
                  className="form-control"
                  placeholder="Enter password"
                />
                {passwordError && (
                  <small className="text-danger">{passwordError}</small>
                )}
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
