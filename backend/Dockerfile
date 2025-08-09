FROM python:3.11-slim as base

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

RUN apt-get update && apt-get install -y --no-install-recommends     build-essential git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies as root, then switch to appuser
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY app /app/app

# Change ownership to appuser
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

EXPOSE 8080

# Development stage
FROM base as development
CMD ["bash", "-lc", "uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload"]

# Production stage
FROM base as production
CMD ["bash", "-lc", "uvicorn app.main:app --host 0.0.0.0 --port 8080 --workers 4"]
