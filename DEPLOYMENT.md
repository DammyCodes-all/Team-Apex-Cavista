# Prevention AI Backend - Deployment Guide

## Local Development

```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload

# Run tests
pytest -v
```

## Render.com Deployment

### Prerequisites
1. Push code to GitHub (done: `backend-branch`)
2. Create Render account and connect GitHub
3. Create new Web Service

### Configuration Steps

#### Option 1: Use Web Service Dashboard (Recommended)

1. **Connect Repository**
   - Select GitHub repository: `DammyCodes-all/Team-Apex-Cavista`
   - Branch: `backend-branch`

2. **Set Build & Deploy Settings**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Region**: Choose closest to users (e.g., us-east-1)
   - **Instance Type**: Starter (free tier) or Standard

3. **Environment Variables**
   Add in Dashboard → Environment:
   ```
   MONGODB_URI=mongodb+srv://apatirasulayman_db_user:76iJh5rRuUCicEHN@preventai.o2cdrlh.mongodb.net/
   DATABASE_NAME=apatirasulayman_db_user
   JWT_SECRET=8bf46546260fc8daa07f83c807cffdbbbf5881b2916e84f23e57270c16cceb55
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   ENV=production
   DEBUG=false
   LOG_LEVEL=info
   ENABLE_AI_INSIGHTS=true
   DEVIATION_THRESHOLD=2.0
   MAX_HISTORY_DAYS=90
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will auto-deploy on each push to `backend-branch`

#### Option 2: Using `render.yaml` (Infrastructure as Code)

1. Render reads `render.yaml` automatically
2. Push code to GitHub
3. Connect service — Render uses config from YAML

### Troubleshooting

#### Error: `ModuleNotFoundError: No module named 'app'`

**Cause**: Working directory or Python path is incorrect.

**Solution**:
- Ensure `start.sh` or `render.yaml` has correct working directory
- Verify `requirements.txt` is in repo root
- Check `app/` folder structure exists in repo

**Test locally**:
```bash
cd /path/to/prevention-ai-backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

#### Error: Database Connection Failure

**Solution**:
- Verify `MONGODB_URI` env var is set correctly
- Check MongoDB Atlas IP whitelist allows Render IPs (0.0.0.0/0 for testing)
- Test connection string locally

#### Error: Port Not Detected

**Solution**:
- Use environment variable `$PORT` in start command (done)
- Server must listen on port specified by Render (default 10000)
- Render detects health check at `/docs` endpoint

### Health Check

Render will ping `https://your-service.onrender.com/docs` to verify server is running.

FastAPI includes `/docs` (Swagger UI) by default — no extra config needed.

### Monitoring

1. **Logs**: Render Dashboard → Logs tab
2. **Metrics**: Dashboard → Metrics (CPU, memory, requests)
3. **Alerts**: Set up email notifications for deployment failures

### Deployment Commands Reference

```bash
# View logs (from Render dashboard)
tail -f logs

# Manual redeploy
# Push to backend-branch; Render auto-deploys

# Check app status
curl https://your-service.onrender.com/docs
```

### Security Best Practices

1. ✓ Use environment variables for secrets (never commit to repo)
2. ✓ Set `ENV=production` and `DEBUG=false` on Render
3. ✓ Use HTTPS (Render provides free SSL)
4. ✓ Rotate `JWT_SECRET` periodically
5. ✓ Restrict MongoDB IP whitelist to Render IPs only (not recommended: 0.0.0.0/0)

### Performance Tuning

For production (if using paid tier):
- Increase `--workers` in uvicorn command: `--workers 4`
- Use async database connection pooling
- Enable caching headers for static assets
- Consider CDN for `/docs` and `/redoc`

### Continuous Deployment

Every push to `backend-branch` triggers:
1. Render pulls latest code
2. Runs build command (pip install)
3. Restarts service with new code
4. Health check passes → deployment complete

## Database Migrations

Currently using MongoDB directly (no ORM migrations).

To add migrations in future:
1. Use Alembic + SQLAlchemy (if migrating to SQL)
2. Or use custom migration scripts in `migrations/` folder
3. Run in `render.yaml` `buildCommand` before starting app

---

For questions, check Render docs: https://render.com/docs
