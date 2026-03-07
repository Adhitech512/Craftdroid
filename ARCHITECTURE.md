# CraftDroid Architecture Documentation

## System Overview

CraftDroid is a distributed system consisting of three main components:

1. **Mobile Client** (Android/iOS via Expo)
2. **Backend Server** (Express.js + MySQL)
3. **FRP Infrastructure** (FRP Server on VPS)

## Component Architecture

### 1. Mobile Client (Expo React Native)

**Technology Stack:**
- Expo SDK 54
- React Native 0.81
- TypeScript 5.9
- NativeWind (Tailwind CSS)
- Drizzle ORM (local database)
- tRPC (API client)

**Key Modules:**

#### Authentication (`lib/auth.ts`)
- Google OAuth 2.0 via `expo-auth-session`
- Secure token storage in device keychain
- Token refresh mechanism
- Session management

#### Server Management (`lib/server-manager.ts`)
- Local server process spawning
- Java runtime detection
- Server JAR management
- Process monitoring (CPU, RAM)
- Graceful shutdown handling

#### FRP Client (`lib/frp-client.ts`)
- FRP configuration generation
- Tunnel lifecycle management
- Port mapping coordination
- Connection status monitoring

#### File System (`lib/file-manager.ts`)
- Server directory browsing
- File upload/download
- Archive extraction
- Log file streaming

#### Database (`lib/db.ts`)
- Local AsyncStorage for quick access
- SQLite for structured data (optional)
- Server metadata persistence
- Configuration caching

### 2. Backend Server (Express.js)

**Technology Stack:**
- Express.js 4.22
- TypeScript 5.9
- Drizzle ORM with MySQL
- tRPC for type-safe API
- JWT authentication

**API Routes:**

#### Authentication (`server/routes/auth.ts`)
```
POST /auth/google           - OAuth callback
POST /auth/refresh          - Refresh token
POST /auth/logout           - Logout user
GET  /auth/me              - Get current user
```

#### Servers (`server/routes/servers.ts`)
```
GET    /servers            - List user's servers
POST   /servers            - Create server
GET    /servers/:id        - Get server details
PUT    /servers/:id        - Update server config
DELETE /servers/:id        - Delete server
POST   /servers/:id/start  - Start server
POST   /servers/:id/stop   - Stop server
```

#### FRP Configuration (`server/routes/frp.ts`)
```
GET  /frp/config/:serverId      - Get FRP config
POST /frp/tunnel/:serverId      - Manage tunnel
GET  /frp/status/:serverId      - Get tunnel status
```

#### Files (`server/routes/files.ts`)
```
GET    /files/:serverId         - List files
POST   /files/:serverId/upload  - Upload file
GET    /files/:serverId/download/:path - Download
DELETE /files/:serverId/:path   - Delete file
```

**Database Schema:**

```sql
-- Users
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  googleId VARCHAR(255) UNIQUE NOT NULL,
  displayName VARCHAR(255) NOT NULL,
  authToken TEXT NOT NULL,
  tokenExpiresAt DATETIME NOT NULL,
  portsUsed INT DEFAULT 0,
  maxPorts INT DEFAULT 5,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Servers
CREATE TABLE servers (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('PaperMC', 'Fabric', 'Forge', 'Bedrock', 'Vanilla', 'Custom'),
  version VARCHAR(50) NOT NULL,
  ramAllocation INT NOT NULL,
  status ENUM('running', 'stopped', 'error'),
  rootDomain VARCHAR(255) NOT NULL,
  subdomain VARCHAR(255) NOT NULL,
  publicAddress VARCHAR(255) NOT NULL,
  localPort INT NOT NULL,
  remotePort INT NOT NULL,
  playerCount INT DEFAULT 0,
  maxPlayers INT NOT NULL,
  difficulty ENUM('peaceful', 'easy', 'normal', 'hard'),
  gamemode ENUM('survival', 'creative', 'adventure', 'spectator'),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- FRP Configurations
CREATE TABLE frpConfigs (
  id VARCHAR(36) PRIMARY KEY,
  serverId VARCHAR(36) NOT NULL,
  type ENUM('tcp', 'udp') NOT NULL,
  localPort INT NOT NULL,
  remotePort INT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (serverId) REFERENCES servers(id)
);

-- Port Allocations
CREATE TABLE portAllocations (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  serverId VARCHAR(36) NOT NULL,
  basePort INT NOT NULL,
  allocatedPorts TEXT NOT NULL, -- JSON array
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (serverId) REFERENCES servers(id)
);

-- Root Domains
CREATE TABLE rootDomains (
  id VARCHAR(36) PRIMARY KEY,
  domain VARCHAR(255) UNIQUE NOT NULL,
  frpServerAddress VARCHAR(255) NOT NULL,
  frpServerPort INT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3. FRP Infrastructure

**Architecture:**

```
┌─────────────────────┐
│   Android Device    │
│   (frpc client)     │
└──────────┬──────────┘
           │
           │ Encrypted Tunnel
           │ (TCP/UDP)
           ▼
┌─────────────────────┐
│   FRP Server (VPS)  │
│   (frps daemon)     │
└──────────┬──────────┘
           │
           │ Public Internet
           │
           ▼
┌─────────────────────┐
│  Minecraft Players  │
│  (External Clients) │
└─────────────────────┘
```

**FRP Configuration Example:**

```ini
[common]
server_addr = frp.example.com
server_port = 7000
token = user_auth_token
tls_enable = true
tls_cert_file = /etc/frp/certs/server.crt
tls_key_file = /etc/frp/certs/server.key

