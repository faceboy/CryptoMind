# Workspace Project Structure

## Core Guidelines
- Organize the project root with: `docker-compose.yml`, `backend/` (Python code), `frontend/` (React code), and optional `nginx/` for production reverse proxy.
- Place Dockerfiles in their respective directories: `backend/Dockerfile` for Python backend, `frontend/Dockerfile` for React.
- Use a `.gitignore` and `.dockerignore` to exclude virtual environments, node_modules, build artifacts, and sensitive files like `.env`.
- Maintain separation of concerns: Backend handles API logic and database interactions; frontend manages UI; database configuration in Docker Compose.

## Best Practices
- Follow a monorepo structure for simplicity in development, but consider microservices if scaling requires it.
- Include a `README.md` at root with setup instructions, including Docker commands and environment setup.