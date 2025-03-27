import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  aadhaarNumber: text("aadhaar_number").unique(),
  password: text("password").notNull(),
  userType: text("user_type").notNull().default("citizen"), // citizen or government
  governmentRole: text("government_role"),
  department: text("department"),
  location: jsonb("location"),
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Issue schema
export const issues = pgTable("issues", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("pending"), // pending, in_progress, resolved
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  location: jsonb("location").notNull(),
  address: text("address").notNull(),
  reportedBy: integer("reported_by").notNull(),
  assignedTo: integer("assigned_to"),
  media: jsonb("media").$type<string[]>().default([]),
  upvotes: integer("upvotes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  resolvedAt: timestamp("resolved_at"),
});

export const insertIssueSchema = createInsertSchema(issues).omit({
  id: true,
  upvotes: true,
  comments: true,
  createdAt: true,
  updatedAt: true,
  resolvedAt: true,
});

// Comment schema
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  issueId: integer("issue_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

// Vote schema
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  issueId: integer("issue_id").notNull(),
  userId: integer("user_id").notNull(),
  vote: boolean("vote").notNull(), // true for upvote, false for downvote
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

// Budget schema
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  amount: integer("amount").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  location: jsonb("location").notNull(),
  fiscalYear: text("fiscal_year").notNull(),
  status: text("status").notNull().default("allocated"), // allocated, in_progress, completed
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertBudgetSchema = createInsertSchema(budgets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Representative schema
export const representatives = pgTable("representatives", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  party: text("party"),
  location: jsonb("location").notNull(),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  term: jsonb("term"),
});

export const insertRepresentativeSchema = createInsertSchema(representatives).omit({
  id: true,
});

// Location schema for dropdown
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  state: text("state").notNull(),
  type: text("type").notNull(), // city, district, etc.
  coordinates: jsonb("coordinates"), // latitude and longitude
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

// OTP schema
export const otps = pgTable("otps", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOtpSchema = createInsertSchema(otps).omit({
  id: true,
  verified: true,
  createdAt: true,
});

// Custom schema for phone-only validation when requesting OTP
export const otpRequestSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits")
});

// Parliamentary speech schema
export const parliamentarySpeeches = pgTable("parliamentary_speeches", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  originalLanguage: text("original_language").notNull(),
  translations: jsonb("translations"),
  speakerId: integer("speaker_id").notNull(),
  date: timestamp("date").notNull(),
  house: text("house").notNull(), // Lok Sabha or Rajya Sabha
});

export const insertParliamentarySpeechSchema = createInsertSchema(parliamentarySpeeches).omit({
  id: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Issue = typeof issues.$inferSelect;
export type InsertIssue = z.infer<typeof insertIssueSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;

export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;

export type Representative = typeof representatives.$inferSelect;
export type InsertRepresentative = z.infer<typeof insertRepresentativeSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type OTP = typeof otps.$inferSelect;
export type InsertOTP = z.infer<typeof insertOtpSchema>;

export type ParliamentarySpeech = typeof parliamentarySpeeches.$inferSelect;
export type InsertParliamentarySpeech = z.infer<typeof insertParliamentarySpeechSchema>;
