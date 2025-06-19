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

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  plan: varchar("plan").default("free").notNull(), // free, professional, enterprise
  aiCredits: integer("ai_credits").default(100).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Artists available for voice synthesis with elite features
export const aiArtists = pgTable("ai_artists", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  gender: varchar("gender").notNull(), // male, female, neutral
  genre: varchar("genre").notNull(), // pop, hip-hop, r&b, rock, electronic, etc.
  description: text("description"),
  voiceType: varchar("voice_type").notNull(), // soprano, alto, tenor, bass, etc.
  language: varchar("language").default("en").notNull(),
  supportedLanguages: jsonb("supported_languages"), // Multi-language singing support
  emotionRange: jsonb("emotion_range"), // Emotion mapping capabilities
  voiceDna: text("voice_dna"), // Unique voice characteristics for fusion
  fusionCompatible: boolean("fusion_compatible").default(false).notNull(),
  eliteTier: varchar("elite_tier").default("standard").notNull(), // standard, premium, elite
  isActive: boolean("is_active").default(true).notNull(),
  previewUrl: varchar("preview_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Music projects with elite AI features
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  lyrics: text("lyrics"),
  translatedLyrics: jsonb("translated_lyrics"), // Multi-language versions
  genre: varchar("genre"),
  originalGenre: varchar("original_genre"), // For genre switching feature
  mood: varchar("mood"),
  emotionPath: jsonb("emotion_path"), // Emotion mapping through song
  tempo: varchar("tempo"),
  aiArtistId: integer("ai_artist_id").references(() => aiArtists.id),
  fusedVoices: jsonb("fused_voices"), // Voice fusion data
  status: varchar("status").default("draft").notNull(), // draft, processing, completed, failed
  audioUrl: varchar("audio_url"),
  videoUrl: varchar("video_url"),
  interactiveVideoUrl: varchar("interactive_video_url"), // WebGL/3D video
  bundleUrl: varchar("bundle_url"),
  certificateUrl: varchar("certificate_url"),
  quantumWatermark: text("quantum_watermark"), // Quantum-locked protection
  promotionPackage: jsonb("promotion_package"), // AI-generated promotion content
  royaltyTracking: jsonb("royalty_tracking"), // Real-time earnings data
  popularityMap: jsonb("popularity_map"), // Global listener heatmap
  leakSurveillance: boolean("leak_surveillance").default(true).notNull(),
  metadata: jsonb("metadata"), // stores additional processing info
  processingStep: integer("processing_step").default(0).notNull(), // 0-6 for progress tracking
  totalSteps: integer("total_steps").default(6).notNull(),
  estimatedDuration: integer("estimated_duration"), // in seconds
  actualDuration: integer("actual_duration"),
  streamCount: integer("stream_count").default(0).notNull(),
  aiScore: decimal("ai_score", { precision: 3, scale: 2 }), // AI feedback score
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// User statistics
export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  songsCreated: integer("songs_created").default(0).notNull(),
  totalStreams: integer("total_streams").default(0).notNull(),
  royaltiesEarned: decimal("royalties_earned", { precision: 10, scale: 2 }).default("0.00").notNull(),
  monthlyStreams: integer("monthly_streams").default(0).notNull(),
  monthlyRoyalties: decimal("monthly_royalties", { precision: 10, scale: 2 }).default("0.00").notNull(),
  topGenre: varchar("top_genre"),
  totalPlaytime: integer("total_playtime").default(0).notNull(), // in seconds
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Platform analytics
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  projectId: uuid("project_id").references(() => projects.id),
  eventType: varchar("event_type").notNull(), // stream, download, share, etc.
  platform: varchar("platform"), // spotify, apple, youtube, etc.
  country: varchar("country"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Security logs
export const securityLogs = pgTable("security_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  eventType: varchar("event_type").notNull(), // login, download, share, suspicious_activity
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  location: varchar("location"),
  details: jsonb("details"),
  severity: varchar("severity").default("info").notNull(), // info, warning, critical
  createdAt: timestamp("created_at").defaultNow(),
});

// Live collaboration sessions
export const collaborationSessions = pgTable("collaboration_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  hostUserId: varchar("host_user_id").references(() => users.id).notNull(),
  participants: jsonb("participants"), // Array of user IDs
  isActive: boolean("is_active").default(true).notNull(),
  sessionData: jsonb("session_data"), // Real-time editing state
  createdAt: timestamp("created_at").defaultNow(),
  endedAt: timestamp("ended_at"),
});

// Marketplace for selling/licensing tracks
export const marketplace = pgTable("marketplace", {
  id: serial("id").primaryKey(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  sellerId: varchar("seller_id").references(() => users.id).notNull(),
  listingType: varchar("listing_type").notNull(), // sale, license, exclusive
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  tags: jsonb("tags"),
  isActive: boolean("is_active").default(true).notNull(),
  purchaseCount: integer("purchase_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI feedback and improvements
export const aiFeedback = pgTable("ai_feedback", {
  id: serial("id").primaryKey(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  feedbackType: varchar("feedback_type").notNull(), // score, improvement, remix
  score: decimal("score", { precision: 3, scale: 2 }),
  suggestions: jsonb("suggestions"),
  improvementData: jsonb("improvement_data"), // For one-click improvements
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  projects: many(projects),
  stats: one(userStats),
  analytics: many(analytics),
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
  analytics: many(analytics),
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

export const analyticsRelations = relations(analytics, ({ one }) => ({
  user: one(users, {
    fields: [analytics.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [analytics.projectId],
    references: [projects.id],
  }),
}));

export const securityLogsRelations = relations(securityLogs, ({ one }) => ({
  user: one(users, {
    fields: [securityLogs.userId],
    references: [users.id],
  }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertProject = typeof projects.$inferInsert;
export type Project = typeof projects.$inferSelect;

export type InsertAiArtist = typeof aiArtists.$inferInsert;
export type AiArtist = typeof aiArtists.$inferSelect;

export type InsertUserStats = typeof userStats.$inferInsert;
export type UserStats = typeof userStats.$inferSelect;

export type InsertAnalytics = typeof analytics.$inferInsert;
export type Analytics = typeof analytics.$inferSelect;

export type InsertSecurityLog = typeof securityLogs.$inferInsert;
export type SecurityLog = typeof securityLogs.$inferSelect;

// Schemas
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
});

export const updateProjectSchema = createInsertSchema(projects).omit({
  id: true,
  userId: true,
  createdAt: true,
}).partial();

export const insertAiArtistSchema = createInsertSchema(aiArtists).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({
  id: true,
  createdAt: true,
});
