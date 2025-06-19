import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertProjectSchema, 
  updateProjectSchema,
  insertAnalyticsSchema,
  insertSecurityLogSchema 
} from "@shared/schema";
import { z } from "zod";

interface AuthenticatedRequest extends Request {
  user?: {
    claims: {
      sub: string;
      email?: string;
      first_name?: string;
      last_name?: string;
      profile_image_url?: string;
    };
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Project routes
  app.get('/api/projects', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const project = await storage.getProject(req.params.id, userId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId,
      });

      const project = await storage.createProject(projectData);
      
      // Record analytics
      await storage.recordAnalytics({
        userId,
        projectId: project.id,
        eventType: 'project_created',
        metadata: { title: project.title, genre: project.genre },
      });

      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid project data",
          errors: error.errors,
        });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.patch('/api/projects/:id', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const updates = updateProjectSchema.parse(req.body);
      
      const project = await storage.updateProject(req.params.id, userId, updates);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Record analytics
      await storage.recordAnalytics({
        userId,
        projectId: project.id,
        eventType: 'project_updated',
        metadata: { updates },
      });

      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid update data",
          errors: error.errors,
        });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const deleted = await storage.deleteProject(req.params.id, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Record analytics
      await storage.recordAnalytics({
        userId,
        eventType: 'project_deleted',
        metadata: { projectId: req.params.id },
      });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // AI Artist routes
  app.get('/api/ai-artists', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const artists = await storage.getAiArtists();
      res.json(artists);
    } catch (error) {
      console.error("Error fetching AI artists:", error);
      res.status(500).json({ message: "Failed to fetch AI artists" });
    }
  });

  app.get('/api/ai-artists/:id', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const artist = await storage.getAiArtist(parseInt(req.params.id));
      if (!artist) {
        return res.status(404).json({ message: "AI artist not found" });
      }
      res.json(artist);
    } catch (error) {
      console.error("Error fetching AI artist:", error);
      res.status(500).json({ message: "Failed to fetch AI artist" });
    }
  });

  // User statistics
  app.get('/api/user/stats', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats || {
        songsCreated: 0,
        totalStreams: 0,
        royaltiesEarned: "0.00",
        monthlyStreams: 0,
        monthlyRoyalties: "0.00",
        topGenre: null,
        totalPlaytime: 0
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Analytics routes
  app.get('/api/analytics', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const analytics = await storage.getAnalytics(userId, limit);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.post('/api/analytics', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const analyticsData = insertAnalyticsSchema.parse({
        ...req.body,
        userId,
      });

      const analytics = await storage.recordAnalytics(analyticsData);
      res.status(201).json(analytics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid analytics data",
          errors: error.errors,
        });
      }
      console.error("Error recording analytics:", error);
      res.status(500).json({ message: "Failed to record analytics" });
    }
  });

  // Security routes
  app.get('/api/security/logs', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getSecurityLogs(userId, limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching security logs:", error);
      res.status(500).json({ message: "Failed to fetch security logs" });
    }
  });

  app.post('/api/security/logs', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const logData = insertSecurityLogSchema.parse({
        ...req.body,
        userId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      const log = await storage.recordSecurityLog(logData);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid security log data",
          errors: error.errors,
        });
      }
      console.error("Error recording security log:", error);
      res.status(500).json({ message: "Failed to record security log" });
    }
  });

  // AI Generation routes (for future implementation)
  app.post('/api/ai/generate-script', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { lyrics, genre, mood } = req.body;

      // TODO: Implement AI script generation
      // This would integrate with AI services to generate song structure from lyrics
      
      res.json({
        success: true,
        message: "AI script generation endpoint ready for implementation",
        script: {
          structure: "verse-chorus-verse-chorus-bridge-chorus",
          sections: [
            { type: "verse", lyrics: lyrics.split('\n').slice(0, 4).join('\n') },
            { type: "chorus", lyrics: lyrics.split('\n').slice(4, 8).join('\n') },
          ]
        }
      });
    } catch (error) {
      console.error("Error generating script:", error);
      res.status(500).json({ message: "Failed to generate script" });
    }
  });

  app.post('/api/ai/generate-voice', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { script, aiArtistId } = req.body;

      // TODO: Implement AI voice generation
      // This would integrate with AI voice synthesis services
      
      res.json({
        success: true,
        message: "AI voice generation endpoint ready for implementation",
        audioUrl: "/api/placeholder-audio.mp3"
      });
    } catch (error) {
      console.error("Error generating voice:", error);
      res.status(500).json({ message: "Failed to generate voice" });
    }
  });

  app.post('/api/ai/generate-instrumental', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { genre, mood, tempo, duration } = req.body;

      // TODO: Implement AI instrumental generation
      // This would integrate with AI music generation services
      
      res.json({
        success: true,
        message: "AI instrumental generation endpoint ready for implementation",
        audioUrl: "/api/placeholder-instrumental.mp3"
      });
    } catch (error) {
      console.error("Error generating instrumental:", error);
      res.status(500).json({ message: "Failed to generate instrumental" });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