[survival_java]
type = tcp
local_ip = 127.0.0.1
local_port = 25565
remote_port = 30001

[survival_bedrock]
type = udp
local_ip = 127.0.0.1
local_port = 19132
remote_port = 30002

[survival_voicechat]
type = udp
local_ip = 127.0.0.1
local_port = 24454
remote_port = 30003
```

## Data Flow

### Server Creation Flow

```
1. User Input (Mobile)
   ├─ Server name, type, version
   ├─ RAM allocation
   └─ Domain selection

2. Backend Processing
   ├─ Validate inputs
   ├─ Allocate ports (max 5 per user)
   ├─ Generate FRP config
   └─ Create database records

3. Mobile Client
   ├─ Download server files
   ├─ Create directory structure
   ├─ Generate frpc.ini
   ├─ Start FRP client
   └─ Start server process

4. FRP Tunnel Establishment
   ├─ Connect to FRP server
   ├─ Authenticate with token
   ├─ Establish TCP/UDP tunnels
   └─ Public address becomes accessible

5. Server Running
   ├─ Accept player connections
   ├─ Monitor CPU/RAM
   ├─ Stream logs to mobile
   └─ Accept console commands
```

### Authentication Flow

```
1. User taps "Sign in with Google"
   │
2. expo-auth-session opens OAuth dialog
   │
3. Google returns authorization code
   │
4. Mobile client sends code to backend
   │
5. Backend validates with Google
   ├─ Exchanges code for tokens
   ├─ Creates/updates user record
   └─ Issues JWT token
   │
6. Mobile stores JWT in secure keychain
   │
7. All subsequent requests include JWT
   │
8. Backend validates JWT on each request
```

## Security Architecture

### Authentication & Authorization

- **OAuth 2.0**: Google Sign-In for user authentication
- **JWT Tokens**: Stateless authentication for API requests
- **Secure Storage**: Device keychain/keystore for token storage
- **Token Refresh**: Automatic refresh before expiration
- **Per-User Isolation**: Users can only access their own servers

### Network Security

- **TLS Encryption**: All FRP tunnels use TLS 1.3
- **Token Authentication**: FRP clients authenticate with per-user tokens
- **Port Isolation**: Each user has separate port range
- **Rate Limiting**: Backend enforces request rate limits
- **DDoS Protection**: FRP server includes:
  - Connection rate limiting
  - SYN flood protection
  - iptables filtering
  - fail2ban integration

### Data Security

- **Database Encryption**: Sensitive fields encrypted at rest
- **API Validation**: Input validation on all endpoints
- **CORS Protection**: Proper CORS headers on backend
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
- **XSS Prevention**: React Native inherently prevents XSS

## Scalability Considerations

### Horizontal Scaling

**Mobile Client:**
- Stateless design enables easy distribution
- Local data cached in AsyncStorage
- Minimal backend dependency

**Backend Server:**
- Stateless API design
- Database connection pooling
- Load balancer compatible
- Can scale horizontally with multiple instances

**FRP Infrastructure:**
- Multiple FRP servers for different regions
- Load balancing across FRP servers
- Per-server port allocation prevents conflicts

### Resource Optimization

**Mobile Device:**
- Configurable RAM limits per server
- CPU throttling to prevent overheating
- Efficient file streaming
- Background process management

**Backend Server:**
- Connection pooling
- Query optimization with indexes
- Caching layer (Redis optional)
- Async request handling

## Monitoring & Logging

### Mobile Client Monitoring

- Server process CPU/RAM tracking
- FRP tunnel status monitoring
- Network connectivity detection
- Battery usage tracking
- Storage space monitoring

### Backend Monitoring

- Request/response logging
- Database query performance
- API endpoint metrics
- Error tracking and alerting
- User activity audit logs

### FRP Server Monitoring

- Tunnel connection count
- Data transfer metrics
- Connection success/failure rates
- DDoS attack detection
- Server resource utilization

## Deployment Architecture

### Development Environment

```
Local Machine
├── Expo Metro (port 8081)
├── Express Server (port 3000)
├── MySQL (port 3306)
└── Expo Go on device
```

### Production Environment

```
Cloud Infrastructure
├── Android App (APK)
│   ├── Deployed via Google Play Store
│   └── Auto-updates via EAS
├── Backend Server (Docker)
│   ├── Load Balancer (Nginx)
│   ├── Express Instances (multiple)
│   └── MySQL Database (managed)
└── FRP Infrastructure (VPS)
    ├── FRP Server (frps)
    ├── DDoS Protection
    └── TLS Certificates
```

## Error Handling & Recovery

### Mobile Client

- Automatic retry on network failure
- Graceful degradation for offline mode
- Error boundary components
- User-friendly error messages
- Crash reporting to backend

### Backend Server

- Try-catch blocks on all routes
- Database transaction rollback on error
- Detailed error logging
- Proper HTTP status codes
- Error recovery mechanisms

### FRP Tunnel

- Automatic reconnection on disconnect
- Exponential backoff retry strategy
- Tunnel health checks
- Fallback to alternative FRP servers
- Connection timeout handling

## Future Architecture Improvements

1. **Microservices**: Split backend into services (auth, servers, frp, files)
2. **Message Queue**: Add Redis/RabbitMQ for async operations
3. **Caching Layer**: Implement Redis for frequently accessed data
4. **CDN**: Distribute server files via CDN
5. **Kubernetes**: Container orchestration for backend
6. **GraphQL**: Alternative to tRPC for complex queries
7. **WebSocket**: Real-time updates for server status
8. **Multi-Region**: Deploy FRP servers globally
