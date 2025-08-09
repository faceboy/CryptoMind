#!/usr/bin/env bash
# Concatenate project source into source.txt (portable: works on macOS & Linux)
set -Eeuo pipefail

OUT="source.txt"

# ---- Header ----
{
  echo "# CryptoMind Analytics — Source Concatenation"
  echo "# Generated on: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "# Git commit: $(git rev-parse --short HEAD)"
    echo "# Git branch: $(git rev-parse --abbrev-ref HEAD)"
  fi
  echo "# This file contains project source for analysis purposes."
  echo
  echo "# Project Structure:"
  echo "# =================="
} > "$OUT"

# Common excludes (portable)
EXCL_DIR_REGEX='/(\.git|node_modules|dist|build|__pycache__|\.pytest_cache|\.clinerules|\.venv|\.pytest_cache|\.mypy_cache|\.cache)/'
EXCL_FILE_REGEX='\.(png|jpg|jpeg|gif|webp|ico|pdf|zip)$'

# What we actually care about
INCL_REGEX='\.(py|ts|tsx|js|jsx|json|yml|yaml|sql|sh|md|css|html)$|/(Dockerfile|docker-compose\.ya?ml|\.dockerignore|\.env\.example|tailwind\.config\.js|postcss\.config\.js)$'

# List structure (sorted, filtered)
find . -type f \
| grep -Ev "$EXCL_DIR_REGEX" \
| grep -Ev "$EXCL_FILE_REGEX" \
| grep -E  "$INCL_REGEX" \
| LC_ALL=C sort >> "$OUT"

{
  echo
  echo "# Source Code:"
  echo "# ============="
  echo
} >> "$OUT"

append_file() {
  local file="$1"
  {
    echo "# File: $file"
    echo "# ==========================================="
    cat "$file"
    echo
    echo
  } >> "$OUT"
}

# Concatenate in a sensible order
for DIR in backend frontend scripts .; do
  [ -d "$DIR" ] || continue
  find "$DIR" -type f \
  | grep -Ev "$EXCL_DIR_REGEX" \
  | grep -Ev "$EXCL_FILE_REGEX" \
  | grep -E  "$INCL_REGEX" \
  | LC_ALL=C sort \
  | while IFS= read -r f; do
      # avoid duplicates when DIR="."
      case "$DIR" in
        .)
          # skip if file already covered by backend/frontend/scripts
          [[ "$f" == ./backend/* || "$f" == ./frontend/* || "$f" == ./scripts/* ]] && continue
          ;;
      esac
      append_file "$f"
    done
done

echo "Source concatenation complete. Output written to $OUT"
