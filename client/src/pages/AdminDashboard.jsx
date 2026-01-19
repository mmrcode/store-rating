import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [userSearch, setUserSearch] = useState('');
  const [userSort, setUserSort] = useState('created_at:desc');
  const [userRoleFilter, setUserRoleFilter] = useState(''); // New Role Filter
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSort, setStoreSort] = useState('created_at:desc');

  // Forms
  const [showUserForm, setShowUserForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'normal' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab, userSort, storeSort, userRoleFilter]); // Added userRoleFilter

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await api.get('/stores/stats');
        setStats(res.data);
      } else if (activeTab === 'users') {
        // Pass role filter if selected
        const roleQuery = userRoleFilter ? `&role=${userRoleFilter}` : '';
        const res = await api.get(`/users?search=${userSearch}&sort=${userSort}${roleQuery}`);
        setUsers(res.data);
      } else if (activeTab === 'stores') {
        const res = await api.get(`/stores?search=${storeSearch}&sort=${storeSort}`);
        setStores(res.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // ...

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <h2>Admin Dashboard</h2>
        <div className="flex gap-2">
          <button className={activeTab === 'dashboard' ? '' : 'secondary'} onClick={() => setActiveTab('dashboard')}>Overview</button>
          <button className={activeTab === 'users' ? '' : 'secondary'} onClick={() => setActiveTab('users')}>Users</button>
          <button className={activeTab === 'stores' ? '' : 'secondary'} onClick={() => setActiveTab('stores')}>Stores</button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid-cards">
          <div className="card text-center">
            <h3>Total Users</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.users}</p>
          </div>
          <div className="card text-center">
            <h3>Total Stores</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{stats.stores}</p>
          </div>
          <div className="card text-center">
            <h3>Total Ratings</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--rating-color, #fbbf24)' }}>{stats.ratings}</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <div className="flex justify-between mb-4 flex-wrap gap-2">
            <div className="flex gap-2" style={{ flex: 1 }}>
              <input placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} style={{ marginTop: 0 }} />
              <div className="flex items-center gap-1">
                <span className="text-sm">Role:</span>
                <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)} style={{ width: 'auto', marginTop: 0 }}>
                  <option value="">All</option>
                  <option value="admin">Admin</option>
                  <option value="store_owner">Owner</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
              <button onClick={() => fetchData()}>Search</button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm">Sort:</span>
              <select value={userSort} onChange={e => setUserSort(e.target.value)} style={{ width: 'auto', marginTop: 0 }}>
                <option value="created_at:desc">Newest</option>
                <option value="name:asc">Name (A-Z)</option>
                <option value="name:desc">Name (Z-A)</option>
                <option value="email:asc">Email (A-Z)</option>
              </select>
              <button onClick={() => setShowUserForm(true)}>+ Add User</button>
            </div>
          </div>

          {/* ... form ... */}
          {showUserForm && (
            <div className="card" style={{ border: '1px solid var(--primary-color)', marginBottom: '1rem' }}>
              <h4>Add New User</h4>
              <form onSubmit={handleCreateUser} className="flex flex-col gap-2">
                <input placeholder="Name (20-60)" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required minLength={20} maxLength={60} />
                <input placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                <input placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                <input placeholder="Address" value={newUser.address} onChange={e => setNewUser({ ...newUser, address: e.target.value })} required />
                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                  <option value="normal">Normal User</option>
                  <option value="store_owner">Store Owner</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex gap-2 mt-4">
                  <button type="submit">Create User</button>
                  <button type="button" className="secondary" onClick={() => setShowUserForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Address</th><th>Store Rating</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-primary' : ''}`}>{u.role}</span></td>
                  <td>{u.address}</td>
                  <td>
                    {u.role === 'store_owner' ? (
                      u.storeRating ? (
                        <span className="badge badge-primary">⭐ {u.storeRating}</span>
                      ) : 'No Store'
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'stores' && (
        <div className="card">
          <div className="flex justify-between mb-4 flex-wrap gap-2">
            <div className="flex gap-2" style={{ flex: 1 }}>
              <input placeholder="Search stores..." value={storeSearch} onChange={e => setStoreSearch(e.target.value)} style={{ marginTop: 0 }} />
              <button onClick={() => fetchData()}>Search</button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm">Sort By:</span>
              <select value={storeSort} onChange={e => setStoreSort(e.target.value)} style={{ width: 'auto', marginTop: 0 }}>
                <option value="created_at:desc">Newest</option>
                <option value="name:asc">Name (A-Z)</option>
                <option value="rating:desc">Rating (High-Low)</option>
                <option value="rating:asc">Rating (Low-High)</option>
              </select>
              <button onClick={() => setShowStoreForm(true)}>+ Add Store</button>
            </div>
          </div>

          {showStoreForm && (
            <div className="card" style={{ border: '1px solid var(--primary-color)', marginBottom: '1rem' }}>
              <h4>Add New Store</h4>
              <form onSubmit={handleCreateStore} className="flex flex-col gap-2">
                <input placeholder="Store Name" value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })} required />
                <input placeholder="Email" value={newStore.email} onChange={e => setNewStore({ ...newStore, email: e.target.value })} required />
                <input placeholder="Address" value={newStore.address} onChange={e => setNewStore({ ...newStore, address: e.target.value })} required />
                <input placeholder="Owner ID (Optional UUID)" value={newStore.owner_id} onChange={e => setNewStore({ ...newStore, owner_id: e.target.value })} />
                <div className="flex gap-2 mt-4">
                  <button type="submit">Create Store</button>
                  <button type="button" className="secondary" onClick={() => setShowStoreForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Address</th><th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td>⭐ {s.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
