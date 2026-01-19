# Store Rating Application

A full-stack web application that allows users to view stores, submit ratings (1-5 stars), and allows Store Owners and Admins to manage their respective areas.

## Features

-   **User Roles**:
    -   **Admin**: Manage Users, Stores, View Stats (Total Users, Stores, Ratings). Filter by Role, Search by Email.
    -   **Store Owner**: View their store's stats and user ratings.
    -   **Normal User**: Browse/Search stores, Submit/Update ratings.
-   **Authentication**: Secure Signup/Login with JWT, Password Updates.
-   **Dark Mode UI**: Premium, responsive interface.
-   **Sorting & Filtering**:
    -   Sort Users/Stores by Name, Date, Rating.
    -   Filter Users by Role.
    -   Search Stores by Name, Address, Email.

## Tech Stack

-   **Frontend**: React (Vite), React Router, Axios, CSS Modules (Premium Dark Theme).
-   **Backend**: Node.js, Express.
-   **Database**: PostgreSQL (via Supabase).

## Prerequisites

-   Node.js (v16+)
-   Supabase Account & Project

## Setup Instructions

### 1. Database Setup (Supabase)

1.  Create a Supabase project.
2.  Run the SQL scripts provided in `server/db/schema.sql` (if available) or ensure tables `users`, `stores`, `ratings` are created as per design.
3.  Enable Auth providers (Email/Password).

### 2. Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in `server/` with:
    ```env
    PORT=3000
    SUPABASE_URL=your_supabase_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4.  (Optional) Seed the database with demo data:
    ```bash
    node seed.js
    ```
5.  Start the server:
    ```bash
    npm start
    # or for dev
    npx nodemon index.js
    ```

### 3. Frontend Setup

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in `client/` with:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## Usage

-   **Admin Login**: `admin@store.com` / `Password123!` (if seeded)
-   **Store Owner**: `owner1@store.com` / `Password123!`
-   **User**: `user1@test.com` / `Password123!`

## Project Structure

-   `/client`: React Frontend
-   `/server`: Express Backend

## Credits

Created by [mmrcode](https://github.com/mmrcode) and others.
