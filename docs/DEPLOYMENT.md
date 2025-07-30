# Deployment Guide

## Replit Deployment

### 1. Database Setup (Supabase)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Create a new project
3. Navigate to Settings → Database
4. Copy the connection string under "Connection pooling"
5. Replace `[YOUR-PASSWORD]` with your database password

### 2. Environment Configuration

Set up your secrets in Replit:
- `DATABASE_URL`: Your Supabase connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `NODE_ENV`: Set to `production`

### 3. Database Migration

Run the database migrations:
```bash
cd backend
npm run db:push
```

### 4. Deployment

1. Click the **Deploy** button in Replit
2. Configure your deployment settings
3. Deploy the application

Your app will be available at `https://your-repl-name.replit.app`

## Manual Deployment

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Domain name (optional)

### Steps

1. **Clone Repository**
   ```bash
   git clone <your-repo>
   cd restaurant-pos
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Environment Variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your values
   
   # Frontend
   cp frontend/.env.local.example frontend/.env.local
   # Edit frontend/.env.local with your values
   ```

4. **Database Setup**
   ```bash
   cd backend
   npm run db:push
   ```

5. **Build Applications**
   ```bash
   npm run build
   ```

6. **Start Production Server**
   ```bash
   npm start
   ```

## Docker Deployment

### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/.next ./.next
COPY frontend/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: 
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    
  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001/api/v1
    depends_on:
      - backend
```

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=3001

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
```

## Security Checklist

- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Use environment variables for all secrets
- [ ] Enable database connection pooling
- [ ] Set up proper logging and monitoring
- [ ] Configure backup strategy for database
- [ ] Set up SSL certificates
- [ ] Enable database row-level security (RLS) in Supabase

## Monitoring

### Health Checks
- Backend: `GET /api/v1/health`
- Frontend: Load balancer health check on `/`

### Logging
- Use structured logging in production
- Monitor API response times
- Track database query performance
- Set up error alerting

## Scaling

### Horizontal Scaling
- Use load balancer for multiple backend instances
- Use CDN for static assets
- Consider Redis for session storage

### Database Scaling
- Use Supabase connection pooling
- Implement read replicas for heavy read workloads
- Consider database sharding for large datasets

## Troubleshooting

### Common Issues
1. **Database Connection**: Check DATABASE_URL format
2. **JWT Errors**: Verify JWT_SECRET is set
3. **CORS Issues**: Check CORS_ORIGIN configuration
4. **Build Failures**: Ensure all dependencies are installed
5. **Port Conflicts**: Check PORT environment variable

### Logs
- Backend logs: Check console output or log files
- Frontend logs: Check browser console and Next.js logs
- Database logs: Check Supabase dashboard logs