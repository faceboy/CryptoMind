# Security and Environment Variables

## Security Guidelines
- Run containers as non-root: Add user/group in Dockerfiles (e.g., `USER appuser`).
- Use secrets for sensitive data: Avoid hardcoding; use Docker secrets in prod.
- Enable HTTPS in production via Nginx; scan for vulnerabilities (e.g., Trivy).
- Set CORS restrictively: Allow only specific origins.

## Environment Management
- Store vars in `.env` files (e.g., `.env.dev`, `.env.prod`); load in Compose with `env_file`.
- Include: DB credentials, API keys, DEBUG flags (False in prod).
- Exclude `.env` from git.

## Best Practices
- Follow OWASP: Sanitize inputs, validate JWTs for auth.
- Use least privilege: Limit container capabilities.