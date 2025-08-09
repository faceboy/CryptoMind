# Docker Configuration Rules

## Dockerfiles
- For backend (Python): Use `python:3.11-slim` base; set `WORKDIR /app`; copy `requirements.txt` first, install deps with `pip`; expose port 8000 (or framework-specific); CMD to run server (e.g., `uvicorn app.main:app --host 0.0.0.0` for FastAPI or `gunicorn` for Django/Flask).
- For frontend (React): Use `node:18-alpine` base; set `WORKDIR /app`; copy `package*.json`, run `npm install`; CMD `npm start` for dev or `npm run build` for prod.
- Use multi-stage builds for production: Builder stage for deps, final stage copies artifacts and runs as non-root user.

## Docker Compose
- Define services: `backend` (build from `./backend`), `frontend` (build from `./frontend`), `db` (postgres:15 image).
- Use volumes for Postgres persistence (e.g., `./data/db:/var/lib/postgresql/data`).
- Set `depends_on` for order: Frontend depends on backend; backend on db.
- Expose ports: 3000 for frontend, 8000 for backend (internal for db).
- Networks: Rely on default Compose network; use service names (e.g., `db`) for connections.

## Optimization
- Enable live reloading in dev with volume mounts (e.g., `./backend:/app`).
- For production, add Nginx service as reverse proxy: Route `/` to frontend, `/api/` to backend.