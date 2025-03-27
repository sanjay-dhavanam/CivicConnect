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
    this.initializeParliamentarySpeeches();
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
  async createOTP(otpData: { phone: string; otp: string; expiresAt: Date; verified?: boolean }): Promise<OTP> {
    const id = this.otpIdCounter++;
    const now = new Date();
    
    const newOTP: OTP = { 
      id,
      phone: otpData.phone,
      otp: otpData.otp,
      expiresAt: otpData.expiresAt,
      verified: otpData.verified || false,
      createdAt: now
    };
    
    console.log(`Creating OTP with ID ${id}: ${JSON.stringify({...newOTP, expiresAt: newOTP.expiresAt.toISOString()})}`);
    this.otps.set(id, newOTP);
    return newOTP;
  }

  async verifyOTP(phone: string, otpCode: string): Promise<boolean> {
    const now = new Date();
    console.log(`Storage: Verifying OTP for phone ${phone}, code ${otpCode}, current time: ${now.toISOString()}`);
    
    // Get all OTPs for this phone number
    const otpsForPhone = Array.from(this.otps.values()).filter(otp => otp.phone === phone);
    console.log(`Found ${otpsForPhone.length} OTPs for phone ${phone}`);
    
    // Find the valid OTP
    const otp = otpsForPhone.find(otp => {
      const isMatch = otp.otp === otpCode;
      const isNotExpired = otp.expiresAt > now;
      const isNotVerified = !otp.verified;
      
      console.log(`OTP ID ${otp.id}: Match=${isMatch}, NotExpired=${isNotExpired} (expires: ${otp.expiresAt.toISOString()}), NotVerified=${isNotVerified}`);
      
      return isMatch && isNotExpired && isNotVerified;
    });
    
    if (otp) {
      // Mark OTP as verified
      const verifiedOTP = { ...otp, verified: true };
      this.otps.set(otp.id, verifiedOTP);
      console.log(`OTP ${otpCode} verified successfully for ${phone}`);
      return true;
    }
    
    console.log(`OTP ${otpCode} verification failed for ${phone}`);
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

  private initializeParliamentarySpeeches() {
    const speeches = [
      {
        title: 'Agricultural Reform Bill Debate',
        content: 'मैं आज जो बिल पेश कर रहा हूँ, वह हमारे किसानों के लिए एक नया अध्याय खोलेगा। यह सुधार किसानों को अपनी उपज बेचने की आजादी देगा और उनकी आय को दोगुना करने में मदद करेगा। हम चाहते हैं कि हमारे अन्नदाता आत्मनिर्भर और समृद्ध हों।',
        originalLanguage: 'hindi',
        translations: {},
        speakerId: 1,
        date: new Date('2023-07-15'),
        house: 'Lok Sabha'
      },
      {
        title: 'Discussion on Education Policy',
        content: 'शिक्षा नीति का यह नया प्रारूप भारत को वैश्विक ज्ञान महाशक्ति बनाने की दिशा में एक महत्वपूर्ण कदम है। हमें अपने छात्रों को भविष्य के लिए तैयार करना होगा और उन्हें विश्व स्तर पर प्रतिस्पर्धी बनाना होगा।',
        originalLanguage: 'hindi',
        translations: {},
        speakerId: 1,
        date: new Date('2023-08-20'),
        house: 'Lok Sabha'
      },
      {
        title: 'Healthcare System Reforms',
        content: 'इस बजट में स्वास्थ्य सेवा पर विशेष ध्यान दिया गया है। हमने ग्रामीण क्षेत्रों में स्वास्थ्य केंद्रों की संख्या बढ़ाने का प्रस्ताव रखा है और आयुष्मान भारत योजना का विस्तार किया है ताकि अधिक से अधिक नागरिकों को गुणवत्तापूर्ण स्वास्थ्य सेवाएँ मिल सकें।',
        originalLanguage: 'hindi',
        translations: {},
        speakerId: 2,
        date: new Date('2023-09-05'),
        house: 'Rajya Sabha'
      },
      {
        title: 'National Security Discussion',
        content: 'नमस्कार, आज मैं राष्ट्रीय सुरक्षा के महत्वपूर्ण मुद्दों पर चर्चा करना चाहता हूँ। हमारे सशस्त्र बलों ने हमेशा देश की सीमाओं की रक्षा में अद्भुत साहस और समर्पण दिखाया है। हमें अपनी सुरक्षा नीतियों को और मजबूत करने की आवश्यकता है।',
        originalLanguage: 'hindi',
        translations: {},
        speakerId: 2,
        date: new Date('2023-09-15'),
        house: 'Rajya Sabha'
      },
      {
        title: 'Environmental Protection Measures',
        content: 'পরিবেশ সংরক্ষণ আমাদের জন্য একটি গুরুত্বপূর্ণ বিষয়। আমাদের প্রাকৃতিক সম্পদ সংরক্ষণের জন্য এবং আমাদের গ্রহের ভবিষ্যত রক্ষার জন্য সমন্বিত পদক্ষেপ গ্রহণ করা দরকার। জলবায়ু পরিবর্তনের বিরুদ্ধে লড়াইয়ে ভারত একটি গুরুত্বপূর্ণ ভূমিকা পালন করবে।',
        originalLanguage: 'bengali',
        translations: {},
        speakerId: 3,
        date: new Date('2023-10-10'),
        house: 'Lok Sabha'
      },
      {
        title: 'Women Empowerment Initiatives',
        content: 'மகளிர் மேம்பாடு இன்றி நாட்டின் முழுமையான வளர்ச்சி சாத்தியமில்லை. நாம் பெண்களுக்கு அதிகாரம் அளிக்க வேண்டும், அவர்களுக்கு சம வாய்ப்புகளை உறுதி செய்ய வேண்டும், மேலும் அவர்கள் நமது சமூகத்தில் முழு பங்களிப்பைச் செய்ய வேண்டும்.',
        originalLanguage: 'tamil',
        translations: {},
        speakerId: 3,
        date: new Date('2023-10-25'),
        house: 'Rajya Sabha'
      }
    ];
    
    speeches.forEach(speech => {
      const id = this.speechIdCounter++;
      const newSpeech: ParliamentarySpeech = { ...speech, id };
      this.parliamentarySpeeches.set(id, newSpeech);
    });
  }
}

export const storage = new MemStorage();
