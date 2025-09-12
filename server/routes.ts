import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you'd verify the hashed password
      // For demo purposes, we'll accept any password for existing users
      
      // Update last login
      await storage.updateUser(user.id, { lastLogin: new Date() });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    res.json({ message: "Logged out successfully" });
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.body);
      
      // In a real app, you'd send an email with reset link
      // For demo purposes, we'll just return success
      res.json({ message: "Password reset link sent if account exists" });
    } catch (error) {
      res.status(400).json({ message: "Invalid email address" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    const users = await storage.getAllUsers();
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Queue management routes
  app.get("/api/queue-items", async (req, res) => {
    const items = await storage.getQueueItems();
    res.json(items);
  });

  app.patch("/api/queue-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const item = await storage.updateQueueItem(id, updates);
      if (!item) {
        return res.status(404).json({ message: "Queue item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // PA Requests routes
  app.get("/api/pa-requests", async (req, res) => {
    const requests = await storage.getPaRequests();
    res.json(requests);
  });

  app.patch("/api/pa-requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const request = await storage.updatePaRequest(id, updates);
      if (!request) {
        return res.status(404).json({ message: "PA request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // EV Records routes
  app.get("/api/ev-records", async (req, res) => {
    const records = await storage.getEvRecords();
    res.json(records);
  });

  app.patch("/api/ev-records/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const record = await storage.updateEvRecord(id, updates);
      if (!record) {
        return res.status(404).json({ message: "EV record not found" });
      }
      
      res.json(record);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Dashboard metrics route
  app.get("/api/dashboard/metrics", async (req, res) => {
    const queueItems = await storage.getQueueItems();
    const paRequests = await storage.getPaRequests();
    const evRecords = await storage.getEvRecords();
    
    const pendingQueueItems = queueItems.filter(item => item.status === "pending").length;
    const paSubmitted = paRequests.length;
    const paApproved = paRequests.filter(req => req.status === "approved").length;
    const paDenied = paRequests.filter(req => req.status === "denied").length;
    const paPending = paRequests.filter(req => req.status === "pending").length;
    const evCompleted = evRecords.filter(ev => ev.status === "completed").length;
    
    const metrics = {
      pendingQueueItems,
      paSubmitted,
      paApproved,
      evCompleted,
      paStats: {
        approved: { 
          count: paApproved, 
          percentage: paSubmitted > 0 ? Math.round((paApproved / paSubmitted) * 100) : 0 
        },
        pending: { 
          count: paPending, 
          percentage: paSubmitted > 0 ? Math.round((paPending / paSubmitted) * 100) : 0 
        },
        denied: { 
          count: paDenied, 
          percentage: paSubmitted > 0 ? Math.round((paDenied / paSubmitted) * 100) : 0 
        },
      },
    };
    
    res.json(metrics);
  });

  // Reports routes
  app.post("/api/reports/download", async (req, res) => {
    try {
      const { reportType, format } = req.body;
      
      // In a real app, you'd generate actual reports
      // For demo purposes, we'll simulate the download
      res.json({ 
        message: `${reportType} report in ${format} format is being prepared`,
        downloadUrl: `/api/reports/download/${reportType}-${Date.now()}.${format}`
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid report request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
