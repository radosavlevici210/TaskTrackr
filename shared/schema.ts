import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  accountType: varchar("account_type").default("free").notNull(), // free, professional, enterprise
  creditsRemaining: integer("credits_remaining").default(100).notNull(),
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table for music creation projects
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  lyrics: text("lyrics").notNull(),
  genre: varchar("genre").notNull(),
  mood: varchar("mood"),
  tempo: varchar("tempo"),
  aiArtistId: integer("ai_artist_id").references(() => aiArtists.id),
  status: varchar("status").default("draft").notNull(), // draft, generating, completed, published, failed
  generationProgress: integer("generation_progress").default(0), // 0-100
  currentStep: varchar("current_step"), // script, voice, instrumental, mixing, video, export
  estimatedDuration: integer("estimated_duration"), // in seconds
  audioUrl: varchar("audio_url"),
  videoUrl: varchar("video_url"),
  coverImageUrl: varchar("cover_image_url"),
  metadata: jsonb("metadata"), // Additional project data
  isPublic: boolean("is_public").default(false),
  streamCount: integer("stream_count").default(0),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Artists table for voice synthesis
export const aiArtists = pgTable("ai_artists", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  voiceType: varchar("voice_type").notNull(), // male, female, non-binary
  genre: varchar("genre").notNull(), // pop, hip-hop, rock, r&b, electronic
  language: varchar("language").default("english"),
  isAvailable: boolean("is_available").default(true),
  popularity: integer("popularity").default(0),
  sampleUrl: varchar("sample_url"),
  thumbnailUrl: varchar("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User statistics table
export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  totalSongs: integer("total_songs").default(0),
  totalStreams: integer("total_streams").default(0),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  countriesReached: integer("countries_reached").default(0),
  monthlyStreams: integer("monthly_streams").default(0),
  monthlyEarnings: decimal("monthly_earnings", { precision: 10, scale: 2 }).default("0.00"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Collaborators table for royalty sharing
export const collaborators = pgTable("collaborators", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull().references(() => projects.id),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  role: varchar("role").notNull(), // songwriter, producer, vocalist, etc.
  royaltyPercentage: decimal("royalty_percentage", { precision: 5, scale: 2 }).notNull(),
  isConfirmed: boolean("is_confirmed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Security logs table
export const securityLogs = pgTable("security_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  projectId: uuid("project_id").references(() => projects.id),
  eventType: varchar("event_type").notNull(), // access, download, theft_detected, ip_change
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  deviceInfo: jsonb("device_info"),
  location: varchar("location"),
  isBlocked: boolean("is_blocked").default(false),
  riskLevel: varchar("risk_level").default("low"), // low, medium, high, critical
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  projects: many(projects),
  stats: one(userStats),
  securityLogs: many(securityLogs),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  aiArtist: one(aiArtists, {
    fields: [projects.aiArtistId],
    references: [aiArtists.id],
  }),
  collaborators: many(collaborators),
  securityLogs: many(securityLogs),
}));

export const aiArtistsRelations = relations(aiArtists, ({ many }) => ({
  projects: many(projects),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

export const collaboratorsRelations = relations(collaborators, ({ one }) => ({
  project: one(projects, {
    fields: [collaborators.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [collaborators.userId],
    references: [users.id],
  }),
}));

export const securityLogsRelations = relations(securityLogs, ({ one }) => ({
  user: one(users, {
    fields: [securityLogs.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [securityLogs.projectId],
    references: [projects.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiArtistSchema = createInsertSchema(aiArtists).omit({
  id: true,
  createdAt: true,
});

export const insertCollaboratorSchema = createInsertSchema(collaborators).omit({
  id: true,
  createdAt: true,
});

export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertAiArtist = z.infer<typeof insertAiArtistSchema>;
export type AiArtist = typeof aiArtists.$inferSelect;
export type UserStats = typeof userStats.$inferSelect;
export type InsertCollaborator = z.infer<typeof insertCollaboratorSchema>;
export type Collaborator = typeof collaborators.$inferSelect;
export type InsertSecurityLog = z.infer<typeof insertSecurityLogSchema>;
export type SecurityLog = typeof securityLogs.$inferSelect;
