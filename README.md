# Store Rating Application 🌟

A full-stack web application that allows users to browse stores, submit ratings, and manage reviews. The platform features a role-based system with distinct functionalities for **Admins**, **Store Owners**, and **Normal Users**.

## 🚀 Tech Stack

- **Frontend**: React.js (Vite), CSS3 (Premium Dark Mode)
- **Backend**: Express.js (Node.js)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Deployment**: [GitHub Link](https://github.com/mmrcode/store-rating)

---

## ✨ Features

### 1. System Administrator 🛡️
- **Dashboard**: View total users, stores, and ratings stats.
- **User Management**: 
  - Create and manage Users (Admin, Owner, Normal).
  - Filter users by Role, Name, Email, or Address.
  - View Store Owner's average store rating in the user list.
- **Store Management**: Create new stores and assign owners.

### 2. Store Owner 🏪
- **Dashboard**: 
  - View average rating for their specific store.
  - See listing of users who submitted ratings.
  - Monitor feedback in real-time.


### 3. Normal User 👤
- **Browsing**: 
  - Search stores by Name, Address, or Email.
  - Sort stores by Name or Rating (High/Low).
- **Rating**: 
  - Submit ratings (1-5 stars) for any store.
  - Update previously submitted ratings.
  - View personal ratings alongside overall store ratings.

---

## 📂 Project Architecture

```
store-rating/
├── 📂 client/              # Frontend (React + Vite)
│   ├── 📂 src/
│   │   ├── 📂 api/         # Axios setup
│   │   ├── 📂 components/  # Reusable UI components
│   │   ├── 📂 pages/       # Route components (Dashboards, etc.)
│   │   └── main.jsx        # Entry point
│   └── .env                # Frontend environment variables
├── 📂 server/              # Backend (Express + Node.js)
│   ├── 📂 src/
│   │   ├── 📂 controllers/ # Route logic
│   │   ├── 📂 middleware/  # Auth & Validation
│   │   ├── 📂 routes/      # Express routes
│   │   └── db.js           # Supabase connection
│   ├── seed.js             # Database seeder
│   └── index.js            # Server entry point
└── README.md
```

---

## 🛠️ Setup & Installation

Follow these steps to run the project locally. You will need **two separate terminal windows**: one for the backend (Server) and one for the frontend (Client).

### Prerequisites
- Node.js (v14 or higher) installed.
- A Supabase project created.

### 1. Clone the Repository
Open a terminal and run:
```bash
git clone https://github.com/mmrcode/store-rating.git
cd store-rating
```

### 2. Backend Setup (Terminal 1)
In your first terminal window, inside the `store-rating` folder:

1. **Navigate to the server folder:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a file named `.env` in the `server` folder with the following content:
   ```env
   PORT=3000
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the Server:**
   ```bash
   npm start
   ```
   > You should see: `Server running on port 3000`

### 3. Frontend Setup (Terminal 2)
Open a **new** terminal window, navigate to the `store-rating` folder, then:

1. **Navigate to the client folder:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a file named `.env` in the `client` folder:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the Frontend:**
   ```bash
   npm run dev
   ```
   > You will see a local URL (e.g., `http://localhost:5173`). Open this link in your browser.

---

## 🔐 Role Credentials (Test Accounts)

Use the following credentials to test different user roles:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Store Owner** | `admin@store.com` | `Password123!` |
| **Store Owner** | `owner1@store.com` | `Password123!` |
| **Store Owner** | `owner2@store.com` | `Password123!` |
| **Normal User** | `user1@test.com` | `Password123!` |
| **Normal User** | `user2@test.com` | `Password123!` |

> [!NOTE]
> There is no default **Admin** account seeded. You can create one by signing up a new user and manually updating their role to `admin` in the database or via Supabase dashboard.

---

## 🗄️ Database Schema

The application uses **Supabase (PostgreSQL)**. Here is the core schema design:

```sql
-- Users Table (Extends Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'store_owner', 'normal')) DEFAULT 'normal',
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stores Table
CREATE TABLE stores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings Table
CREATE TABLE ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, store_id) -- One rating per user per store
);
```

---

## 🧪 API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new user | Public |
| `POST` | `/api/auth/login` | Login user | Public |
| `GET` | `/api/users` | List all users | Admin |
| `GET` | `/api/stores` | List stores (with filters) | Public |
| `POST` | `/api/stores` | Create new store | Admin |
| `POST` | `/api/stores/rating` | Submit/Update rating | Normal User |
| `GET` | `/api/stores/dashboard` | Store statistics | Store Owner |

---

## 🛡️ Validations & Security

### Input Validation
All API requests are strictly validated using `express-validator`:

- **Users**: 
  - Name: 20-60 characters
  - Password: 8-16 chars, must include 1 uppercase & 1 special char (`!@#$%^&*`)
  - Address: Max 400 characters
- **Stores**: Name, Email, and Address are required
- **Ratings**: Must be an integer between 1 and 5

### Security Measures
- **JWT Authentication**: Secured via Supabase Auth.
- **Role-Based Access Control (RBAC)**: Custom middleware ensures acts are performed by authorized roles only.
- **Data Protection**: Sensitive actions (like creating stores) are restricted to Admins.

---

## 🎨 UI/UX Design

The application features a **Premium Dark Mode** design with:
- Glassmorphism effects
- Responsive Grid layouts
- Interactive hover states
- Clean typography and vibrant accent colors

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request
