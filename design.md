# CraftDroid: Mobile App Interface Design

## Overview

CraftDroid is a production-ready Android application that allows users to create and run Minecraft servers locally on their device, exposing them to the internet via FRP (Fast Reverse Proxy) reverse tunneling. The app follows **APPLE HUMAN INTERFACE GUIDELINES (HIG)** with a dark theme, orange primary color, and one-handed usage optimization for portrait orientation (9:16).

---

## Screen List

1. **Authentication Screen** - Google Sign-In entry point
2. **Dashboard (Home)** - Server list with status, RAM usage, player count
3. **Server Creation Flow** - Multi-step form for creating new servers
4. **Server Management** - Tabbed interface (Files, Terminal, Config)
5. **Settings** - User profile, app configuration, FRP settings

---

## Primary Content and Functionality

### Screen 1: Authentication Screen
- **Content**: Google Sign-In button, app logo, welcome message
- **Functionality**: 
  - Authenticate user via Google OAuth
  - Obtain secure token for FRP client authentication
  - Store authentication state securely

### Screen 2: Dashboard (Home)
- **Content**: 
  - List of created servers (cards)
  - Each card shows: server name, status (running/stopped), RAM usage, player count, connection address
  - Floating "+" button (bottom-left) for server creation
- **Functionality**:
  - View all servers
  - Quick start/stop server
  - Tap server to open management interface
  - Refresh server status

### Screen 3: Server Creation Flow
- **Content**:
  - Step 1: Server name input
  - Step 2: Server type selection (Paper, Fabric, Forge, Bedrock, Custom)
  - Step 3: Minecraft version selection
  - Step 4: RAM allocation slider (512MB - 4GB)
  - Step 5: Root domain selection (dropdown)
  - Step 6: Subdomain name input
  - Summary: Show final address (e.g., survival.play.kumbidi.net)
- **Functionality**:
  - Validate inputs at each step
  - Download server files based on type/version
  - Generate FRP configuration
  - Assign ports automatically
  - Create server directory structure

### Screen 4: Server Management (Tabbed)

#### Tab 1: Files
- **Content**: File browser tree view, file upload area, action buttons
- **Functionality**:
  - Browse server directories
  - Create/delete files and folders
  - Upload files from device
  - Download files to device
  - Edit text files in-app
  - View server logs
  - Unzip archives

#### Tab 2: Terminal
- **Content**: Live console output, command input field
- **Functionality**:
  - Display real-time server logs with colored output
  - Send commands to server (e.g., "stop", "op player", "whitelist add")
  - Auto-scroll to latest output
  - Copy/share logs

#### Tab 3: Config Editor
- **Content**: Editable configuration fields
- **Functionality**:
  - Edit server name
  - Edit port (mapped to FRP remote port)
  - Edit MOTD (Message of the Day)
  - Edit max players
  - Edit difficulty
  - Edit gamemode
  - Auto-save changes to configuration files

### Screen 5: Settings
- **Content**: User profile section, FRP configuration, app preferences
- **Functionality**:
  - View/edit user profile
  - Configure FRP server address and credentials
  - Set port allocation limits
  - Toggle dark/light theme
  - Logout

---

## Key User Flows

### Flow 1: Create a New Server
1. User taps "+" button on Dashboard
2. Server Creation screen opens (Step 1)
3. User enters server name → Next
4. User selects server type (Paper) → Next
5. User selects Minecraft version → Next
6. User adjusts RAM allocation (2GB) → Next
7. User selects root domain (play.kumbidi.net) → Next
8. User enters subdomain (survival) → Next
9. Review summary: "survival.play.kumbidi.net:25565"
10. User taps "Create Server"
11. App downloads server files, generates FRP config, assigns ports
12. Server appears on Dashboard (stopped state)
13. User can tap "Start" to begin server

### Flow 2: Manage Running Server
1. User taps server card on Dashboard
2. Server Management screen opens (Files tab active)
3. User can browse server files, upload plugins, edit configs
4. User switches to Terminal tab
5. User sends command "op PlayerName"
6. User switches to Config tab
7. User changes max players from 20 to 50
8. Changes auto-save
9. User taps back to return to Dashboard

### Flow 3: Stop and Restart Server
1. User taps server card on Dashboard
2. Server Management screen opens
3. User taps "Stop Server" button
4. Server shuts down gracefully
5. Status changes to "Stopped"
6. User taps "Start Server"
7. Server starts, FRP tunnel re-establishes
8. Status changes to "Running"

---

## Color Choices

| Element | Color | Usage |
|---------|-------|-------|
| **Primary** | #FF6B35 (Orange) | Buttons, highlights, accents |
| **Primary Dark** | #FF8C42 (Deep Orange) | Pressed states, darker accents |
| **Background** | #0F0F0F (Near Black) | Screen background |
| **Surface** | #1A1A1A (Dark Gray) | Cards, elevated surfaces |
| **Foreground** | #FFFFFF (White) | Primary text |
| **Muted** | #B0B0B0 (Light Gray) | Secondary text |
| **Border** | #333333 (Dark Gray) | Dividers, borders |
| **Success** | #4ADE80 (Green) | Running status, success messages |
| **Warning** | #FBBF24 (Amber) | Warnings, caution states |
| **Error** | #F87171 (Red) | Errors, stopped status |

---

## Design Principles

1. **One-Handed Usage**: All interactive elements positioned within thumb reach
2. **Dark Theme**: Reduces eye strain, aligns with gaming aesthetic
3. **Orange Accent**: Minecraft-inspired, stands out on dark background
4. **Clear Status Indicators**: Running/Stopped/Error states immediately visible
5. **Minimal Cognitive Load**: One action per screen when possible
6. **Responsive Feedback**: Haptic feedback on button press, visual state changes
7. **Accessibility**: High contrast text, large touch targets (minimum 44pt)

---

## Technical Considerations

- **Local Storage**: Server configs, FRP client config stored locally
- **Background Services**: ServerProcessService manages server lifecycle, FrpClientService manages tunnels
- **Real-time Updates**: Use polling or WebSocket for server status updates
- **File Management**: Use expo-file-system for file operations
- **Authentication**: Google Sign-In via expo-web-browser
- **Networking**: FRP client runs as background service, communicates with FRP server
