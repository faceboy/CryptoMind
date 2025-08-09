# Backend Python Rules

## Framework and Coding
- Use FastAPI, Django, or Flask as backend; prefer FastAPI for APIs due to async support.
- Follow PEP 8: 4-space indentation, 79-char lines; use type hints.
- Integrate SQLAlchemy or Django ORM for PostgreSQL interactions.

## Database Integration
- Configure database in `settings.py` or equivalent: Use `postgresql+psycopg2://` engine with env vars for user/password/host/dbname.
- Run migrations automatically in entrypoint scripts (e.g., `python manage.py migrate` for Django).

## Best Practices
- Handle CORS: Allow origins from frontend (e.g., `http://localhost:3000` in dev).
- Use environment variables for config: Load via `os.environ` or `dotenv`.
- Implement error handling, logging, and input validation for security.