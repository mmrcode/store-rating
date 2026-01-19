import React, { useState, useEffect } from "react";
import api from "../api/axios";

const StoreOwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/stores/dashboard");
        setData(res.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Failed to load dashboard. Do you own a store?",
        );
      }
    };
    fetchData();
  }, []);

  const handlePasswordChange = async () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(password))
      return alert("Password criteria not met");
    try {
      await api.put("/users/password", { password });
      alert("Password Updated");
      setPassword("");
    } catch (err) {
      alert("Failed to update password");
    }
  };

  if (error) return <div style={{ padding: "2rem" }}>Error: {error}</div>;
  if (!data) return <div style={{ padding: "2rem" }}>Loading...</div>;

  return (
    <div className="container">
      <h2 className="mb-4">Store Dashboard: {data.storeName}</h2>

      <div className="card text-center mb-4">
        <h3>Average Rating</h3>
        <p
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            color: "var(--primary-color)",
          }}
        >
          {data.averageRating}{" "}
          <span style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>
            / 5
          </span>
        </p>
      </div>

      <div className="card">
        <h3>Recent Ratings</h3>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.ratings.map((r, i) => (
              <tr key={i}>
                <td>{r.user}</td>
                <td>{r.email}</td>
                <td>
                  <span className="badge badge-primary">⭐ {r.rating}</span>
                </td>
                <td>{new Date(r.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card mt-4">
        <h3>Change Password</h3>
        <div className="flex gap-2 items-end">
          <div style={{ flex: 1 }}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handlePasswordChange}>Update Password</button>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
