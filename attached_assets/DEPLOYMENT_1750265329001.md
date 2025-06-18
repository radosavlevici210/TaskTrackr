# RealArtist AI - Production Deployment Guide
Copyrt
## 🚀 Production Deployment
## Copyright (c) 2025 Ervin Remus Radosavlevici. All Rights Reserved.
### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Replit Account (Recommended)
- SSL Certificate
- CDN Configuration (Optional)

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=realartist_ai
POSTGRES_USER=realartist
POSTGRES_PASSWORD=your_secure_password

# Application
NODE_ENV=production
PORT=5000
APP_URL=https://your-domain.com
SECRET_KEY=your_super_secret_key_here

# AI Services (Add your API keys)
OPENAI_API_KEY=sk-your-openai-key
STABILITY_AI_KEY=your-stability-ai-key
ELEVENLABS_API_KEY=your-elevenlabs-key
RUNWAY_API_KEY=your-runway-ai-key

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=realartist-assets
AWS_REGION=us-east-1

# Email Service
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@your-domain.com

# Payment Processing
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Monitoring
SENTRY_DSN=your-sentry-dsn
ANALYTICS_ID=your-analytics-id
```

### Replit Deployment

1. **Create Replit Project**
   ```bash
   # Clone repository to Replit
   git clone https://github.com/radosavlevici210/realartist-ai.git
   ```

2. **Configure Secrets**
   - Add all environment variables to Replit Secrets
   - Enable PostgreSQL Replit Database
   - Configure custom domain

3. **Deploy**
   ```bash
   npm install
   npm run build
   npm start
   ```

### Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t realartist-ai .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     --name realartist-ai \
     -p 5000:5000 \
     --env-file .env \
     realartist-ai
   ```

3. **Docker Compose**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
       depends_on:
         - postgres
     
     postgres:
       image: postgres:16
       environment:
         POSTGRES_DB: realartist_ai
         POSTGRES_USER: realartist
         POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

### AWS/Cloud Deployment

1. **EC2 Instance Setup**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PostgreSQL
   sudo apt update
   sudo apt install postgresql postgresql-contrib

   # Clone and setup
   git clone https://github.com/radosavlevici210/realartist-ai.git
   cd realartist-ai
   npm install
   npm run build
   ```

2. **Process Manager**
   ```bash
   # Install PM2
   npm install -g pm2

   # Start application
   pm2 start dist/index.js --name realartist-ai
   pm2 startup
   pm2 save
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name your-domain.com;

       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Database Migration

1. **Production Database Setup**
   ```bash
   # Run migrations
   npm run db:push

   # Seed initial data
   npm run db:seed
   ```

2. **Backup Strategy**
   ```bash
   # Create backup
   pg_dump -h localhost -U realartist realartist_ai > backup.sql

   # Restore backup
   psql -h localhost -U realartist realartist_ai < backup.sql
   ```

### Security Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables secured
- [ ] Database credentials encrypted
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers implemented
- [ ] File upload validation
- [ ] SQL injection protection
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

### Performance Optimization

1. **CDN Configuration**
   - Serve static assets from CDN
   - Enable gzip compression
   - Configure caching headers

2. **Database Optimization**
   - Index frequently queried columns
   - Connection pooling enabled
   - Query optimization

3. **Monitoring**
   - Application performance monitoring
   - Error tracking with Sentry
   - Database performance monitoring
   - Server resource monitoring

### Scaling Strategy

1. **Horizontal Scaling**
   - Load balancer configuration
   - Multiple application instances
   - Session store externalization

2. **Database Scaling**
   - Read replicas
   - Connection pooling
   - Query optimization

3. **Caching Strategy**
   - Redis for session storage
   - Application-level caching
   - CDN caching

### Health Checks

1. **Application Health**
   ```bash
   curl https://your-domain.com/health
   ```

2. **Database Health**
   ```bash
   curl https://your-domain.com/health/db
   ```

3. **API Health**
   ```bash
   curl https://your-domain.com/api/health
   ```

### Backup & Recovery

1. **Automated Backups**
   - Daily database backups
   - File storage backups
   - Configuration backups

2. **Disaster Recovery**
   - Recovery time objective (RTO): 4 hours
   - Recovery point objective (RPO): 1 hour
   - Backup verification procedures

### Support & Maintenance

1. **Log Management**
   - Centralized logging
   - Log rotation
   - Error alerting

2. **Updates & Patches**
   - Security updates
   - Dependency updates
   - Feature deployments

3. **Support Channels**
   - Technical support: admin@root-cloud.com
   - Emergency contact: Available 24/7
   - Documentation: Full API and user guides

---

**Note:** This deployment guide is for production environments. Ensure all security measures are implemented before going live.

**Security Notice:** Never commit sensitive information to version control. Use environment variables and secure secret management.