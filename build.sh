# Render.com build configuration for Prevention AI Backend
# This file tells Render how to build and deploy the application

# Build steps
npm_token = ""
yarn = false
python_version = "3.14"
python_modules = []

# Set environment variables for build
[env]
PYTHONUNBUFFERED = "1"

# Post-build steps
[post_build]
# Optional: add any post-build setup here
