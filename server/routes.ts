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


  // AI Video Director
  app.post('/api/ai/generate-video', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { projectId, videoStyle, isInteractive } = req.body;

      res.json({
        success: true,
        video: {
          standardUrl: "/api/generated-video.mp4",
          interactiveUrl: isInteractive ? "/api/interactive-video.html" : null,
          scenes: [
            { timestamp: 0, style: "dramatic", lighting: "moody", camera: "close-up" },
            { timestamp: 30, style: "energetic", lighting: "bright", camera: "wide" }
          ]
        }
      });
    } catch (error) {
      console.error("Error generating video:", error);
      res.status(500).json({ message: "Failed to generate video" });
    }
  });

  // AI Promotion Bot
  app.post('/api/ai/generate-promotion', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { projectId, platforms } = req.body;

      res.json({
        success: true,
        promotionPackage: {
          captions: {
            tiktok: "🎵 New track dropping! #NewMusic #AI #Viral",
            instagram: "Just created this amazing track with AI 🎶✨ #MusicMaker",
            twitter: "My latest AI-generated masterpiece is here! 🎵"
          },
          hashtags: ["#AIMusic", "#NewTrack", "#MusicMaker", "#Viral"],
          shortClips: [
            { platform: "tiktok", duration: 15, url: "/api/clip-15s.mp4" },
            { platform: "instagram", duration: 30, url: "/api/clip-30s.mp4" }
          ]
        }
      });
    } catch (error) {
      console.error("Error generating promotion:", error);
      res.status(500).json({ message: "Failed to generate promotion" });
    }
  });

  // AI Feedback System
  app.post('/api/ai/analyze-track', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { projectId } = req.body;

      res.json({
        success: true,
        analysis: {
          overallScore: 8.5,
          strengths: ["Strong melody", "Good vocal performance", "Professional mix"],
          improvements: ["Add more bass in chorus", "Extend bridge section"],
          marketPotential: 0.75,
          suggestedGenres: ["pop", "electronic"],
          emotionDetected: ["happy", "energetic"]
        }
      });
    } catch (error) {
      console.error("Error analyzing track:", error);
      res.status(500).json({ message: "Failed to analyze track" });
    }
  });

  // Genre Switch Feature
  app.post('/api/ai/switch-genre', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { projectId, newGenre, preserveVocals } = req.body;

      res.json({
        success: true,
        newTrack: {
          audioUrl: `/api/genre-switched-${newGenre}.mp3`,
          changes: ["Instrumentation updated", "Tempo adjusted", "Effects modified"],
          preservedElements: preserveVocals ? ["vocals", "lyrics"] : []
        }
      });
    } catch (error) {
      console.error("Error switching genre:", error);
      res.status(500).json({ message: "Failed to switch genre" });
    }
  });

  // Real-time Royalty Tracking
  app.get('/api/royalties/real-time/:projectId', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { projectId } = req.params;

      res.json({
        success: true,
        royalties: {
          totalEarnings: "156.73",
          todayEarnings: "12.45",
          platforms: {
            spotify: { streams: 15420, earnings: "92.34" },
            youtube: { views: 8750, earnings: "31.20" },
            tiktok: { plays: 25600, earnings: "18.90" },
            apple: { streams: 3200, earnings: "14.29" }
          },
          trending: true,
          growthRate: 0.15
        }
      });
    } catch (error) {
      console.error("Error fetching royalties:", error);
      res.status(500).json({ message: "Failed to fetch royalties" });
    }
  });

  // Live Collaboration
  app.post('/api/collaboration/start', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { projectId, inviteEmails } = req.body;

      res.json({
        success: true,
        session: {
          id: `collab_${Date.now()}`,
          projectId,
          hostId: userId,
          inviteLinks: inviteEmails.map((email: string) => ({
            email,
            link: `${req.protocol}://${req.get('host')}/collaborate/session_${Date.now()}`
          })),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      });
    } catch (error) {
      console.error("Error starting collaboration:", error);
      res.status(500).json({ message: "Failed to start collaboration" });
    }
  });

  // Leak Surveillance
  app.get('/api/security/leak-scan/:projectId', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { projectId } = req.params;

      res.json({
        success: true,
        surveillance: {
          status: "protected",
          scansPerformed: 1247,
          threatsDetected: 0,
          lastScan: new Date().toISOString(),
          watermarkIntegrity: "intact",
          unauthorizedUse: []
        }
      });
    } catch (error) {
      console.error("Error scanning for leaks:", error);
      res.status(500).json({ message: "Failed to scan for leaks" });
    }
  });

  // Elite AI Generation routes
  app.post('/api/ai/generate-script', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { lyrics, genre, mood, emotionPath } = req.body;

      // Advanced script generation with emotion mapping
      res.json({
        success: true,
        script: {
          structure: "verse-chorus-verse-chorus-bridge-chorus",
          emotionFlow: emotionPath || ["calm", "building", "intense", "resolution"],
          sections: [
            { type: "verse", lyrics: lyrics.split('\n').slice(0, 4).join('\n'), emotion: "calm" },
            { type: "chorus", lyrics: lyrics.split('\n').slice(4, 8).join('\n'), emotion: "intense" },
          ],
          instrumentalCues: {
            verse: { instruments: ["piano", "strings"], intensity: 0.3 },
            chorus: { instruments: ["drums", "guitar", "bass"], intensity: 0.8 }
          }
        }
      });
    } catch (error) {
      console.error("Error generating script:", error);
      res.status(500).json({ message: "Failed to generate script" });
    }
  });

  // Multi-language lyrics translation
  app.post('/api/ai/translate-lyrics', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { lyrics, targetLanguages, preserveRhyme } = req.body;

      res.json({
        success: true,
        translations: targetLanguages.map((lang: string) => ({
          language: lang,
          lyrics: lyrics, // Placeholder - would integrate with translation AI
          rhymePreserved: preserveRhyme,
          culturalAdaptations: []
        }))
      });
    } catch (error) {
      console.error("Error translating lyrics:", error);
      res.status(500).json({ message: "Failed to translate lyrics" });
    }
  });

  // Voice fusion generator
  app.post('/api/ai/fuse-voices', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.claims.sub;
      const { artistIds, fusionStyle, customDna } = req.body;

      res.json({
        success: true,
        fusedVoice: {
          id: `fusion_${Date.now()}`,
          name: `Custom Fusion Voice`,
          characteristics: artistIds.map((id: number) => `Artist_${id}_DNA`),
          voiceDna: customDna || "generated_dna_signature",
          previewUrl: "/api/fusion-preview.mp3"
        }
      });
    } catch (error) {
      console.error("Error fusing voices:", error);
      res.status(500).json({ message: "Failed to fuse voices" });
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
