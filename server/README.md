# Store Rating API (Server)

REST API built with Express and Supabase for the Store Rating application.

## Directory Structure

-   `src/controllers`: Request handlers (Auth, Store, User).
-   `src/middleware`: Authentication & Role verification.
-   `src/routes`: API Route definitions.
-   `seed.js`: Database seeding script.

## API Endpoints

### Authentication (`/api/auth`)

-   `POST /signup`: Register a new normal user.
-   `POST /login`: Login (returns JWT).

### Users (`/api/users`)

-   `GET /`: List users (Admin only). Supports `?search=`, `?sort=`, `?role=`.
-   `POST /`: Create user (Admin only).
-   `PUT /password`: Update own password (Auth required).

### Stores (`/api/stores`)

-   `GET /`: List stores. Supports `?search=`, `?sort=`.
-   `POST /`: Create store (Admin only).
-   `POST /rating`: Submit/Update rating (Normal User).
-   `GET /stats`: Global stats (Admin only).
-   `GET /dashboard`: Store Owner stats (Owner only).

## Environment Variables

| Variable            | Description                   |
| ------------------- | ----------------------------- |
| `PORT`              | Server Port (default 3000)    |
| `SUPABASE_URL`      | Supabase Project URL          |
| `SUPABASE_ANON_KEY` | Supabase Public/Anon Key      |

## Troubleshooting

### Port Already in Use (EADDRINUSE)
If you see an error like `Error: listen EADDRINUSE: address already in use :::3000`, it means another process is using port 3000.

To find and kill the process on Windows:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```
