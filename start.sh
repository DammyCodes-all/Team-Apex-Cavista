#!/bin/bash
# Render.com startup script for Prevention AI Backend
# Ensures proper working directory and Python path

set -e

echo "Starting Prevention AI Backend on Render..."
echo "Working directory: $(pwd)"
echo "Python version: $(python --version)"

# Install dependencies
echo "Installing requirements..."
pip install -r requirements.txt

# Run migrations (if any)
# python -m alembic upgrade head

# Start Uvicorn server
echo "Starting Uvicorn server..."
exec uvicorn app.main:app \
  --host 0.0.0.0 \
  --port ${PORT:-8000} \
  --workers 1 \
  --log-level info
