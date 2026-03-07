import { z } from "zod";

/**
 * CraftDroid Type Definitions
 * Core models for Minecraft servers, FRP configuration, and user data
 */

// Server Types
export type ServerType = "PaperMC" | "Fabric" | "Forge" | "Bedrock" | "Vanilla" | "Custom";

export const ServerTypeEnum = z.enum(["PaperMC", "Fabric", "Forge", "Bedrock", "Vanilla", "Custom"]);

export type ServerStatus = "running" | "stopped" | "error" | "starting" | "stopping";

export const ServerStatusEnum = z.enum(["running", "stopped", "error", "starting", "stopping"]);

// Server Model
export const ServerSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string().min(1).max(255),
  type: ServerTypeEnum,
  version: z.string(),
  ramAllocation: z.number().min(512).max(8192), // MB
  status: ServerStatusEnum,
  rootDomain: z.string(),
  subdomain: z.string(),
  localPort: z.number().min(1024).max(65535),
  remotePort: z.number().min(1024).max(65535),
  publicAddress: z.string(),
  playerCount: z.number().min(0),
  maxPlayers: z.number().min(1),
  motd: z.string().optional(),
  difficulty: z.enum(["peaceful", "easy", "normal", "hard"]),
  gamemode: z.enum(["survival", "creative", "adventure", "spectator"]),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastStarted: z.date().optional(),
  lastStopped: z.date().optional(),
  cpuUsage: z.number().min(0).max(100).optional(),
  ramUsage: z.number().min(0).optional(),
  worldName: z.string().optional(),
});

export type Server = z.infer<typeof ServerSchema>;

// FRP Configuration
export const FrpConfigSchema = z.object({
  id: z.string().uuid(),
  serverId: z.string().uuid(),
  type: z.enum(["tcp", "udp"]),
  localPort: z.number(),
  remotePort: z.number(),
  protocol: z.enum(["tcp", "udp"]),
  enabled: z.boolean(),
  createdAt: z.date(),
});

export type FrpConfig = z.infer<typeof FrpConfigSchema>;

// FRP Client Configuration (generated for frpc.ini)
export const FrpClientConfigSchema = z.object({
  serverId: z.string().uuid(),
  serverName: z.string(),
  frpServerAddress: z.string(),
  frpServerPort: z.number(),
  authToken: z.string(),
  tunnels: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["tcp", "udp"]),
      localPort: z.number(),
      remotePort: z.number(),
    })
  ),
});

export type FrpClientConfig = z.infer<typeof FrpClientConfigSchema>;

// User Model
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  googleId: z.string(),
  displayName: z.string(),
  profilePicture: z.string().optional(),
  authToken: z.string(),
  refreshToken: z.string().optional(),
  tokenExpiresAt: z.date(),
  portsUsed: z.number().min(0).max(5),
  maxPorts: z.number().default(5),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Server Creation Request
export const CreateServerRequestSchema = z.object({
  name: z.string().min(1).max(255),
  type: ServerTypeEnum,
  version: z.string(),
  ramAllocation: z.number().min(512).max(8192),
  rootDomain: z.string(),
  subdomain: z.string(),
  maxPlayers: z.number().min(1).max(100),
  difficulty: z.enum(["peaceful", "easy", "normal", "hard"]),
  gamemode: z.enum(["survival", "creative", "adventure", "spectator"]),
});

export type CreateServerRequest = z.infer<typeof CreateServerRequestSchema>;

// Server Update Request
export const UpdateServerRequestSchema = z.object({
  name: z.string().optional(),
  motd: z.string().optional(),
  maxPlayers: z.number().optional(),
  difficulty: z.enum(["peaceful", "easy", "normal", "hard"]).optional(),
  gamemode: z.enum(["survival", "creative", "adventure", "spectator"]).optional(),
});

export type UpdateServerRequest = z.infer<typeof UpdateServerRequestSchema>;

// File System Operations
export const FileOperationSchema = z.object({
  serverId: z.string().uuid(),
  path: z.string(),
  operation: z.enum(["read", "write", "delete", "mkdir", "upload", "download"]),
  content: z.string().optional(),
  targetPath: z.string().optional(),
});

export type FileOperation = z.infer<typeof FileOperationSchema>;

// Console Command
export const ConsoleCommandSchema = z.object({
  serverId: z.string().uuid(),
  command: z.string().min(1),
  timestamp: z.date(),
});

export type ConsoleCommand = z.infer<typeof ConsoleCommandSchema>;

// Server Process State
export const ServerProcessStateSchema = z.object({
  serverId: z.string().uuid(),
  pid: z.number().optional(),
  isRunning: z.boolean(),
  cpuUsage: z.number(),
  ramUsage: z.number(),
  uptime: z.number(), // seconds
  lastHeartbeat: z.date(),
});

export type ServerProcessState = z.infer<typeof ServerProcessStateSchema>;

// Port Allocation
export const PortAllocationSchema = z.object({
  userId: z.string(),
  serverId: z.string().uuid(),
  basePort: z.number(),
  allocatedPorts: z.array(z.number()),
  createdAt: z.date(),
});

export type PortAllocation = z.infer<typeof PortAllocationSchema>;

// Root Domain Configuration
export const RootDomainSchema = z.object({
  id: z.string().uuid(),
  domain: z.string(),
  frpServerAddress: z.string(),
  frpServerPort: z.number(),
  enabled: z.boolean(),
  createdAt: z.date(),
});

export type RootDomain = z.infer<typeof RootDomainSchema>;
