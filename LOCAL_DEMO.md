# FoodBridge — Local Exam Demo Guide

This setup runs the whole presentation on localhost with **no Supabase, no internet
and no email verification**.

## Demo credentials

| Field | Value |
| --- | --- |
| Username | `user` |
| Email | `user@foodbridge.local` |
| Password | `user` |

Either `user` or `user@foodbridge.local` works as the username. The login page also
shows an **Auto-fill Demo Login** button on localhost only.

## What runs locally

- Frontend: React + Vite at `http://localhost:5173`
- Backend: Express demo API at `http://localhost:3001`
- Demo user store: MySQL table `foodbridge.demo_users` when MySQL is running,
  otherwise `backend/data/demo-users.json`
- App data for the demo (donations, requests, alerts, pickups, notifications,
  dashboard stats) is served offline by the frontend demo layer. Changes persist
  in `localStorage`.

## Exact startup commands

```bash
cd /home/wdx/Projects/foodbridge-main/frontend
npm install

cd /home/wdx/Projects/foodbridge-main/backend
npm install
```

Terminal 1 — backend:

```bash
cd /home/wdx/Projects/foodbridge-main/backend
npm run dev
```

Terminal 2 — frontend:

```bash
cd /home/wdx/Projects/foodbridge-main/frontend
npm run dev
```

Then open:

```text
http://localhost:5173/login
```

Click **Auto-fill Demo Login**, then **Authenticate & Launch**. You land on the
donor dashboard with sample data already populated.

## Optional: use MySQL for the demo user table

The backend creates and seeds the table automatically. To verify it manually:

1. Start MySQL (XAMPP/WAMP or `sudo systemctl start mysql`).
2. Make sure `backend/.env` has the right credentials (defaults are
   `root` / empty password / database `foodbridge`).
3. Start the backend. Look for:

   ```text
   ✅ Demo users table ready in MySQL (127.0.0.1:3306/foodbridge).
   ```

4. Optional manual SQL (if you prefer creating it yourself):

   ```bash
   mysql -u root -p < /home/wdx/Projects/foodbridge-main/backend/sql/demo_users.sql
   ```

5. Check the active storage provider:

   ```bash
   curl http://localhost:3001/api/auth/demo-status
   ```

   `"storage":"mysql"` means MySQL is being used. `"storage":"file"` means the
   JSON fallback is active because MySQL was not reachable.

## Environment files

Created and safe for local use (both are git-ignored):

- `frontend/.env.local` — points the API at `http://localhost:3001/api` and
  leaves Supabase empty so the demo mode is used.
- `backend/.env` — `DEMO_MODE=true`, demo credentials, local MySQL defaults.

No cloud keys are required. If you later add `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY`, real Supabase auth still works alongside the demo
login.

## Troubleshooting

- **Login button appears disabled**: open `http://localhost:5173`, not the
  network IP. Demo mode is intentionally limited to `localhost` / `127.0.0.1`.
- **MySQL warning at startup**: harmless. The backend falls back to the JSON
  store and the demo continues.
- **Port already in use**: stop the previous process with `pkill -f vite` or
  `pkill -f tsx`, then rerun.
- **Reset demo data**: in the browser console run
  `localStorage.removeItem('foodbridge-demo-session'); localStorage.removeItem('foodbridge-demo-data-v1');`
  then reload.
- **Verify builds**:

  ```bash
  cd frontend && npm run build
  cd ../backend && npm run build
  ```
