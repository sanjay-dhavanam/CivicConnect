import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertIssueSchema,
  insertCommentSchema,
  insertVoteSchema,
  insertBudgetSchema,
  insertRepresentativeSchema,
  insertLocationSchema,
  insertOtpSchema,
  otpRequestSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import MemoryStore from "memorystore";
import crypto from "crypto";
import { sendOTP, verifyOTP } from './controllers/otp';

// Helper to generate a 6-digit OTP for internal use
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const SessionStore = MemoryStore(session);

declare module "express-session" {
  interface SessionData {
    userId: number;
    userType: string;
    location?: any;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up sessions
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "hackhive-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
      store: new SessionStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      })
    })
  );

  // Middleware to validate request data against zod schema
  const validateRequest = (schema: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          res.status(400).json({ message: validationError.message });
        } else {
          res.status(400).json({ message: "Invalid request data" });
        }
      }
    };
  };

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Middleware to check if user is a government official
  const isGovernmentOfficial = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId && req.session.userType === "government") {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Government access required" });
    }
  };

  // We already have a generateOTP function at the top of the file

  // All API routes should be prefixed with /api
  const apiRouter = express.Router();

  // Auth routes
  apiRouter.post("/auth/register", validateRequest(insertUserSchema), async (req, res) => {
    try {
      const existingUser = await storage.getUserByPhone(req.body.phone);
      if (existingUser) {
        return res.status(409).json({ message: "User with this phone number already exists" });
      }

      // In a real app, we would hash the password
      const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword
      });

      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  apiRouter.post("/auth/login", async (req, res) => {
    try {
      const { phone, password } = req.body;
      
      const user = await storage.getUserByPhone(phone);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      if (user.password !== hashedPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;
      req.session.userType = user.userType;

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  apiRouter.post("/auth/govt-login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.userType !== "government") {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      if (user.password !== hashedPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;
      req.session.userType = user.userType;

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  apiRouter.post("/auth/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  apiRouter.get("/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "User not found" });
      }

      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user data" });
    }
  });

  // OTP routes
  apiRouter.post("/auth/send-otp", validateRequest(otpRequestSchema), sendOTP);
  apiRouter.post("/auth/verify-otp", verifyOTP);

  // Location routes
  apiRouter.get("/locations", async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  apiRouter.post("/locations", isGovernmentOfficial, validateRequest(insertLocationSchema), async (req, res) => {
    try {
      const location = await storage.createLocation(req.body);
      res.status(201).json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to create location" });
    }
  });

  // Set user location
  apiRouter.post("/set-location", isAuthenticated, async (req, res) => {
    try {
      const { locationId } = req.body;
      req.session.location = locationId;
      res.json({ message: "Location set successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to set location" });
    }
  });

  // Issue routes
  apiRouter.post("/issues", validateRequest(insertIssueSchema), async (req, res) => {
    try {
      // Set a default reportedBy ID for anonymous reports (1 is a system user ID)
      const reportedBy = req.session.userId || 1; // 1 is our system user for anonymous reports
      
      console.log("Received issue data:", req.body);
      
      // Extract the data we need, making sure to handle required fields
      const issueData = {
        ...req.body,
        reportedBy,
        status: req.body.status || "pending",
        priority: req.body.priority || "medium"
      };
      
      console.log("Processing issue creation with data:", issueData);
      
      const issue = await storage.createIssue(issueData);
      console.log("Issue created successfully:", issue);
      
      res.status(201).json(issue);
    } catch (error) {
      console.error("Error creating issue:", error);
      res.status(500).json({ message: "Failed to create issue", error: String(error) });
    }
  });

  apiRouter.get("/issues", async (req, res) => {
    try {
      const filters: any = {};
      
      // Apply query filters
      if (req.query.status) filters.status = req.query.status;
      if (req.query.type) filters.type = req.query.type;
      if (req.query.priority) filters.priority = req.query.priority;
      
      // Apply location filter if specified
      if (req.query.locationId) {
        // In a real app, we would fetch the location by ID
        filters.location = req.query.locationId;
      } else if (req.session.location) {
        filters.location = req.session.location;
      }
      
      const issues = await storage.getIssues(filters);
      res.json(issues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch issues" });
    }
  });

  apiRouter.get("/issues/:id", async (req, res) => {
    try {
      const issueId = parseInt(req.params.id);
      const issue = await storage.getIssue(issueId);
      
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
      
      res.json(issue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch issue" });
    }
  });

  apiRouter.patch("/issues/:id/status", isGovernmentOfficial, async (req, res) => {
    try {
      const issueId = parseInt(req.params.id);
      const { status } = req.body;
      
      const updatedIssue = await storage.updateIssueStatus(issueId, status);
      
      if (!updatedIssue) {
        return res.status(404).json({ message: "Issue not found" });
      }
      
      res.json(updatedIssue);
    } catch (error) {
      res.status(500).json({ message: "Failed to update issue status" });
    }
  });

  // Comment routes
  apiRouter.post("/issues/:id/comments", isAuthenticated, validateRequest(insertCommentSchema), async (req, res) => {
    try {
      const issueId = parseInt(req.params.id);
      
      const comment = await storage.createComment({
        ...req.body,
        issueId,
        userId: req.session.userId!
      });
      
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  apiRouter.get("/issues/:id/comments", async (req, res) => {
    try {
      const issueId = parseInt(req.params.id);
      const comments = await storage.getCommentsByIssue(issueId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Vote routes
  apiRouter.post("/issues/:id/vote", isAuthenticated, validateRequest(insertVoteSchema), async (req, res) => {
    try {
      const issueId = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      // Check if user has already voted
      const existingVote = await storage.getVoteByUserAndIssue(userId, issueId);
      if (existingVote) {
        return res.status(409).json({ message: "You have already voted on this issue" });
      }
      
      const vote = await storage.createVote({
        issueId,
        userId,
        vote: req.body.vote
      });
      
      res.status(201).json(vote);
    } catch (error) {
      res.status(500).json({ message: "Failed to register vote" });
    }
  });

  // Budget routes
  apiRouter.get("/budgets", async (req, res) => {
    try {
      const filters: any = {};
      
      // Apply query filters
      if (req.query.category) filters.category = req.query.category;
      if (req.query.fiscalYear) filters.fiscalYear = req.query.fiscalYear;
      if (req.query.status) filters.status = req.query.status;
      
      // Apply location filter if specified
      if (req.query.locationId) {
        filters.location = req.query.locationId;
      } else if (req.session.location) {
        filters.location = req.session.location;
      }
      
      const budgets = await storage.getBudgets(filters);
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budgets" });
    }
  });

  apiRouter.post("/budgets", isGovernmentOfficial, validateRequest(insertBudgetSchema), async (req, res) => {
    try {
      const budget = await storage.createBudget(req.body);
      res.status(201).json(budget);
    } catch (error) {
      res.status(500).json({ message: "Failed to create budget" });
    }
  });

  // Representative routes
  apiRouter.get("/representatives", async (req, res) => {
    try {
      const filters: any = {};
      
      // Apply query filters
      if (req.query.position) filters.position = req.query.position;
      if (req.query.party) filters.party = req.query.party;
      
      // Apply location filter if specified
      if (req.query.locationId) {
        filters.location = req.query.locationId;
      } else if (req.session.location) {
        filters.location = req.session.location;
      }
      
      const representatives = await storage.getRepresentatives(filters);
      res.json(representatives);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch representatives" });
    }
  });

  apiRouter.post("/representatives", isGovernmentOfficial, validateRequest(insertRepresentativeSchema), async (req, res) => {
    try {
      const representative = await storage.createRepresentative(req.body);
      res.status(201).json(representative);
    } catch (error) {
      res.status(500).json({ message: "Failed to create representative" });
    }
  });

  // Parliamentary Speech routes
  apiRouter.get("/parliamentary-speeches", async (req, res) => {
    try {
      const filters: any = {};
      
      // Apply query filters
      if (req.query.house) filters.house = req.query.house;
      if (req.query.speakerId) filters.speakerId = parseInt(req.query.speakerId as string);
      if (req.query.originalLanguage) filters.originalLanguage = req.query.originalLanguage;
      
      const speeches = await storage.getParliamentarySpeeches(filters);
      res.json(speeches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parliamentary speeches" });
    }
  });

  apiRouter.post("/parliamentary-speeches/:id/translate", async (req, res) => {
    try {
      const speechId = parseInt(req.params.id);
      const { targetLanguage } = req.body;
      
      const translatedText = await storage.translateSpeech(speechId, targetLanguage);
      res.json({ translatedText });
    } catch (error) {
      res.status(500).json({ message: "Failed to translate speech" });
    }
  });

  // Register the API router with /api prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
