# CraftDroid: Android Minecraft Server Host

A production-ready Android application that allows users to create and run Minecraft servers locally on their device, exposing them to the internet using FRP (Fast Reverse Proxy) reverse tunneling.

## Features

- **Multi-Server Support**: Create unlimited Minecraft servers constrained only by device resources
- **Server Types**: Support for PaperMC, Fabric, Forge, Bedrock, Vanilla, and custom server JAR files
- **FRP Integration**: Automatic reverse proxy tunneling for public internet access
- **Port Management**: Intelligent port allocation system (5 ports per user)
- **Domain Management**: Support for multiple root domains with dynamic subdomain assignment
- **File Management**: Full file browser with upload, download, edit, and archive extraction
- **Server Console**: Real-time server logs and command execution
- **Configuration Editor**: Edit server properties (MOTD, max players, difficulty, gamemode)
- **Process Monitoring**: CPU and RAM usage tracking with auto-restart on crash
- **Google Sign-In**: Secure OAuth authentication
- **Dark Theme**: Orange-accented dark theme optimized for one-handed mobile usage

## Tech Stack

- **Frontend**: React Native with Expo 54
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context + AsyncStorage
- **Database**: MySQL with Drizzle ORM
- **Backend**: Express.js with tRPC
- **Authentication**: Google OAuth via expo-auth-session
- **CI/CD**: GitHub Actions for APK building

## Project Structure

```
craftdroid/
├── app/                          # Expo Router app directory
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation layout
│   │   └── index.tsx            # Dashboard (home screen)
│   ├── server-creation.tsx      # Server creation flow
│   ├── server-management.tsx    # Server management interface
│   └── _layout.tsx              # Root layout with providers
├── components/
│   ├── screen-container.tsx     # SafeArea wrapper component
│   ├── themed-view.tsx          # Theme-aware view
│   └── ui/
│       └── icon-symbol.tsx      # Icon mapping
├── hooks/
│   ├── use-auth.ts              # Authentication hook
│   ├── use-colors.ts            # Theme colors hook
│   └── use-color-scheme.ts      # Dark/light mode detection
├── lib/
│   ├── types.ts                 # TypeScript models
│   ├── utils.ts                 # Utility functions
│   └── trpc.ts                  # tRPC client
├── server/
│   ├── _core/
│   │   └── index.ts             # Express server entry point
│   ├── db/
│   │   └── schema.ts            # Drizzle ORM schema
│   └── routes/
│       ├── auth.ts              # Authentication endpoints
│       ├── servers.ts           # Server management endpoints
│       └── frp.ts               # FRP configuration endpoints
├── .github/
│   └── workflows/
│       └── build-apk.yml        # GitHub Actions APK build
├── design.md                    # UI/UX design document
├── todo.md                      # Feature tracking
├── app.config.ts                # Expo configuration
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
└── theme.config.js              # Theme color tokens
```

## Setup Instructions

### Prerequisites

- Node.js 22.13.0 or later
- pnpm 9.12.0 or later
- Java 17 (for Android builds)
- Android SDK (for local testing)
- Expo account (for EAS builds)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/craftdroid.git
   cd craftdroid
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   FRP_SERVER_ADDRESS=frp.example.com
   FRP_SERVER_PORT=7000
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   DATABASE_URL=mysql://user:password@localhost:3306/craftdroid
   ```

4. **Setup database**
   ```bash
   pnpm run db:push
   ```

5. **Start development server**
   ```bash
   pnpm run dev
   ```

## Development

### Running on Device

**iOS:**
```bash
pnpm run ios
```

**Android:**
```bash
pnpm run android
```

**Web:**
```bash
pnpm run dev:metro
```

### Building APK

**Local build:**
```bash
eas build --platform android --local
```

**Cloud build:**
```bash
eas build --platform android
```

## Architecture

### Authentication Flow

1. User taps "Sign in with Google"
2. OAuth callback via `expo-auth-session`
3. Backend validates token and issues secure JWT
4. Token stored securely in `expo-secure-store`
5. FRP client uses token for tunnel authentication

### Server Creation Flow

1. User enters server details (name, type, version, RAM, domain, subdomain)
2. Backend allocates ports from user's quota (max 5)
3. Server files downloaded based on type/version
4. FRP configuration generated automatically
5. Server directory structure created
6. FRP client starts tunnel
7. Server appears on dashboard

### FRP Architecture

```
Android Device (frpc)
    ↓ (encrypted tunnel)
FRP Server (frps on VPS)
    ↓
Public Internet
    ↓
Minecraft Players
```

### Database Schema

**Users Table**: User profiles, authentication tokens, port allocation

**Servers Table**: Server metadata (name, type, version, status, ports, domain)

**FRP Configs Table**: TCP/UDP tunnel configurations per server

**Port Allocations Table**: Port assignment tracking per user

**Root Domains Table**: Available domains and FRP server mappings

**Server Process States Table**: Real-time CPU/RAM monitoring

**Server Logs Table**: Server console output and events

## API Endpoints

### Authentication

- `POST /api/auth/google` - Google OAuth callback
- `POST /api/auth/refresh` - Refresh authentication token
- `POST /api/auth/logout` - Logout user

### Servers

- `GET /api/servers` - List user's servers
- `POST /api/servers` - Create new server
- `GET /api/servers/:id` - Get server details
- `PUT /api/servers/:id` - Update server config
- `DELETE /api/servers/:id` - Delete server
- `POST /api/servers/:id/start` - Start server
- `POST /api/servers/:id/stop` - Stop server
- `POST /api/servers/:id/restart` - Restart server

### FRP

- `GET /api/frp/config/:serverId` - Get FRP configuration
- `POST /api/frp/tunnel/:serverId/start` - Start FRP tunnel
- `POST /api/frp/tunnel/:serverId/stop` - Stop FRP tunnel

### Files

- `GET /api/files/:serverId` - List server files
- `POST /api/files/:serverId/upload` - Upload file
- `GET /api/files/:serverId/download` - Download file
- `DELETE /api/files/:serverId` - Delete file

## Security Considerations

- All authentication uses Google OAuth 2.0
- Tokens stored securely in device keychain/keystore
- FRP tunnels use TLS encryption
- Per-user port allocation prevents abuse
- DDoS mitigation at FRP server layer (rate limiting, SYN flood protection)
- No unauthenticated tunnel access

## Performance Optimization

- JVM flags optimized for mobile: `-Xms512M -Xmx2G`
- Configurable RAM allocation per server
- CPU load monitoring and throttling
- Automatic resource limit enforcement
- Efficient file streaming for large uploads/downloads

## Future Enhancements

- Plugin marketplace with one-click installation
- Modpack installer and manager
- Automatic server backups to cloud storage
- Server templates for quick setup
- Collaborative server management (multiple admins)
- Remote web dashboard for desktop access
- Server analytics and performance metrics
- Custom world generation presets

## Troubleshooting

### Server won't start
- Check RAM allocation vs. device available memory
- Verify Java runtime is properly installed
- Check server logs for errors

### FRP tunnel not connecting
- Verify FRP server address and port are correct
- Check authentication token validity
- Ensure device has internet connectivity

### Port allocation failed
- User may have reached maximum port limit (5)
- Delete unused servers to free up ports
- Contact admin to increase port quota

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Contact: support@craftdroid.app
- Documentation: https://docs.craftdroid.app

## Acknowledgments

- Inspired by Aternos and other Minecraft hosting platforms
- Built with Expo and React Native
- FRP (Fast Reverse Proxy) for tunneling infrastructure
- Minecraft is a trademark of Mojang Studios
