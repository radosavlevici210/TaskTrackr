import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProjectSchema, insertCollaboratorSchema, insertSecurityLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User stats endpoint
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Projects endpoints
  app.get('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId,
      });
      
      const project = await storage.createProject(projectData);
      
      // Log security event
      await storage.logSecurityEvent({
        userId,
        projectId: project.id,
        eventType: 'project_created',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        description: `New project created: ${project.title}`,
      });
      
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ message: "Failed to create project" });
    }
  });

  app.get('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.patch('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;
      
      const project = await storage.updateProject(req.params.id, userId, updates);
      
      // Log security event
      await storage.logSecurityEvent({
        userId,
        projectId: project.id,
        eventType: 'project_updated',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        description: `Project updated: ${project.title}`,
      });
      
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(400).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteProject(req.params.id, userId);
      
      // Log security event
      await storage.logSecurityEvent({
        userId,
        projectId: req.params.id,
        eventType: 'project_deleted',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        description: `Project deleted: ${req.params.id}`,
      });
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(400).json({ message: "Failed to delete project" });
    }
  });

  // AI Artists endpoints
  app.get('/api/ai-artists', async (req, res) => {
    try {
      const artists = await storage.getAiArtists();
      res.json(artists);
    } catch (error) {
      console.error("Error fetching AI artists:", error);
      res.status(500).json({ message: "Failed to fetch AI artists" });
    }
  });

  // AI Generation endpoints
  app.post('/api/ai/generate-script', isAuthenticated, async (req: any, res) => {
    try {
      const { lyrics, genre, mood } = req.body;
      
      // Simulate AI script generation
      const script = {
        structure: "verse-chorus-verse-chorus-bridge-chorus",
        verses: 2,
        choruses: 3,
        bridge: 1,
        estimatedDuration: Math.floor(Math.random() * 60) + 180, // 3-4 minutes
        sections: [
          { type: "intro", duration: 8 },
          { type: "verse", duration: 24 },
          { type: "chorus", duration: 20 },
          { type: "verse", duration: 24 },
          { type: "chorus", duration: 20 },
          { type: "bridge", duration: 16 },
          { type: "chorus", duration: 20 },
          { type: "outro", duration: 12 }
        ]
      };
      
      res.json(script);
    } catch (error) {
      console.error("Error generating script:", error);
      res.status(500).json({ message: "Failed to generate script" });
    }
  });

  app.post('/api/ai/generate-voice', isAuthenticated, async (req: any, res) => {
    try {
      const { projectId, aiArtistId, script } = req.body;
      const userId = req.user.claims.sub;
      
      // Update project status to generating voice
      await storage.updateProject(projectId, userId, {
        status: 'generating',
        currentStep: 'voice',
        generationProgress: 35
      });
      
      // Simulate voice generation process
      setTimeout(async () => {
        await storage.updateProject(projectId, userId, {
          currentStep: 'instrumental',
          generationProgress: 50
        });
      }, 2000);
      
      res.json({ message: "Voice generation started", progress: 35 });
    } catch (error) {
      console.error("Error generating voice:", error);
      res.status(500).json({ message: "Failed to generate voice" });
    }
  });

  app.post('/api/ai/generate-instrumental', isAuthenticated, async (req: any, res) => {
    try {
      const { projectId, genre, tempo, mood } = req.body;
      const userId = req.user.claims.sub;
      
      // Update project status
      await storage.updateProject(projectId, userId, {
        currentStep: 'instrumental',
        generationProgress: 65
      });
      
      // Simulate instrumental generation
      setTimeout(async () => {
        await storage.updateProject(projectId, userId, {
          currentStep: 'mixing',
          generationProgress: 85
        });
      }, 3000);
      
      res.json({ message: "Instrumental generation started", progress: 65 });
    } catch (error) {
      console.error("Error generating instrumental:", error);
      res.status(500).json({ message: "Failed to generate instrumental" });
    }
  });

  // Collaborators endpoints
  app.get('/api/projects/:id/collaborators', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getProject(req.params.id, userId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const collaborators = await storage.getCollaborators(req.params.id);
      res.json(collaborators);
    } catch (error) {
      console.error("Error fetching collaborators:", error);
      res.status(500).json({ message: "Failed to fetch collaborators" });
    }
  });

  app.post('/api/projects/:id/collaborators', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getProject(req.params.id, userId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const collaboratorData = insertCollaboratorSchema.parse({
        ...req.body,
        projectId: req.params.id,
      });
      
      const collaborator = await storage.addCollaborator(collaboratorData);
      res.status(201).json(collaborator);
    } catch (error) {
      console.error("Error adding collaborator:", error);
      res.status(400).json({ message: "Failed to add collaborator" });
    }
  });

  // Security endpoints
  app.get('/api/security/logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await storage.getSecurityLogs(userId, limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching security logs:", error);
      res.status(500).json({ message: "Failed to fetch security logs" });
    }
  });

  app.post('/api/security/log', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logData = insertSecurityLogSchema.parse({
        ...req.body,
        userId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
      
      const log = await storage.logSecurityEvent(logData);
      res.status(201).json(log);
    } catch (error) {
      console.error("Error logging security event:", error);
      res.status(400).json({ message: "Failed to log security event" });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
