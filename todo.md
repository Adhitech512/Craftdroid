# CraftDroid Project TODO

## Core Features

### Authentication & Security
- [ ] Google Sign-In integration with expo-web-browser
- [ ] Secure token storage using expo-secure-store
- [ ] OAuth callback handling
- [ ] Token refresh mechanism
- [ ] Logout functionality

### Dashboard (Home Screen)
- [ ] Server list display with FlatList
- [ ] Server status indicator (running/stopped/error)
- [ ] RAM usage display
- [ ] Player count display
- [ ] Connection address display
- [ ] Floating "+" button for server creation
- [ ] Pull-to-refresh for status updates
- [ ] Quick start/stop buttons on cards
- [ ] Tap to open server management

### Server Creation Flow
- [ ] Multi-step form navigation
- [ ] Step 1: Server name input
- [ ] Step 2: Server type selection (Paper, Fabric, Forge, Bedrock, Custom)
- [ ] Step 3: Minecraft version selection
- [ ] Step 4: RAM allocation slider
- [ ] Step 5: Root domain selection
- [ ] Step 6: Subdomain name input
- [ ] Summary review screen
- [ ] Server file download logic
- [ ] FRP configuration generation
- [ ] Port allocation system
- [ ] Directory structure creation

### Server Management - Files Tab
- [ ] File browser tree view
- [ ] Directory navigation
- [ ] File/folder creation
- [ ] File/folder deletion
- [ ] File upload from device
- [ ] File download to device
- [ ] Text file editor
- [ ] Server logs viewer
- [ ] Archive extraction (unzip)

### Server Management - Terminal Tab
- [ ] Live console output display
- [ ] Command input field
- [ ] Command submission
- [ ] Colored output rendering
- [ ] Auto-scroll to latest
- [ ] Copy logs functionality
- [ ] Share logs functionality

### Server Management - Config Tab
- [ ] Server name editor
- [ ] Port editor
- [ ] MOTD editor
- [ ] Max players editor
- [ ] Difficulty selector
- [ ] Gamemode selector
- [ ] Auto-save on change
- [ ] Config file persistence

### Settings Screen
- [ ] User profile display
- [ ] FRP server configuration
- [ ] Port allocation limits
- [ ] Theme toggle (dark/light)
- [ ] Logout button

### Background Services
- [ ] ServerProcessService for process management
- [ ] Start server functionality
- [ ] Stop server functionality
- [ ] Restart server functionality
- [ ] CPU usage monitoring
- [ ] RAM usage monitoring
- [ ] Auto-restart on crash
- [ ] Resource limit enforcement

### FRP Integration
- [ ] FRP client configuration generation
- [ ] TCP tunnel setup
- [ ] UDP tunnel setup
- [ ] FrpClientService background service
- [ ] Tunnel status monitoring
- [ ] Automatic tunnel restart
- [ ] Secure authentication with FRP server

### Data Models & Database
- [ ] Server model (name, type, version, ram, domain, subdomain, status, ports)
- [ ] FRP configuration model
- [ ] User model (id, email, token, port allocation)
- [ ] Local database schema (Drizzle ORM)
- [ ] Data persistence layer

### Networking & API
- [ ] Backend API integration (tRPC)
- [ ] Server creation endpoint
- [ ] Server deletion endpoint
- [ ] Server status endpoint
- [ ] FRP configuration endpoint
- [ ] Port allocation endpoint
- [ ] Domain management endpoint

### UI/UX Polish
- [ ] Dark theme with orange accents
- [ ] Responsive layout for all screen sizes
- [ ] Haptic feedback on button press
- [ ] Loading states and spinners
- [ ] Error handling and messages
- [ ] Empty state screens
- [ ] Smooth transitions between screens
- [ ] Icon design and mapping

### GitHub Actions & CI/CD
- [ ] GitHub Actions workflow for APK build
- [ ] Gradle configuration for Android build
- [ ] Signing key setup
- [ ] Build optimization flags
- [ ] APK artifact upload
- [ ] Release notes generation

### Testing
- [ ] Unit tests for data models
- [ ] Integration tests for API calls
- [ ] UI component tests
- [ ] End-to-end flow testing
- [ ] Performance testing

### Documentation
- [ ] README.md with setup instructions
- [ ] Architecture documentation
- [ ] API documentation
- [ ] Deployment guide
- [ ] Troubleshooting guide

## Bug Fixes & Improvements
(To be filled as issues are discovered)

## Completed
(Items will be marked as completed during development)
