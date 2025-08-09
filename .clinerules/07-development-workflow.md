# Development Workflow Rules

## Setup and Commands
- Install Docker and Compose; run `docker-compose up --build` to start.
- Develop with hot reload: Edit code locally, see changes in containers.

## Debugging
- Attach debuggers: Use VS Code extensions for Python/React in containers.
- Logs: Tail with `docker-compose logs -f`.

## Best Practices
- Version control Dockerfiles and Compose; test locally before push.
- Use `docker-compose exec` for commands (e.g., migrations, shells).
- Separate dev/prod Compose files for configs.