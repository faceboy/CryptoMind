FROM node:20-alpine as base

WORKDIR /app

# Copy package manifests first for caching
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install deps during build; runtime entrypoint will verify again
RUN if [ -f package-lock.json ]; then npm ci;     elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i;     elif [ -f yarn.lock ]; then yarn install;     else npm i; fi

# Ensure vite plugin is present
RUN npm i -D @vitejs/plugin-react

# Copy app code
COPY . .

# Development stage
FROM base as development
# Run as root to avoid permission issues in development
USER root

# Create and set permissions for vite cache
RUN mkdir -p /app/node_modules/.vite && \
    chmod -R 777 /app/node_modules/.vite && \
    chmod -R 777 /app/node_modules

# Entrypoint that auto-installs if node_modules is missing due to bind mount
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
EXPOSE 5173

# Production stage
FROM base as production
RUN chown -R node:node /app
USER node
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
