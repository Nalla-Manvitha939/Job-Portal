import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, longtext } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";


export const users = mysqlTable("users", {
  
  id: int("id").autoincrement().primaryKey(),
  
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "recruiter", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;


export const userProfiles = mysqlTable("userProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  headline: varchar("headline", { length: 255 }),
  bio: longtext("bio"),
  phone: varchar("phone", { length: 20 }),
  location: varchar("location", { length: 255 }),
  resumeUrl: varchar("resumeUrl", { length: 512 }),
  resumeKey: varchar("resumeKey", { length: 255 }),
  profileCompleteness: int("profileCompleteness").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;


export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: longtext("description"),
  website: varchar("website", { length: 512 }),
  logoUrl: varchar("logoUrl", { length: 512 }),
  logoKey: varchar("logoKey", { length: 255 }),
  industry: varchar("industry", { length: 100 }),
  size: mysqlEnum("size", ["1-10", "11-50", "51-200", "201-500", "500+"]),
  location: varchar("location", { length: 255 }),
  foundedYear: int("foundedYear"),
  ownerId: int("ownerId").notNull(),
  isVerified: boolean("isVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;


export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: longtext("description").notNull(),
  companyId: int("companyId").notNull(),
  jobType: mysqlEnum("jobType", ["Full-time", "Part-time", "Contract", "Freelance"]).notNull(),
  workMode: mysqlEnum("workMode", ["Remote", "On-site", "Hybrid"]).notNull(),
  salaryMin: decimal("salaryMin", { precision: 10, scale: 2 }),
  salaryMax: decimal("salaryMax", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("USD"),
  location: varchar("location", { length: 255 }),
  experienceLevel: mysqlEnum("experienceLevel", ["Entry", "Mid", "Senior", "Lead"]),
  skills: longtext("skills"), 
  benefits: longtext("benefits"), 
  status: mysqlEnum("status", ["Draft", "Active", "Closed", "Archived"]).default("Active"),
  applicationsCount: int("applicationsCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;


export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  userId: int("userId").notNull(),
  companyId: int("companyId").notNull(),
  status: mysqlEnum("status", ["Applied", "Screening", "Interview", "Offered", "Rejected", "Withdrawn"]).default("Applied"),
  coverLetter: longtext("coverLetter"),
  resumeUrl: varchar("resumeUrl", { length: 512 }),
  resumeKey: varchar("resumeKey", { length: 255 }),
  rating: int("rating"), 
  feedback: longtext("feedback"),
  appliedAt: timestamp("appliedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;


export const savedJobs = mysqlTable("savedJobs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  jobId: int("jobId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedJob = typeof savedJobs.$inferSelect;
export type InsertSavedJob = typeof savedJobs.$inferInsert;


export const skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  endorsements: int("endorsements").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;


export const experiences = mysqlTable("experiences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  description: longtext("description"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  isCurrent: boolean("isCurrent").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = typeof experiences.$inferInsert;


export const educations = mysqlTable("educations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  school: varchar("school", { length: 255 }).notNull(),
  degree: varchar("degree", { length: 255 }).notNull(),
  field: varchar("field", { length: 255 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Education = typeof educations.$inferSelect;
export type InsertEducation = typeof educations.$inferInsert;


export const interviews = mysqlTable("interviews", {
  id: int("id").autoincrement().primaryKey(),
  applicationId: int("applicationId").notNull(),
  jobId: int("jobId").notNull(),
  userId: int("userId").notNull(),
  companyId: int("companyId").notNull(),
  scheduledAt: timestamp("scheduledAt"),
  interviewType: mysqlEnum("interviewType", ["Phone", "Video", "In-person", "Assessment"]),
  notes: longtext("notes"),
  feedback: longtext("feedback"),
  status: mysqlEnum("status", ["Scheduled", "Completed", "Cancelled"]).default("Scheduled"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Interview = typeof interviews.$inferSelect;
export type InsertInterview = typeof interviews.$inferInsert;


export const usersRelations = relations(users, ({ many, one }) => ({
  userProfile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  applications: many(applications),
  savedJobs: many(savedJobs),
  skills: many(skills),
  experiences: many(experiences),
  educations: many(educations),
  interviews: many(interviews),
  companiesOwned: many(companies),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  owner: one(users, {
    fields: [companies.ownerId],
    references: [users.id],
  }),
  jobs: many(jobs),
  applications: many(applications),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
  applications: many(applications),
  savedJobs: many(savedJobs),
  interviews: many(interviews),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  user: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
  company: one(companies, {
    fields: [applications.companyId],
    references: [companies.id],
  }),
  interviews: many(interviews),
}));

export const savedJobsRelations = relations(savedJobs, ({ one }) => ({
  user: one(users, {
    fields: [savedJobs.userId],
    references: [users.id],
  }),
  job: one(jobs, {
    fields: [savedJobs.jobId],
    references: [jobs.id],
  }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, {
    fields: [skills.userId],
    references: [users.id],
  }),
}));

export const experiencesRelations = relations(experiences, ({ one }) => ({
  user: one(users, {
    fields: [experiences.userId],
    references: [users.id],
  }),
}));

export const educationsRelations = relations(educations, ({ one }) => ({
  user: one(users, {
    fields: [educations.userId],
    references: [users.id],
  }),
}));

export const interviewsRelations = relations(interviews, ({ one }) => ({
  application: one(applications, {
    fields: [interviews.applicationId],
    references: [applications.id],
  }),
  job: one(jobs, {
    fields: [interviews.jobId],
    references: [jobs.id],
  }),
  user: one(users, {
    fields: [interviews.userId],
    references: [users.id],
  }),
  company: one(companies, {
    fields: [interviews.companyId],
    references: [companies.id],
  }),
}));
