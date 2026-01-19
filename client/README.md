# Store Rating Frontend (Client)

React application built with Vite, providing the user interface for the Store Rating system.

## Features

-   **Role-Based Access**: Specialized dashboards for Admin, Store Owner, and User.
-   **Interactivity**: Real-time rating updates, dynamic sorting/searching.
-   **Styling**: Custom CSS variables for a consistent "Premium Dark" theme (`index.css`).

## Key Components

-   `authContext.jsx`: Manages user session and global auth state.
-   `api/axios.js`: Configured Axios instance with Auth interceptors.
-   `pages/AdminDashboard.jsx`: Comprehensive management UI.
-   `pages/UserDashboard.jsx`: Store browsing and rating UI.
-   `pages/StoreOwnerDashboard.jsx`: Store performance view.

## Environment Variables

| Variable               | Description              |
| ---------------------- | ------------------------ |
| `VITE_SUPABASE_URL`    | Supabase Project URL     |
| `VITE_SUPABASE_ANON_KEY` | Supabase Public Key    |
