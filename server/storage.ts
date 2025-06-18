import {
  users,
  projects,
  aiArtists,
  userStats,
  collaborators,
  securityLogs,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type AiArtist,
  type UserStats,
  type InsertCollaborator,
  type Collaborator,
  type InsertSecurityLog,
  type SecurityLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: string, userId: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, userId: string, updates: Partial<Project>): Promise<Project>;
  deleteProject(id: string, userId: string): Promise<void>;
  
  // AI Artist operations
  getAiArtists(): Promise<AiArtist[]>;
  getAiArtist(id: number): Promise<AiArtist | undefined>;
  
  // User statistics
  getUserStats(userId: string): Promise<UserStats | undefined>;
  updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats>;
  
  // Collaborator operations
  getCollaborators(projectId: string): Promise<Collaborator[]>;
  addCollaborator(collaborator: InsertCollaborator): Promise<Collaborator>;
  removeCollaborator(id: string, userId: string): Promise<void>;
  
  // Security operations
  logSecurityEvent(event: InsertSecurityLog): Promise<SecurityLog>;
  getSecurityLogs(userId: string, limit?: number): Promise<SecurityLog[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
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
    
    // Initialize user stats if new user
    await db
      .insert(userStats)
      .values({ userId: user.id })
      .onConflictDoNothing();
    
    return user;
  }

  // Project operations
  async getProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));
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
    
    // Update user stats
    await db
      .update(userStats)
      .set({
        totalSongs: sql`${userStats.totalSongs} + 1`,
        lastUpdated: new Date(),
      })
      .where(eq(userStats.userId, project.userId));

    return newProject;
  }

  async updateProject(id: string, userId: string, updates: Partial<Project>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();

    if (!updatedProject) {
      throw new Error("Project not found or unauthorized");
    }

    return updatedProject;
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)));
    
    // Update user stats
    await db
      .update(userStats)
      .set({
        totalSongs: sql`${userStats.totalSongs} - 1`,
        lastUpdated: new Date(),
      })
      .where(eq(userStats.userId, userId));
  }

  // AI Artist operations
  async getAiArtists(): Promise<AiArtist[]> {
    return await db
      .select()
      .from(aiArtists)
      .where(eq(aiArtists.isAvailable, true))
      .orderBy(desc(aiArtists.popularity));
  }

  async getAiArtist(id: number): Promise<AiArtist | undefined> {
    const [artist] = await db
      .select()
      .from(aiArtists)
      .where(eq(aiArtists.id, id));
    return artist;
  }

  // User statistics
  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId));
    return stats;
  }

  async updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats> {
    const [updatedStats] = await db
      .update(userStats)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(userStats.userId, userId))
      .returning();

    if (!updatedStats) {
      throw new Error("User stats not found");
    }

    return updatedStats;
  }

  // Collaborator operations
  async getCollaborators(projectId: string): Promise<Collaborator[]> {
    return await db
      .select()
      .from(collaborators)
      .where(eq(collaborators.projectId, projectId));
  }

  async addCollaborator(collaborator: InsertCollaborator): Promise<Collaborator> {
    const [newCollaborator] = await db
      .insert(collaborators)
      .values(collaborator)
      .returning();
    return newCollaborator;
  }

  async removeCollaborator(id: string, userId: string): Promise<void> {
    // First check if the user owns the project
    const [collaborator] = await db
      .select({ projectId: collaborators.projectId })
      .from(collaborators)
      .where(eq(collaborators.id, id));

    if (collaborator) {
      const [project] = await db
        .select({ userId: projects.userId })
        .from(projects)
        .where(eq(projects.id, collaborator.projectId));

      if (project && project.userId === userId) {
        await db.delete(collaborators).where(eq(collaborators.id, id));
      } else {
        throw new Error("Unauthorized to remove collaborator");
      }
    }
  }

  // Security operations
  async logSecurityEvent(event: InsertSecurityLog): Promise<SecurityLog> {
    const [newLog] = await db
      .insert(securityLogs)
      .values(event)
      .returning();
    return newLog;
  }

  async getSecurityLogs(userId: string, limit = 50): Promise<SecurityLog[]> {
    return await db
      .select()
      .from(securityLogs)
      .where(eq(securityLogs.userId, userId))
      .orderBy(desc(securityLogs.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
