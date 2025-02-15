# Deployment Guide

This guide covers the deployment process for BetGanji, including setting up the production environment, configuring services, and maintaining the application.

## Prerequisites

- Node.js 18.x or later
- PostgreSQL 14.x or later
- Redis 6.x or later
- Domain name and SSL certificate
- AWS account (for production hosting)

## Infrastructure Setup

### AWS Resources

1. Create EC2 Instance:
```bash
# Use t3.medium or larger for production
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name betganji-prod \
  --security-group-ids sg-xxxxxxxx \
  --subnet-id subnet-xxxxxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=betganji-prod}]'
```

2. Configure RDS:
```bash
# Create PostgreSQL RDS instance
aws rds create-db-instance \
  --db-instance-identifier betganji-prod \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --allocated-storage 20 \
  --master-username betganji \
  --master-user-password <your-password>
```

3. Set up ElastiCache:
```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id betganji-cache \
  --engine redis \
  --cache-node-type cache.t3.micro \
  --num-cache-nodes 1
```

### Environment Setup

1. Create a `.env.production` file:

```env
DATABASE_URL=postgresql://user:password@host:5432/betganji
REDIS_URL=redis://host:6379
NEXT_PUBLIC_API_URL=https://api.betganji.com
JWT_SECRET=your-jwt-secret
FOOTBALL_API_KEY=your-api-key
ODDS_API_KEY=your-api-key
```

2. Configure database connection pooling:

```bash
# Install pgbouncer
sudo apt-get install pgbouncer
sudo vim /etc/pgbouncer/pgbouncer.ini

[databases]
* = host=localhost port=5432

[pgbouncer]
listen_port = 6432
listen_addr = *
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
```

## Application Deployment

### Build Process

1. Install dependencies:
```bash
npm ci --production
```

2. Build application:
```bash
npm run build
```

3. Generate Prisma client:
```bash
npx prisma generate
npx prisma migrate deploy
```

### Process Management

1. Install PM2:
```bash
npm install -g pm2
```

2. Create ecosystem config:
```bash
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'betganji',
    script: 'npm',
    args: 'start',
    instances: 'max',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
```

3. Start application:
```bash
pm2 start ecosystem.config.js --env production
```

### Monitoring & Logging

1. Configure PM2 monitoring:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

2. Set up application logging:
```bash
# Install Winston
npm install winston

# Configure in src/lib/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Security Configuration

1. SSL/TLS Setup:
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d betganji.com -d www.betganji.com
```

2. Configure security headers in Nginx:
```nginx
server {
    # ... existing configuration ...

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
}
```

## Maintenance

### Backup Procedures

1. Database backup:
```bash
# Create backup script
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/path/to/backups"
DATABASE_NAME="betganji"

# Backup database
pg_dump -Fc $DATABASE_NAME > $BACKUP_DIR/db_backup_$TIMESTAMP.dump

# Rotate old backups (keep last 7 days)
find $BACKUP_DIR -name "db_backup_*.dump" -mtime +7 -delete
```

2. Schedule backups:
```bash
# Add to crontab
0 0 * * * /path/to/backup-script.sh
```

### Monitoring & Alerts

1. Set up monitoring:
```bash
# Install node-prometheus
npm install prom-client

# Configure metrics endpoint
import { register } from 'prom-client';

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

2. Configure alerts:
```yaml
# prometheus/alerts.yml
groups:
  - name: betganji
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate detected
```

## Rollback Procedures

1. Create rollback script:
```bash
#!/bin/bash
VERSION=$1

# Stop current version
pm2 stop betganji

# Checkout specific version
git checkout $VERSION

# Install dependencies
npm ci --production

# Build
npm run build

# Start new version
pm2 start ecosystem.config.js --env production
```

2. Document rollback process:
```bash
# To rollback to a specific version:
./rollback.sh <commit-hash>

# To rollback to the previous deployment:
./rollback.sh HEAD^
```