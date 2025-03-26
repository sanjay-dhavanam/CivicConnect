import {
  User, InsertUser,
  Issue, InsertIssue,
  Comment, InsertComment,
  Vote, InsertVote,
  Budget, InsertBudget,
  Representative, InsertRepresentative,
  Location, InsertLocation,
  OTP, InsertOTP,
  ParliamentarySpeech, InsertParliamentarySpeech
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Issue operations
  createIssue(issue: InsertIssue): Promise<Issue>;
  getIssue(id: number): Promise<Issue | undefined>;
  getIssues(filters?: Partial<Issue>): Promise<Issue[]>;
  getIssuesByLocation(location: any): Promise<Issue[]>;
  updateIssueStatus(id: number, status: string): Promise<Issue | undefined>;
  upvoteIssue(id: number): Promise<Issue | undefined>;
  
  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByIssue(issueId: number): Promise<Comment[]>;
  
  // Vote operations
  createVote(vote: InsertVote): Promise<Vote>;
  getVoteByUserAndIssue(userId: number, issueId: number): Promise<Vote | undefined>;
  
  // Budget operations
  createBudget(budget: InsertBudget): Promise<Budget>;
  getBudgets(filters?: Partial<Budget>): Promise<Budget[]>;
  getBudgetsByLocation(location: any): Promise<Budget[]>;
  
  // Representative operations
  createRepresentative(representative: InsertRepresentative): Promise<Representative>;
  getRepresentatives(filters?: Partial<Representative>): Promise<Representative[]>;
  getRepresentativesByLocation(location: any): Promise<Representative[]>;
  
  // Location operations
  createLocation(location: InsertLocation): Promise<Location>;
  getLocations(): Promise<Location[]>;
  
  // OTP operations
  createOTP(otp: InsertOTP): Promise<OTP>;
  verifyOTP(phone: string, otpCode: string): Promise<boolean>;
  
  // Parliamentary Speech operations
  createParliamentarySpeech(speech: InsertParliamentarySpeech): Promise<ParliamentarySpeech>;
  getParliamentarySpeeches(filters?: Partial<ParliamentarySpeech>): Promise<ParliamentarySpeech[]>;
  translateSpeech(speechId: number, targetLanguage: string): Promise<string>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private issues: Map<number, Issue>;
  private comments: Map<number, Comment>;
  private votes: Map<number, Vote>;
  private budgets: Map<number, Budget>;
  private representatives: Map<number, Representative>;
  private locations: Map<number, Location>;
  private otps: Map<number, OTP>;
  private parliamentarySpeeches: Map<number, ParliamentarySpeech>;
  
  private userIdCounter: number;
  private issueIdCounter: number;
  private commentIdCounter: number;
  private voteIdCounter: number;
  private budgetIdCounter: number;
  private representativeIdCounter: number;
  private locationIdCounter: number;
  private otpIdCounter: number;
  private speechIdCounter: number;

  constructor() {
    this.users = new Map();
    this.issues = new Map();
    this.comments = new Map();
    this.votes = new Map();
    this.budgets = new Map();
    this.representatives = new Map();
    this.locations = new Map();
    this.otps = new Map();
    this.parliamentarySpeeches = new Map();
    
    this.userIdCounter = 1;
    this.issueIdCounter = 1;
    this.commentIdCounter = 1;
    this.voteIdCounter = 1;
    this.budgetIdCounter = 1;
    this.representativeIdCounter = 1;
    this.locationIdCounter = 1;
    this.otpIdCounter = 1;
    this.speechIdCounter = 1;
    
    // Initialize with sample data
    this.initializeLocations();
    this.initializeRepresentatives();
    this.initializeBudgetData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.phone === phone
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Issue operations
  async createIssue(issue: InsertIssue): Promise<Issue> {
    const id = this.issueIdCounter++;
    const now = new Date();
    const newIssue: Issue = { 
      ...issue, 
      id, 
      upvotes: 0, 
      comments: 0, 
      createdAt: now, 
      updatedAt: now
    };
    this.issues.set(id, newIssue);
    return newIssue;
  }

  async getIssue(id: number): Promise<Issue | undefined> {
    return this.issues.get(id);
  }

  async getIssues(filters?: Partial<Issue>): Promise<Issue[]> {
    let issues = Array.from(this.issues.values());
    
    if (filters) {
      return issues.filter(issue => {
        return Object.entries(filters).every(([key, value]) => {
          // Handle location as a special case
          if (key === 'location' && value) {
            const filterLocation = value as any;
            const issueLocation = issue.location as any;
            return filterLocation.state === issueLocation.state && 
                   filterLocation.city === issueLocation.city;
          }
          
          // @ts-ignore - Dynamic key access
          return issue[key] === value;
        });
      });
    }
    
    return issues;
  }

  async getIssuesByLocation(location: any): Promise<Issue[]> {
    return Array.from(this.issues.values()).filter(issue => {
      const issueLocation = issue.location as any;
      return issueLocation.state === location.state && 
             (location.city ? issueLocation.city === location.city : true);
    });
  }

  async updateIssueStatus(id: number, status: string): Promise<Issue | undefined> {
    const issue = this.issues.get(id);
    if (!issue) return undefined;
    
    const now = new Date();
    const updatedIssue = { 
      ...issue, 
      status, 
      updatedAt: now,
      ...(status === 'resolved' ? { resolvedAt: now } : {})
    };
    
    this.issues.set(id, updatedIssue);
    return updatedIssue;
  }

  async upvoteIssue(id: number): Promise<Issue | undefined> {
    const issue = this.issues.get(id);
    if (!issue) return undefined;
    
    const updatedIssue = { ...issue, upvotes: issue.upvotes + 1 };
    this.issues.set(id, updatedIssue);
    return updatedIssue;
  }

  // Comment operations
  async createComment(comment: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    const newComment: Comment = { ...comment, id, createdAt: now };
    this.comments.set(id, newComment);
    
    // Update comment count on issue
    const issue = this.issues.get(comment.issueId);
    if (issue) {
      const updatedIssue = { ...issue, comments: issue.comments + 1 };
      this.issues.set(issue.id, updatedIssue);
    }
    
    return newComment;
  }

  async getCommentsByIssue(issueId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.issueId === issueId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Vote operations
  async createVote(vote: InsertVote): Promise<Vote> {
    const id = this.voteIdCounter++;
    const now = new Date();
    const newVote: Vote = { ...vote, id, createdAt: now };
    this.votes.set(id, newVote);
    
    // Update upvotes on issue if it's an upvote
    if (vote.vote) {
      await this.upvoteIssue(vote.issueId);
    }
    
    return newVote;
  }

  async getVoteByUserAndIssue(userId: number, issueId: number): Promise<Vote | undefined> {
    return Array.from(this.votes.values()).find(
      vote => vote.userId === userId && vote.issueId === issueId
    );
  }

  // Budget operations
  async createBudget(budget: InsertBudget): Promise<Budget> {
    const id = this.budgetIdCounter++;
    const now = new Date();
    const newBudget: Budget = { ...budget, id, createdAt: now, updatedAt: now };
    this.budgets.set(id, newBudget);
    return newBudget;
  }

  async getBudgets(filters?: Partial<Budget>): Promise<Budget[]> {
    let budgets = Array.from(this.budgets.values());
    
    if (filters) {
      return budgets.filter(budget => {
        return Object.entries(filters).every(([key, value]) => {
          if (key === 'location' && value) {
            const filterLocation = value as any;
            const budgetLocation = budget.location as any;
            return filterLocation.state === budgetLocation.state && 
                   (filterLocation.city ? budgetLocation.city === budgetLocation.city : true);
          }
          
          // @ts-ignore - Dynamic key access
          return budget[key] === value;
        });
      });
    }
    
    return budgets;
  }

  async getBudgetsByLocation(location: any): Promise<Budget[]> {
    return Array.from(this.budgets.values()).filter(budget => {
      const budgetLocation = budget.location as any;
      return budgetLocation.state === location.state && 
             (location.city ? budgetLocation.city === location.city : true);
    });
  }

  // Representative operations
  async createRepresentative(representative: InsertRepresentative): Promise<Representative> {
    const id = this.representativeIdCounter++;
    const newRepresentative: Representative = { ...representative, id };
    this.representatives.set(id, newRepresentative);
    return newRepresentative;
  }

  async getRepresentatives(filters?: Partial<Representative>): Promise<Representative[]> {
    let representatives = Array.from(this.representatives.values());
    
    if (filters) {
      return representatives.filter(rep => {
        return Object.entries(filters).every(([key, value]) => {
          if (key === 'location' && value) {
            const filterLocation = value as any;
            const repLocation = rep.location as any;
            return filterLocation.state === repLocation.state && 
                   (filterLocation.city ? repLocation.city === repLocation.city : true);
          }
          
          // @ts-ignore - Dynamic key access
          return rep[key] === value;
        });
      });
    }
    
    return representatives;
  }

  async getRepresentativesByLocation(location: any): Promise<Representative[]> {
    return Array.from(this.representatives.values()).filter(rep => {
      const repLocation = rep.location as any;
      return repLocation.state === location.state && 
             (location.city ? repLocation.city === location.city : true);
    });
  }

  // Location operations
  async createLocation(location: InsertLocation): Promise<Location> {
    const id = this.locationIdCounter++;
    const newLocation: Location = { ...location, id };
    this.locations.set(id, newLocation);
    return newLocation;
  }

  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  // OTP operations
  async createOTP(otpData: InsertOTP): Promise<OTP> {
    const id = this.otpIdCounter++;
    const now = new Date();
    const newOTP: OTP = { 
      ...otpData, 
      id, 
      verified: false, 
      createdAt: now
    };
    this.otps.set(id, newOTP);
    return newOTP;
  }

  async verifyOTP(phone: string, otpCode: string): Promise<boolean> {
    const otp = Array.from(this.otps.values()).find(
      otp => otp.phone === phone && otp.otp === otpCode && otp.expiresAt > new Date() && !otp.verified
    );
    
    if (otp) {
      // Mark OTP as verified
      const verifiedOTP = { ...otp, verified: true };
      this.otps.set(otp.id, verifiedOTP);
      return true;
    }
    
    return false;
  }

  // Parliamentary Speech operations
  async createParliamentarySpeech(speech: InsertParliamentarySpeech): Promise<ParliamentarySpeech> {
    const id = this.speechIdCounter++;
    const newSpeech: ParliamentarySpeech = { ...speech, id };
    this.parliamentarySpeeches.set(id, newSpeech);
    return newSpeech;
  }

  async getParliamentarySpeeches(filters?: Partial<ParliamentarySpeech>): Promise<ParliamentarySpeech[]> {
    let speeches = Array.from(this.parliamentarySpeeches.values());
    
    if (filters) {
      return speeches.filter(speech => {
        return Object.entries(filters).every(([key, value]) => {
          // @ts-ignore - Dynamic key access
          return speech[key] === value;
        });
      });
    }
    
    return speeches;
  }

  async translateSpeech(speechId: number, targetLanguage: string): Promise<string> {
    const speech = this.parliamentarySpeeches.get(speechId);
    if (!speech) throw new Error('Speech not found');
    
    // In a real application, this would call a translation API
    // For MVP, we return a mock translated text
    return `Translated content of speech "${speech.title}" in ${targetLanguage}`;
  }

  // Initialize sample data
  private initializeLocations() {
    const locations = [
      { name: 'Delhi - New Delhi', state: 'Delhi', type: 'city', coordinates: { lat: 28.6139, lng: 77.2090 } },
      { name: 'Mumbai - Andheri West', state: 'Maharashtra', type: 'city', coordinates: { lat: 19.1364, lng: 72.8296 } },
      { name: 'Bangalore - Koramangala', state: 'Karnataka', type: 'city', coordinates: { lat: 12.9352, lng: 77.6245 } },
      { name: 'Chennai - T. Nagar', state: 'Tamil Nadu', type: 'city', coordinates: { lat: 13.0418, lng: 80.2341 } },
      { name: 'Kolkata - Salt Lake', state: 'West Bengal', type: 'city', coordinates: { lat: 22.5726, lng: 88.4144 } }
    ];
    
    locations.forEach(loc => {
      const id = this.locationIdCounter++;
      const location: Location = { ...loc, id };
      this.locations.set(id, location);
    });
  }

  private initializeRepresentatives() {
    const representatives = [
      {
        name: 'Priya Sharma',
        position: 'Member of Parliament',
        party: 'Indian National Congress',
        location: { state: 'Delhi', city: 'New Delhi' },
        contactEmail: 'priya.sharma@parliament.gov.in',
        contactPhone: '+91-9876543210',
        bio: 'Representing Delhi for the past 8 years',
        avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857'
      },
      {
        name: 'Rajesh Patel',
        position: 'Municipal Councilor',
        party: 'Bharatiya Janata Party',
        location: { state: 'Delhi', city: 'New Delhi' },
        contactEmail: 'rajesh.patel@municipality.gov.in',
        contactPhone: '+91-9876543211',
        bio: 'Working on improving infrastructure',
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a'
      },
      {
        name: 'Anita Desai',
        position: 'District Magistrate',
        party: null,
        location: { state: 'Delhi', city: 'New Delhi' },
        contactEmail: 'anita.desai@gov.in',
        contactPhone: '+91-9876543212',
        bio: 'Civil servant with 15 years of experience',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'
      }
    ];
    
    representatives.forEach(rep => {
      const id = this.representativeIdCounter++;
      const representative: Representative = { ...rep, id };
      this.representatives.set(id, representative);
    });
  }

  private initializeBudgetData() {
    const budgets = [
      {
        title: 'Infrastructure Development',
        amount: 52000000, // ₹ 5.2 Cr
        category: 'Infrastructure',
        description: 'Road repair and construction, bridge maintenance',
        location: { state: 'Delhi', city: 'New Delhi' },
        fiscalYear: '2023-2024',
        status: 'in_progress'
      },
      {
        title: 'Healthcare Facilities',
        amount: 38000000, // ₹ 3.8 Cr
        category: 'Healthcare',
        description: 'Upgrading primary health centers and facilities',
        location: { state: 'Delhi', city: 'New Delhi' },
        fiscalYear: '2023-2024',
        status: 'allocated'
      },
      {
        title: 'Education Initiatives',
        amount: 21000000, // ₹ 2.1 Cr
        category: 'Education',
        description: 'School renovations and educational programs',
        location: { state: 'Delhi', city: 'New Delhi' },
        fiscalYear: '2023-2024',
        status: 'allocated'
      },
      {
        title: 'Water & Sanitation',
        amount: 16000000, // ₹ 1.6 Cr
        category: 'Water & Sanitation',
        description: 'Sewage treatment and clean water supply',
        location: { state: 'Delhi', city: 'New Delhi' },
        fiscalYear: '2023-2024',
        status: 'allocated'
      }
    ];
    
    budgets.forEach(budget => {
      const id = this.budgetIdCounter++;
      const now = new Date();
      const newBudget: Budget = { ...budget, id, createdAt: now, updatedAt: now };
      this.budgets.set(id, newBudget);
    });
  }
}

export const storage = new MemStorage();
