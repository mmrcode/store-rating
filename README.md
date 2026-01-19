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

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14+)
- Supabase Account

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/mmrcode/store-rating.git
cd store-rating
\`\`\`

### 2. Backend Setup
Navigate to the server directory and install dependencies:
\`\`\`bash
cd server
npm install
\`\`\`

Create a \`.env\` file in the \`server\` directory:
\`\`\`env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

Start the backend server:
\`\`\`bash
npm start
# OR for development
npx nodemon index.js
\`\`\`

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
\`\`\`bash
cd ../client
npm install
\`\`\`

Create a \`.env\` file in the \`client\` directory:
\`\`\`env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`

---

## 🗄️ Database Schema

The application uses **Supabase (PostgreSQL)**. Below is a high-level overview of the tables:

- **users**: Extends Supabase Auth users with roles (`admin`, `store_owner`, `normal`) and address.
- **stores**: Contains store details (`name`, `email`, `address`, `owner_id`).
- **ratings**: Links users and stores with a rating value (1-5).

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
