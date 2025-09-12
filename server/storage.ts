import { type User, type InsertUser, type QueueItem, type InsertQueueItem, type PaRequest, type InsertPaRequest, type EvRecord, type InsertEvRecord } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  
  // Queue Items
  getQueueItems(): Promise<QueueItem[]>;
  getQueueItem(id: string): Promise<QueueItem | undefined>;
  createQueueItem(item: InsertQueueItem): Promise<QueueItem>;
  updateQueueItem(id: string, item: Partial<QueueItem>): Promise<QueueItem | undefined>;
  
  // PA Requests
  getPaRequests(): Promise<PaRequest[]>;
  getPaRequest(id: string): Promise<PaRequest | undefined>;
  createPaRequest(request: InsertPaRequest): Promise<PaRequest>;
  updatePaRequest(id: string, request: Partial<PaRequest>): Promise<PaRequest | undefined>;
  
  // EV Records
  getEvRecords(): Promise<EvRecord[]>;
  getEvRecord(id: string): Promise<EvRecord | undefined>;
  createEvRecord(record: InsertEvRecord): Promise<EvRecord>;
  updateEvRecord(id: string, record: Partial<EvRecord>): Promise<EvRecord | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private queueItems: Map<string, QueueItem>;
  private paRequests: Map<string, PaRequest>;
  private evRecords: Map<string, EvRecord>;

  constructor() {
    this.users = new Map();
    this.queueItems = new Map();
    this.paRequests = new Map();
    this.evRecords = new Map();
    
    // Initialize with some default data
    this.initializeData();
  }

  private initializeData() {
    // Add default admin user
    const adminUser: User = {
      id: "1",
      username: "admin",
      email: "admin@mysage.com",
      password: "admin123", // In real app, this would be hashed
      firstName: "System",
      lastName: "Admin",
      phone: "(555) 000-0000",
      position: "System Administrator",
      role: "admin",
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username || user.email === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      lastLogin: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Queue Item methods
  async getQueueItems(): Promise<QueueItem[]> {
    return Array.from(this.queueItems.values());
  }

  async getQueueItem(id: string): Promise<QueueItem | undefined> {
    return this.queueItems.get(id);
  }

  async createQueueItem(insertItem: InsertQueueItem): Promise<QueueItem> {
    const id = randomUUID();
    const item: QueueItem = { 
      ...insertItem, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.queueItems.set(id, item);
    return item;
  }

  async updateQueueItem(id: string, itemData: Partial<QueueItem>): Promise<QueueItem | undefined> {
    const item = this.queueItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { 
      ...item, 
      ...itemData, 
      updatedAt: new Date() 
    };
    this.queueItems.set(id, updatedItem);
    return updatedItem;
  }

  // PA Request methods
  async getPaRequests(): Promise<PaRequest[]> {
    return Array.from(this.paRequests.values());
  }

  async getPaRequest(id: string): Promise<PaRequest | undefined> {
    return this.paRequests.get(id);
  }

  async createPaRequest(insertRequest: InsertPaRequest): Promise<PaRequest> {
    const id = randomUUID();
    const request: PaRequest = { 
      ...insertRequest, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.paRequests.set(id, request);
    return request;
  }

  async updatePaRequest(id: string, requestData: Partial<PaRequest>): Promise<PaRequest | undefined> {
    const request = this.paRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { 
      ...request, 
      ...requestData, 
      updatedAt: new Date() 
    };
    this.paRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  // EV Record methods
  async getEvRecords(): Promise<EvRecord[]> {
    return Array.from(this.evRecords.values());
  }

  async getEvRecord(id: string): Promise<EvRecord | undefined> {
    return this.evRecords.get(id);
  }

  async createEvRecord(insertRecord: InsertEvRecord): Promise<EvRecord> {
    const id = randomUUID();
    const record: EvRecord = { 
      ...insertRecord, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.evRecords.set(id, record);
    return record;
  }

  async updateEvRecord(id: string, recordData: Partial<EvRecord>): Promise<EvRecord | undefined> {
    const record = this.evRecords.get(id);
    if (!record) return undefined;
    
    const updatedRecord = { 
      ...record, 
      ...recordData, 
      updatedAt: new Date() 
    };
    this.evRecords.set(id, updatedRecord);
    return updatedRecord;
  }
}

export const storage = new MemStorage();
