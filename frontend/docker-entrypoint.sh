#!/bin/sh
set -e

# Ensure proper permissions for node_modules and .vite directories
mkdir -p node_modules/.vite
chmod -R 755 node_modules 2>/dev/null || true

need_install=false
if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  need_install=true
fi

# Ensure critical dev deps exist (handles stale named volume)
if ! npm ls --silent tailwindcss >/dev/null 2>&1; then need_install=true; fi
if ! npm ls --silent postcss >/dev/null 2>&1; then need_install=true; fi
if ! npm ls --silent autoprefixer >/dev/null 2>&1; then need_install=true; fi
if ! npm ls --silent @vitejs/plugin-react >/dev/null 2>&1; then need_install=true; fi

if [ "$need_install" = "true" ]; then
  echo "[entrypoint] Installing npm dependencies (including dev deps)..."
  npm i
  npm i -D tailwindcss postcss autoprefixer @vitejs/plugin-react
  # Ensure proper permissions after install
  chmod -R 755 node_modules 2>/dev/null || true
fi

echo "[entrypoint] Starting Vite dev server..."
exec npm run dev -- --host 0.0.0.0
