import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  jobs: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        search: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return db.listJobs(input.limit, input.offset, input.search);
      }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const job = await db.getJobById(input);
        if (!job) throw new TRPCError({ code: "NOT_FOUND" });
        return job;
      }),

    getByCompany: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getJobsByCompany(input);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string(),
        companyId: z.number(),
        jobType: z.enum(["Full-time", "Part-time", "Contract", "Freelance"]),
        workMode: z.enum(["Remote", "On-site", "Hybrid"]),
        salaryMin: z.string().optional(),
        salaryMax: z.string().optional(),
        location: z.string().optional(),
        experienceLevel: z.enum(["Entry", "Mid", "Senior", "Lead"]).optional(),
        skills: z.array(z.string()).optional(),
        benefits: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "recruiter" && ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        return db.createJob({
          ...input,
          skills: input.skills ? JSON.stringify(input.skills) : null,
          benefits: input.benefits ? JSON.stringify(input.benefits) : null,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["Draft", "Active", "Closed", "Archived"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "recruiter" && ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const { id, ...data } = input;
        return db.updateJob(id, data);
      }),
  }),

  applications: router({
    list: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getApplicationsByUser(ctx.user!.id);
      }),

    getByJob: publicProcedure
      .input(z.number())
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "recruiter" && ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.getApplicationsByJob(input);
      }),

    getByCompany: protectedProcedure
      .input(z.number())
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "recruiter" && ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.getApplicationsByCompany(input);
      }),

    create: protectedProcedure
      .input(z.object({
        jobId: z.number(),
        companyId: z.number(),
        coverLetter: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const job = await db.getJobById(input.jobId);
        if (!job) throw new TRPCError({ code: "NOT_FOUND" });

        return db.createApplication({
          jobId: input.jobId,
          userId: ctx.user!.id,
          companyId: input.companyId,
          coverLetter: input.coverLetter,
          status: "Applied",
        });
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        applicationId: z.number(),
        status: z.enum(["Applied", "Screening", "Interview", "Offered", "Rejected", "Withdrawn"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "recruiter" && ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        return db.updateApplicationStatus(input.applicationId, input.status);
      }),
  }),

  profile: router({
    get: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getUserProfile(ctx.user!.id);
      }),

    update: protectedProcedure
      .input(z.object({
        headline: z.string().optional(),
        bio: z.string().optional(),
        phone: z.string().optional(),
        location: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.upsertUserProfile(ctx.user!.id, input);
      }),

    getSkills: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getUserSkills(ctx.user!.id);
      }),

    addSkill: protectedProcedure
      .input(z.string())
      .mutation(async ({ input, ctx }) => {
        return db.addSkill(ctx.user!.id, input);
      }),

    getExperiences: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getUserExperiences(ctx.user!.id);
      }),

    addExperience: protectedProcedure
      .input(z.object({
        title: z.string(),
        company: z.string(),
        description: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        isCurrent: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.addExperience({
          userId: ctx.user!.id,
          ...input,
        });
      }),

    getEducations: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getUserEducations(ctx.user!.id);
      }),

    addEducation: protectedProcedure
      .input(z.object({
        school: z.string(),
        degree: z.string(),
        field: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.addEducation({
          userId: ctx.user!.id,
          ...input,
        });
      }),
  }),

  companies: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return db.getCompanies(input.limit, input.offset);
      }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getCompanyById(input);
      }),

    getMine: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== "recruiter") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.getCompanyByOwnerId(ctx.user!.id);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        website: z.string().optional(),
        industry: z.string().optional(),
        size: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]).optional(),
        location: z.string().optional(),
        foundedYear: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "recruiter") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        return db.createCompany({
          ...input,
          ownerId: ctx.user!.id,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        website: z.string().optional(),
        industry: z.string().optional(),
        location: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "recruiter") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const { id, ...data } = input;
        return db.updateCompany(id, data);
      }),
  }),
});

export type AppRouter = typeof appRouter;
