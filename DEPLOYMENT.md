# CraftDroid Deployment Guide

## Quick Start

### Prerequisites

- Git
- Node.js 22.13.0+
- pnpm 9.12.0+
- Java 17+ (for Android builds)
- Android SDK (for local testing)
- Expo account (for EAS builds)

### Initial Setup

1. **Extract and navigate to project**
   ```bash
   unzip craftdroid-android-project.zip
   cd craftdroid
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   Create `.env` file in project root:
   ```env
   # FRP Configuration
   FRP_SERVER_ADDRESS=frp.example.com
   FRP_SERVER_PORT=7000
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   
   # Database
   DATABASE_URL=mysql://user:password@localhost:3306/craftdroid
   
   # Server
   NODE_ENV=development
   SERVER_PORT=3000
   API_URL=http://localhost:3000
   ```

4. **Setup database**
   ```bash
   pnpm run db:push
   ```

5. **Start development servers**
   ```bash
   pnpm run dev
   ```

## Building APK

### Option 1: Local Build (Recommended for Testing)

```bash
# Install EAS CLI globally
pnpm add -g eas-cli

# Build APK locally
eas build --platform android --local

# Output: app-release.apk
```

### Option 2: Cloud Build (EAS)

```bash
# Configure EAS (first time only)
eas build --platform android --configure

# Build in cloud
eas build --platform android

# Download APK from EAS dashboard
```

### Option 3: GitHub Actions (CI/CD)

The project includes automated GitHub Actions workflow that builds APK on every push:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/craftdroid.git
   git push -u origin main
   ```

2. **Enable Actions**
   - Go to GitHub repository Settings → Actions
   - Enable GitHub Actions

3. **Build automatically triggers on**
   - Push to `main` or `develop` branches
   - Pull requests
   - Manual workflow dispatch

4. **Download APK**
   - Go to Actions tab
   - Click latest workflow run
   - Download `craftdroid-apk` artifact

## Production Deployment

### Backend Server Deployment

#### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:22-alpine
   
   WORKDIR /app
   
   COPY package.json pnpm-lock.yaml ./
   RUN npm install -g pnpm && pnpm install --frozen-lockfile
   
   COPY . .
   
   RUN pnpm run build
   
   EXPOSE 3000
   
   CMD ["pnpm", "start"]
   ```

2. **Build and push image**
   ```bash
   docker build -t craftdroid-server:latest .
   docker tag craftdroid-server:latest your-registry/craftdroid-server:latest
   docker push your-registry/craftdroid-server:latest
   ```

3. **Deploy to cloud**
   ```bash
   # Using Docker Compose
   docker-compose up -d
   
   # Or Kubernetes
   kubectl apply -f deployment.yaml
   ```

#### Environment Variables (Production)

```env
NODE_ENV=production
SERVER_PORT=3000
API_URL=https://api.craftdroid.app

# Database (use managed service)
DATABASE_URL=mysql://user:password@db.example.com:3306/craftdroid

# Google OAuth
GOOGLE_CLIENT_ID=prod-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=prod-client-secret

# FRP Configuration
FRP_SERVER_ADDRESS=frp.craftdroid.app
FRP_SERVER_PORT=7000

# Security
JWT_SECRET=your-secure-random-secret
CORS_ORIGIN=https://craftdroid.app
```

### FRP Server Setup

1. **Install FRP**
   ```bash
   # Download FRP for your OS
   wget https://github.com/fatedier/frp/releases/download/v0.50.0/frp_0.50.0_linux_amd64.tar.gz
   tar xzf frp_0.50.0_linux_amd64.tar.gz
   cd frp_0.50.0_linux_amd64
   ```

2. **Configure frps.ini**
   ```ini
   [common]
   bind_addr = 0.0.0.0
   bind_port = 7000
   bind_udp_port = 7000
   
   # TLS Configuration
   tls_enable = true
   tls_cert_file = /etc/frp/certs/server.crt
   tls_key_file = /etc/frp/certs/server.key
   
   # Dashboard
   dashboard_port = 7500
   dashboard_user = admin
   dashboard_pwd = your-secure-password
   
   # Logging
   log_file = /var/log/frp/frps.log
   log_level = info
   log_max_days = 3
   
   # Performance
   max_pool_count = 5
   ```

3. **Generate TLS Certificates**
   ```bash
   # Self-signed (development)
   openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.crt -days 365 -nodes
   
   # Production: Use Let's Encrypt
   certbot certonly --standalone -d frp.craftdroid.app
   ```

4. **Setup systemd service**
   ```bash
   sudo tee /etc/systemd/system/frps.service > /dev/null <<EOF
   [Unit]
   Description=FRP Server
   After=network.target
   
   [Service]
   Type=simple
   User=frp
   WorkingDirectory=/opt/frp
   ExecStart=/opt/frp/frps -c /etc/frp/frps.ini
   Restart=always
   RestartSec=10
   
   [Install]
   WantedBy=multi-user.target
   EOF
   
   sudo systemctl daemon-reload
   sudo systemctl enable frps
   sudo systemctl start frps
   ```

5. **Setup DDoS Protection**
   ```bash
   # Install fail2ban
   sudo apt-get install fail2ban
   
   # Configure for FRP
   sudo tee /etc/fail2ban/jail.d/frps.conf > /dev/null <<EOF
   [frps]
   enabled = true
   port = 7000
   filter = frps
   logpath = /var/log/frp/frps.log
   maxretry = 5
   findtime = 600
   bantime = 3600
   EOF
   
   sudo systemctl restart fail2ban
   ```

### Android App Deployment

#### Google Play Store

1. **Create signing key**
   ```bash
   keytool -genkey -v -keystore craftdroid-release.keystore \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias craftdroid-key
   ```

2. **Configure signing in app.config.ts**
   ```typescript
   android: {
     // ... other config
     releaseChannel: "production",
     buildType: "release",
   }
   ```

3. **Build signed APK**
   ```bash
   eas build --platform android --release
   ```

4. **Upload to Google Play Console**
   - Create app in Google Play Console
   - Upload APK
   - Fill in app details, screenshots, description
   - Submit for review

#### Direct Distribution

1. **Build APK**
   ```bash
   eas build --platform android --local
   ```

2. **Host APK**
   - Upload to S3 or web server
   - Create QR code linking to APK
   - Share installation instructions

3. **Installation instructions for users**
   ```
   1. Enable "Unknown Sources" in Settings → Security
   2. Download APK from link
   3. Open APK file
   4. Tap "Install"
   5. Launch CraftDroid
   ```

## Monitoring & Maintenance

### Health Checks

```bash
# Backend API health
curl https://api.craftdroid.app/health

