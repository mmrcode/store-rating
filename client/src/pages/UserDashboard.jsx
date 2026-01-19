import React, { useState, useEffect } from "react";
import api from "../api/axios";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name:asc"); // Default sort
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchStores();
  }, [sort]); // Fetch when sort changes

  const fetchStores = async () => {
    try {
      const res = await api.get(`/stores?search=${search}&sort=${sort}`);
      setStores(res.data);
    } catch (err) {
      console.error("Failed to fetch stores:", err);
    }
  };

  const handleRate = async (storeId, rating) => {
    try {
      await api.post("/stores/rating", { storeId, rating: parseInt(rating) });
      fetchStores(); // Refresh to see updated rating
    } catch (err) {
      alert(err.response?.data?.error || "Failed to rate");
    }
  };

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

  return (
    <div className="container">
      <h2 className="mb-4">Store Listings</h2>

      <div className="card mb-4 flex gap-2 items-center flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Store Name or Address..."
          style={{ marginTop: 0, flex: 1 }}
        />

        <div className="flex gap-2 items-center">
          <span className="text-sm">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ width: "auto", marginTop: 0 }}
          >
            <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
            <option value="rating:desc">Rating (High-Low)</option>
            <option value="rating:asc">Rating (Low-High)</option>
          </select>
        </div>

        <button onClick={fetchStores}>Search</button>
      </div>

      <div className="grid-cards">
        {stores.map((store) => (
          <div key={store.id} className="card" style={{ marginBottom: 0 }}>
            <h3>{store.name}</h3>
            <p className="text-sm">{store.address}</p>
            <div
              className="flex justify-between items-center mt-4"
              style={{
                borderTop: "1px solid var(--border-color)",
                paddingTop: "1rem",
              }}
            >
              <div>
                <span className="text-sm">Rating</span>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.25rem",
                    color: "var(--primary-color)",
                  }}
                >
                  ⭐ {store.overallRating}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <label className="text-sm">Your Rating</label>
                <select
                  className="text-sm"
                  style={{ width: "auto", marginTop: "0.25rem" }}
                  value={store.myRating || ""}
                  onChange={(e) => handleRate(store.id, e.target.value)}
                >
                  <option value="" disabled>
                    -
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>
          </div>
        ))}
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

export default UserDashboard;
