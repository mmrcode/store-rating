import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    address: "",
  });
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation Logic in Frontend
    if (formData.name.length < 20 || formData.name.length > 60)
      return setError("Name must be 20-60 chars");
    if (formData.address.length > 400) return setError("Address max 400 chars");

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(formData.password))
      return setError(
        "Password must be 8-16 chars, 1 Uppercase, 1 Special Char",
      );

    try {
      await signup(formData);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="auth-container card">
      <h2 className="text-center">Create Account</h2>
      {error && (
        <div
          style={{
            color: "var(--danger-color)",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <label>Full Name (20-60 chars)</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={20}
            maxLength={60}
          />
        </div>
        <div>
          <label>Email Address</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password (8-16, 1 Upper, 1 Special)</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            maxLength={400}
          />
        </div>
        <button type="submit" className="mt-4">
          Sign Up
        </button>
      </form>
      <p className="text-center mt-4">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