# Database connection
pnpm run db:check

# FRP server status
curl http://localhost:7500/api/serverinfo
```

### Logs

```bash
# Backend logs
docker logs craftdroid-server

# FRP logs
tail -f /var/log/frp/frps.log

# Mobile app logs (via Expo)
expo logs --android
```

### Database Backups

```bash
# Automated daily backup
0 2 * * * mysqldump -u user -p password craftdroid > /backups/craftdroid-$(date +\%Y\%m\%d).sql

# Restore from backup
mysql -u user -p password craftdroid < /backups/craftdroid-20260306.sql
```

### Performance Monitoring

- **Backend**: Use APM tools (DataDog, New Relic, Sentry)
- **FRP**: Monitor dashboard at http://frp-server:7500
- **Database**: Use MySQL monitoring tools
- **Mobile**: Use Expo Analytics

## Troubleshooting

### Build Issues

**Error: "Java not found"**
```bash
# Install Java 17
sudo apt-get install openjdk-17-jdk

# Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

**Error: "Gradle build failed"**
```bash
# Clear Gradle cache
rm -rf ~/.gradle/caches

# Retry build
eas build --platform android --local
```

### Deployment Issues

**Error: "Database connection refused"**
- Check DATABASE_URL is correct
- Verify database server is running
- Check firewall rules

**Error: "FRP tunnel not connecting"**
- Verify FRP_SERVER_ADDRESS and FRP_SERVER_PORT
- Check TLS certificates are valid
- Verify authentication token

### Performance Issues

**High API latency**
- Check database query performance
- Enable caching (Redis)
- Use CDN for static assets

**High memory usage**
- Increase container memory limits
- Optimize database queries
- Implement connection pooling

## Rollback Procedures

### Backend Rollback

```bash
# Using Docker
docker rollback craftdroid-server:previous

# Using Kubernetes
kubectl rollout undo deployment/craftdroid-server

# Manual rollback
git revert <commit-hash>
pnpm run build
pnpm start
```

### Database Rollback

```bash
# Restore from backup
mysql -u user -p password craftdroid < /backups/craftdroid-before-migration.sql

# Revert migrations
pnpm run db:rollback
```

## Scaling Considerations

### Horizontal Scaling

```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: craftdroid-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: craftdroid-server
  template:
    metadata:
      labels:
        app: craftdroid-server
    spec:
      containers:
      - name: server
        image: craftdroid-server:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

### Database Scaling

- Use read replicas for read-heavy workloads
- Implement caching layer (Redis)
- Partition data by user ID
- Archive old logs

### FRP Scaling

- Deploy multiple FRP servers by region
- Use load balancer for distribution
- Implement server affinity for users
- Monitor tunnel distribution

## Security Checklist

- [ ] Enable HTTPS/TLS everywhere
- [ ] Setup firewall rules
- [ ] Enable database encryption
- [ ] Rotate secrets regularly
- [ ] Enable audit logging
- [ ] Setup intrusion detection
- [ ] Regular security updates
- [ ] Penetration testing
- [ ] OWASP compliance check
- [ ] Data privacy compliance (GDPR, CCPA)

## Support & Documentation

- **Documentation**: https://docs.craftdroid.app
- **API Reference**: https://api.craftdroid.app/docs
- **Status Page**: https://status.craftdroid.app
- **Support Email**: support@craftdroid.app
- **GitHub Issues**: https://github.com/craftdroid/craftdroid/issues
