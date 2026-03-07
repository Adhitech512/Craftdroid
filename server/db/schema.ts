import { mysqlTable, varchar, int, text, datetime, boolean, decimal, mysqlEnum } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * CraftDroid Database Schema
 * MySQL tables for users, servers, FRP configs, and port allocations
 */

// Users Table
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  googleId: varchar("google_id", { length: 255 }).notNull().unique(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  profilePicture: varchar("profile_picture", { length: 1024 }),
  authToken: text("auth_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: datetime("token_expires_at").notNull(),
  portsUsed: int("ports_used").default(0),
  maxPorts: int("max_ports").default(5),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()),
});

// Servers Table
export const servers = mysqlTable("servers", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["PaperMC", "Fabric", "Forge", "Bedrock", "Vanilla", "Custom"]).notNull(),
  version: varchar("version", { length: 50 }).notNull(),
  ramAllocation: int("ram_allocation").notNull(), // MB
  status: mysqlEnum("status", ["running", "stopped", "error", "starting", "stopping"]).default("stopped"),
  rootDomain: varchar("root_domain", { length: 255 }).notNull(),
  subdomain: varchar("subdomain", { length: 255 }).notNull(),
  publicAddress: varchar("public_address", { length: 255 }).notNull(),
  localPort: int("local_port").notNull(),
  remotePort: int("remote_port").notNull(),
  playerCount: int("player_count").default(0),
  maxPlayers: int("max_players").notNull(),
  motd: text("motd"),
  difficulty: mysqlEnum("difficulty", ["peaceful", "easy", "normal", "hard"]).default("normal"),
  gamemode: mysqlEnum("gamemode", ["survival", "creative", "adventure", "spectator"]).default("survival"),
  worldName: varchar("world_name", { length: 255 }),
  cpuUsage: decimal("cpu_usage", { precision: 5, scale: 2 }).default("0"),
  ramUsage: int("ram_usage").default(0),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()),
  lastStarted: datetime("last_started"),
  lastStopped: datetime("last_stopped"),
});

// FRP Configurations Table
export const frpConfigs = mysqlTable("frp_configs", {
  id: varchar("id", { length: 36 }).primaryKey(),
  serverId: varchar("server_id", { length: 36 }).notNull(),
  type: mysqlEnum("type", ["tcp", "udp"]).notNull(),
  localPort: int("local_port").notNull(),
  remotePort: int("remote_port").notNull(),
  protocol: mysqlEnum("protocol", ["tcp", "udp"]).notNull(),
  enabled: boolean("enabled").default(true),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
});

// Port Allocations Table
export const portAllocations = mysqlTable("port_allocations", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  serverId: varchar("server_id", { length: 36 }).notNull(),
  basePort: int("base_port").notNull(),
  allocatedPorts: text("allocated_ports").notNull(), // JSON array stored as string
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
});

// Root Domains Table
export const rootDomains = mysqlTable("root_domains", {
  id: varchar("id", { length: 36 }).primaryKey(),
  domain: varchar("domain", { length: 255 }).notNull().unique(),
  frpServerAddress: varchar("frp_server_address", { length: 255 }).notNull(),
  frpServerPort: int("frp_server_port").notNull(),
  enabled: boolean("enabled").default(true),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
});

// Server Process State Table (for monitoring)
export const serverProcessStates = mysqlTable("server_process_states", {
  id: varchar("id", { length: 36 }).primaryKey(),
  serverId: varchar("server_id", { length: 36 }).notNull(),
  pid: int("pid"),
  isRunning: boolean("is_running").default(false),
  cpuUsage: decimal("cpu_usage", { precision: 5, scale: 2 }).default("0"),
  ramUsage: int("ram_usage").default(0),
  uptime: int("uptime").default(0), // seconds
  lastHeartbeat: datetime("last_heartbeat").notNull().$defaultFn(() => new Date()),
});

// Server Logs Table
export const serverLogs = mysqlTable("server_logs", {
  id: varchar("id", { length: 36 }).primaryKey(),
  serverId: varchar("server_id", { length: 36 }).notNull(),
  level: mysqlEnum("level", ["INFO", "WARN", "ERROR", "DEBUG"]).default("INFO"),
  message: text("message").notNull(),
  timestamp: datetime("timestamp").notNull().$defaultFn(() => new Date()),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  servers: many(servers),
  portAllocations: many(portAllocations),
}));

export const serversRelations = relations(servers, ({ one, many }) => ({
  user: one(users, {
    fields: [servers.userId],
    references: [users.id],
  }),
  frpConfigs: many(frpConfigs),
  portAllocations: many(portAllocations),
  processStates: many(serverProcessStates),
  logs: many(serverLogs),
}));

export const frpConfigsRelations = relations(frpConfigs, ({ one }) => ({
  server: one(servers, {
    fields: [frpConfigs.serverId],
    references: [servers.id],
  }),
}));

export const portAllocationsRelations = relations(portAllocations, ({ one }) => ({
  user: one(users, {
    fields: [portAllocations.userId],
    references: [users.id],
  }),
  server: one(servers, {
    fields: [portAllocations.serverId],
    references: [servers.id],
  }),
}));

export const serverProcessStatesRelations = relations(serverProcessStates, ({ one }) => ({
  server: one(servers, {
    fields: [serverProcessStates.serverId],
    references: [servers.id],
  }),
}));

export const serverLogsRelations = relations(serverLogs, ({ one }) => ({
  server: one(servers, {
    fields: [serverLogs.serverId],
    references: [servers.id],
  }),
}));
