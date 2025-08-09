# Database PostgreSQL Rules

## Configuration
- Use official `postgres` image; set env vars: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.
- Persist data with volumes; avoid storing in container.

## Integration
- Connect from backend using service name `db` as host, port 5432.
- Use connection pooling (e.g., via SQLAlchemy) for efficiency.

## Best Practices
- Run health checks in entrypoints: Wait for DB readiness before migrations (use `pg_isready` or netcat).
- Secure with strong passwords; limit access in production (e.g., firewall rules).
- Backup strategy: Use `pg_dump` in cron jobs or tools like pgBackRest.