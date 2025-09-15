import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  position: text("position"),
  role: text("role").notNull(), // 'admin', 'staff', 'system_admin'
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const queueItems = pgTable("queue_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Basic patient info
  patientName: text("patient_name").notNull(),
  firstName: text("first_name"),
  middleName: text("middle_name"),
  lastName: text("last_name"),
  dateOfBirth: timestamp("date_of_birth"),
  patientId: text("patient_id"),
  accountNumber: text("account_number").notNull(),
  employer: text("employer"),
  activeStatus: boolean("active_status").default(true),
  
  // Contact information
  primaryPhone: text("primary_phone"),
  secondaryPhone: text("secondary_phone"),
  emailAddress: text("email_address"),
  emergencyContact: text("emergency_contact"),
  
  // Address information  
  addressLine1: text("address_line_1"),
  addressLine2: text("address_line_2"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  
  // Provider information
  provider: text("provider").notNull(),
  providerNpi: text("provider_npi"),
  providerLocation: text("provider_location"),
  providerCity: text("provider_city"),
  providerState: text("provider_state"),
  providerPhone: text("provider_phone"),
  
  // Queue/Program information
  portfolio: text("portfolio").notNull(), // ChiroHD, ChiroOne, etc.
  program: text("program").notNull(), // Authorization, Verification, etc.
  programDescription: text("program_description"),
  programFlash: text("program_flash"),
  queue: text("queue").notNull(), // Audit Required, Authorization, etc.
  disposition: text("disposition").notNull(), // EV Received, Pending Response, etc.
  
  // Basic insurance info
  insurance: text("insurance").notNull(),
  insuranceType: text("insurance_type").notNull(), // primary, secondary
  insurancePolicyNumber: text("insurance_policy_number"),
  
  // Extended insurance info
  insurancePlanName: text("insurance_plan_name"),
  networkStatus: text("network_status"),
  insuranceGroupNumber: text("insurance_group_number"),
  coverageStartDate: text("coverage_start_date"),
  coverageEndDate: text("coverage_end_date"),
  annualDeductible: text("annual_deductible"),
  deductibleMet: text("deductible_met"),
  coverageDetails: text("coverage_details"),
  
  // Cardholder info
  primaryCardholderName: text("primary_cardholder_name"),
  cardholderRelationship: text("cardholder_relationship"),
  cardholderDateOfBirth: text("cardholder_date_of_birth"),
  employerPlanSponsor: text("employer_plan_sponsor"),
  
  // Benefits and authorization
  officeVisitCopay: text("office_visit_copay"),
  specialistCopay: text("specialist_copay"),
  priorAuthRequired: text("prior_auth_required"),
  referralRequired: text("referral_required"),
  benefitNotes: text("benefit_notes"),
  
  // Secondary insurance
  secondaryInsurance: text("secondary_insurance"),
  secondaryPolicyNumber: text("secondary_policy_number"),
  coordinationOfBenefits: text("coordination_of_benefits"),
  secondaryCoverageType: text("secondary_coverage_type"),
  
  // Status and tracking
  status: text("status").notNull(), // pending, completed, denied
  priority: text("priority"), // Urgent, Normal, etc.
  urgencyHours: integer("urgency_hours"),
  requestedDate: timestamp("requested_date").notNull(),
  assignedTo: varchar("assigned_to").references(() => users.id),
  
  // Address objects as JSON
  homeAddress: json("home_address"), // Home address object {street, city, state, zipCode}
  mailingAddress: json("mailing_address"), // Mailing address object {street, city, state, zipCode}
  
  // Complex data as JSON
  insuranceDetails: json("insurance_details"), // Full insurance company info, cardholder details, coverage
  programInfo: json("program_info"), // ICD codes, program enrollment details
  evData: json("ev_data"), // EV verification data, coverage details, deductibles
  paData: json("pa_data"), // PA authorization data, approval details
  providerDetails: json("provider_details"), // Full provider info, contact details, validation
  records: json("records"), // Historical record entries with timestamps
  notes: json("notes"), // Note entries with timestamps and user attribution
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const paRequests = pgTable("pa_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientName: text("patient_name").notNull(),
  accountNumber: text("account_number").notNull(),
  payer: text("payer").notNull(),
  submittedDate: timestamp("submitted_date").notNull(),
  status: text("status").notNull(), // submitted, pending, approved, denied
  denialReason: text("denial_reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const evRecords = pgTable("ev_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientName: text("patient_name").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  visitDate: timestamp("visit_date").notNull(),
  provider: text("provider").notNull(),
  visitType: text("visit_type").notNull(),
  status: text("status").notNull(), // scheduled, completed, missed, pending_verification
  verificationStatus: text("verification_status"), // verified, pending, not_required
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for complex JSON data structures
export const addressSchema = z.object({
  line1: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
});

export const homeAddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

export const mailingAddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

export const insuranceDetailsSchema = z.object({
  companyName: z.string().optional(),
  planType: z.string().optional(),
  effectiveDate: z.string().optional(),
  expiresDate: z.string().optional(),
  policyId: z.string().optional(),
  groupId: z.string().optional(),
  payerId: z.string().optional(),
  phone: z.string().optional(),
  processor: z.string().optional(),
  insuranceType: z.string().optional(), // Commercial, etc.
  policyType: z.string().optional(), // PPO, etc.
  priority: z.string().optional(), // Primary, Secondary
  benefitCycle: z.string().optional(), // Yearly, etc.
  cardholder: z.object({
    relationship: z.string().optional(), // Self, Spouse, etc.
    dateOfBirth: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }).optional(),
  coverage: z.object({
    preExistingConditions: z.boolean().optional(),
    referralRequired: z.boolean().optional(),
    policyActive: z.boolean().optional(),
    coordinationOfBenefitsUpdated: z.boolean().optional(),
    contactForPriorAuth: z.string().optional(),
    individualDeductible: z.object({
      amount: z.number().optional(),
      met: z.number().optional(),
      remaining: z.number().optional(),
    }).optional(),
    familyDeductible: z.object({
      amount: z.number().optional(),
      met: z.number().optional(),
      remaining: z.number().optional(),
    }).optional(),
    individualOutOfPocket: z.object({
      amount: z.number().optional(),
      met: z.number().optional(),
      remaining: z.number().optional(),
    }).optional(),
    familyOutOfPocket: z.object({
      amount: z.number().optional(),
      met: z.number().optional(),
      remaining: z.number().optional(),
    }).optional(),
    outOfPocketMaxIncludesDeductible: z.boolean().optional(),
    deductibleFirstCarryover: z.boolean().optional(),
    onlyOneCopayLayered: z.boolean().optional(),
  }).optional(),
});

export const icdCodeSchema = z.object({
  code: z.string(),
  description: z.string(),
});

export const programInfoSchema = z.object({
  description: z.string().optional(),
  flash: z.string().optional(),
  enrollmentDate: z.string().optional(),
  eligibilityStatus: z.string().optional(),
  coverageDetails: z.string().optional(),
  icdCodes: z.array(icdCodeSchema).optional(),
  enrollments: z.array(z.object({
    programName: z.string(),
    location: z.string().optional(),
    startedOn: z.string().optional(),
    dueDate: z.string().optional(),
    lastTouchDate: z.string().optional(),
    insuranceType: z.string().optional(),
    status: z.string().optional(),
    eligibilityStatus: z.string().optional(),
    coverageDetails: z.string().optional(),
    queue: z.string().optional(),
    disposition: z.string().optional(),
  })).optional(),
});

export const priorAuthSchema = z.object({
  authorizationNumber: z.string().optional(),
  status: z.string().optional(),
  dateRangeFrom: z.string().optional(),
  dateRangeTo: z.string().optional(),
  visitsApproved: z.number().optional(),
  box14: z.string().optional(),
  dx1: z.string().optional(),
  dx2: z.string().optional(),
  qa: z.string().optional(),
  notes: z.string().optional(),
});

export const evDataSchema = z.object({
  actionSummary: z.object({
    queue: z.string().optional(),
    disposition: z.string().optional(),
    lastTask: z.string().optional(),
    lastResult: z.string().optional(),
    dueDate: z.string().optional(),
    provider: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
  agentName: z.string().optional(),
  referenceNumber: z.string().optional(),
  verificationType: z.string().optional(),
  pofOnFile: z.string().optional(),
  priorAuth: priorAuthSchema.optional(),
});

export const paDataSchema = z.object({
  actionSummary: z.object({
    queue: z.string().optional(),
    disposition: z.string().optional(),
    lastTask: z.string().optional(),
    lastResult: z.string().optional(),
    dueDate: z.string().optional(),
    provider: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
  agentName: z.string().optional(),
  referenceNumber: z.string().optional(),
  verificationType: z.string().optional(),
  pofOnFile: z.string().optional(),
  priorAuth: priorAuthSchema.optional(),
  priorAuthNotes: z.string().optional(),
});

export const providerDetailsSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  npi: z.string().optional(),
  dea: z.string().optional(),
  address: addressSchema.optional(),
  phone: z.string().optional(),
  phone2: z.string().optional(),
  fax: z.string().optional(),
  fax2: z.string().optional(),
  email1: z.string().optional(),
  email2: z.string().optional(),
  bcbsTier: z.string().optional(),
  specialty: z.string().optional(),
  railroadMedicarePtan: z.string().optional(),
  medicareGroupPtan: z.string().optional(),
  medicareIndividualPtan: z.string().optional(),
  medicareCme: z.string().optional(),
  medicaid: z.string().optional(),
  status: z.string().optional(),
  taxonomy: z.string().optional(),
  effectiveDate: z.string().optional(),
  expiresDate: z.string().optional(),
  providerValidated: z.boolean().optional(),
});

export const recordEntrySchema = z.object({
  id: z.string(),
  disposition: z.string(),
  queue: z.string(),
  date: z.string(),
  program: z.string(),
  completed: z.string().optional(),
  result: z.string().optional(),
  profileType: z.string().optional(),
  notes: z.string().optional(),
  user: z.string(),
  timestamp: z.string(),
});

export const noteEntrySchema = z.object({
  id: z.string(),
  content: z.string(),
  user: z.string(),
  timestamp: z.string(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const insertQueueItemSchema = createInsertSchema(queueItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  homeAddress: homeAddressSchema.optional(),
  mailingAddress: mailingAddressSchema.optional(),
  insuranceDetails: insuranceDetailsSchema.optional(),
  programInfo: programInfoSchema.optional(),
  evData: evDataSchema.optional(),
  paData: paDataSchema.optional(),
  providerDetails: providerDetailsSchema.optional(),
  records: z.array(recordEntrySchema).optional(),
  notes: z.array(noteEntrySchema).optional(),
});

export const insertPaRequestSchema = createInsertSchema(paRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEvRecordSchema = createInsertSchema(evRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type QueueItem = typeof queueItems.$inferSelect;
export type InsertQueueItem = z.infer<typeof insertQueueItemSchema>;
export type PaRequest = typeof paRequests.$inferSelect;
export type InsertPaRequest = z.infer<typeof insertPaRequestSchema>;
export type EvRecord = typeof evRecords.$inferSelect;
export type InsertEvRecord = z.infer<typeof insertEvRecordSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;

// Complex data types
export type Address = z.infer<typeof addressSchema>;
export type InsuranceDetails = z.infer<typeof insuranceDetailsSchema>;
export type IcdCode = z.infer<typeof icdCodeSchema>;
export type ProgramInfo = z.infer<typeof programInfoSchema>;
export type PriorAuth = z.infer<typeof priorAuthSchema>;
export type EvData = z.infer<typeof evDataSchema>;
export type PaData = z.infer<typeof paDataSchema>;
export type ProviderDetails = z.infer<typeof providerDetailsSchema>;
export type RecordEntry = z.infer<typeof recordEntrySchema>;
export type NoteEntry = z.infer<typeof noteEntrySchema>;
