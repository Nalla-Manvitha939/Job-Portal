import { eq, desc, and, like, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, jobs, applications, userProfiles, companies, skills, experiences, educations } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listJobs(limit: number = 20, offset: number = 0, searchQuery?: string) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(jobs.status, "Active")];
  if (searchQuery) {
    conditions.push(like(jobs.title, `%${searchQuery}%`));
  }

  return db.select().from(jobs).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(jobs.createdAt));
}

export async function getJobById(jobId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getJobsByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(jobs).where(eq(jobs.companyId, companyId)).orderBy(desc(jobs.createdAt));
}

export async function createApplication(data: typeof applications.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(applications).values(data);
  return result;
}

export async function getApplicationsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(applications).where(eq(applications.userId, userId)).orderBy(desc(applications.appliedAt));
}

export async function getApplicationsByJob(jobId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(applications).where(eq(applications.jobId, jobId)).orderBy(desc(applications.appliedAt));
}

export async function getApplicationsByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(applications).where(eq(applications.companyId, companyId)).orderBy(desc(applications.appliedAt));
}

export async function updateApplicationStatus(applicationId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(applications).set({ status: status as any }).where(eq(applications.id, applicationId));
}

export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertUserProfile(userId: number, data: Partial<typeof userProfiles.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserProfile(userId);
  if (existing) {
    return db.update(userProfiles).set(data).where(eq(userProfiles.userId, userId));
  } else {
    return db.insert(userProfiles).values({ userId, ...data });
  }
}

export async function getUserSkills(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(skills).where(eq(skills.userId, userId));
}

export async function addSkill(userId: number, skillName: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(skills).values({ userId, name: skillName });
}

export async function getUserExperiences(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(experiences).where(eq(experiences.userId, userId)).orderBy(desc(experiences.startDate));
}

export async function addExperience(data: typeof experiences.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(experiences).values(data);
}

export async function getUserEducations(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(educations).where(eq(educations.userId, userId)).orderBy(desc(educations.startDate));
}

export async function addEducation(data: typeof educations.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(educations).values(data);
}

export async function getCompanyById(companyId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCompanies(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(companies).limit(limit).offset(offset).orderBy(desc(companies.createdAt));
}

export async function getCompanyByOwnerId(ownerId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(companies).where(eq(companies.ownerId, ownerId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCompany(data: typeof companies.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(companies).values(data);
}

export async function updateCompany(companyId: number, data: Partial<typeof companies.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(companies).set(data).where(eq(companies.id, companyId));
}

export async function createJob(data: typeof jobs.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(jobs).values(data);
}

export async function updateJob(jobId: number, data: Partial<typeof jobs.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(jobs).set(data).where(eq(jobs.id, jobId));
}
