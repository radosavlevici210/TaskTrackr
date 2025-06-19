import {
  users,
  projects,
  aiArtists,
  userStats,
  analytics,
  securityLogs,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type AiArtist,
  type InsertAiArtist,
  type UserStats,
  type InsertUserStats,
  type Analytics,
  type InsertAnalytics,
  type SecurityLog,
  type InsertSecurityLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: string, userId: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, userId: string, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: string, userId: string): Promise<boolean>;
  
  // AI Artist operations
  getAiArtists(): Promise<AiArtist[]>;
  getAiArtist(id: number): Promise<AiArtist | undefined>;
  createAiArtist(artist: InsertAiArtist): Promise<AiArtist>;
  
  // Statistics operations
  getUserStats(userId: string): Promise<UserStats | undefined>;
  updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats>;
  
  // Analytics operations
  recordAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalytics(userId: string, limit?: number): Promise<Analytics[]>;
  
  // Security operations
  recordSecurityLog(log: InsertSecurityLog): Promise<SecurityLog>;
  getSecurityLogs(userId: string, limit?: number): Promise<SecurityLog[]>;
  
  // Dashboard data
  getDashboardStats(userId: string): Promise<{
    songsCreated: number;
    totalStreams: number;
    royaltiesEarned: string;
    aiCredits: number;
    recentProjects: Project[];
    monthlyGrowth: {
      streams: number;
      royalties: number;
    };
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
      
    // Ensure user stats exist
    await this.ensureUserStats(user.id);
    
    return user;
  }

  // Project operations
  async getProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt));
  }

  async getProject(id: string, userId: string): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: string, userId: string, updates: Partial<Project>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();
    return updated;
  }

  async deleteProject(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));
    return result.rowCount > 0;
  }

  // AI Artist operations
  async getAiArtists(): Promise<AiArtist[]> {
    return await db
      .select()
      .from(aiArtists)
      .where(eq(aiArtists.isActive, true))
      .orderBy(aiArtists.name);
  }

  async getAiArtist(id: number): Promise<AiArtist | undefined> {
    const [artist] = await db
      .select()
      .from(aiArtists)
      .where(eq(aiArtists.id, id));
    return artist;
  }

  async createAiArtist(artist: InsertAiArtist): Promise<AiArtist> {
    const [newArtist] = await db
      .insert(aiArtists)
      .values(artist)
      .returning();
    return newArtist;
  }

  // Statistics operations
  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId));
    return stats;
  }

  async updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats> {
    const [updated] = await db
      .update(userStats)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userStats.userId, userId))
      .returning();
    return updated;
  }

  private async ensureUserStats(userId: string): Promise<void> {
    const existing = await this.getUserStats(userId);
    if (!existing) {
      await db.insert(userStats).values({ userId });
    }
  }

  // Analytics operations
  async recordAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [analytics] = await db
      .insert(analytics)
      .values(analyticsData)
      .returning();
    return analytics;
  }

  async getAnalytics(userId: string, limit = 100): Promise<Analytics[]> {
    return await db
      .select()
      .from(analytics)
      .where(eq(analytics.userId, userId))
      .orderBy(desc(analytics.createdAt))
      .limit(limit);
  }

  // Security operations
  async recordSecurityLog(logData: InsertSecurityLog): Promise<SecurityLog> {
    const [log] = await db
      .insert(securityLogs)
      .values(logData)
      .returning();
    return log;
  }

  async getSecurityLogs(userId: string, limit = 50): Promise<SecurityLog[]> {
    return await db
      .select()
      .from(securityLogs)
      .where(eq(securityLogs.userId, userId))
      .orderBy(desc(securityLogs.createdAt))
      .limit(limit);
  }

  // Dashboard data
  async getDashboardStats(userId: string): Promise<{
    songsCreated: number;
    totalStreams: number;
    royaltiesEarned: string;
    aiCredits: number;
    recentProjects: Project[];
    monthlyGrowth: {
      streams: number;
      royalties: number;
    };
  }> {
    // Get user and their stats
    const user = await this.getUser(userId);
    const stats = await this.getUserStats(userId);
    
    // Get recent projects
    const recentProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt))
      .limit(5);

    // Calculate monthly growth (mock for now - would need historical data)
    const monthlyGrowth = {
      streams: 28, // percentage growth
      royalties: 15, // percentage growth
    };

    return {
      songsCreated: stats?.songsCreated || 0,
      totalStreams: stats?.totalStreams || 0,
      royaltiesEarned: stats?.royaltiesEarned || "0.00",
      aiCredits: user?.aiCredits || 0,
      recentProjects,
      monthlyGrowth,
    };
  }
}

export const storage = new DatabaseStorage();
