CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`userId` int NOT NULL,
	`companyId` int NOT NULL,
	`status` enum('Applied','Screening','Interview','Offered','Rejected','Withdrawn') DEFAULT 'Applied',
	`coverLetter` longtext,
	`resumeUrl` varchar(512),
	`resumeKey` varchar(255),
	`rating` int,
	`feedback` longtext,
	`appliedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` longtext,
	`website` varchar(512),
	`logoUrl` varchar(512),
	`logoKey` varchar(255),
	`industry` varchar(100),
	`size` enum('1-10','11-50','51-200','201-500','500+'),
	`location` varchar(255),
	`foundedYear` int,
	`ownerId` int NOT NULL,
	`isVerified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`)
);
CREATE TABLE `educations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`school` varchar(255) NOT NULL,
	`degree` varchar(255) NOT NULL,
	`field` varchar(255),
	`startDate` timestamp,
	`endDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `educations_id` PRIMARY KEY(`id`)
);
CREATE TABLE `experiences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`company` varchar(255) NOT NULL,
	`description` longtext,
	`startDate` timestamp,
	`endDate` timestamp,
	`isCurrent` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `experiences_id` PRIMARY KEY(`id`)
);
CREATE TABLE `interviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int NOT NULL,
	`jobId` int NOT NULL,
	`userId` int NOT NULL,
	`companyId` int NOT NULL,
	`scheduledAt` timestamp,
	`interviewType` enum('Phone','Video','In-person','Assessment'),
	`notes` longtext,
	`feedback` longtext,
	`status` enum('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `interviews_id` PRIMARY KEY(`id`)
);
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` longtext NOT NULL,
	`companyId` int NOT NULL,
	`jobType` enum('Full-time','Part-time','Contract','Freelance') NOT NULL,
	`workMode` enum('Remote','On-site','Hybrid') NOT NULL,
	`salaryMin` decimal(10,2),
	`salaryMax` decimal(10,2),
	`currency` varchar(3) DEFAULT 'USD',
	`location` varchar(255),
	`experienceLevel` enum('Entry','Mid','Senior','Lead'),
	`skills` longtext,
	`benefits` longtext,
	`status` enum('Draft','Active','Closed','Archived') DEFAULT 'Active',
	`applicationsCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
CREATE TABLE `savedJobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`jobId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `savedJobs_id` PRIMARY KEY(`id`)
);
CREATE TABLE `skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`endorsements` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `skills_id` PRIMARY KEY(`id`)
);
CREATE TABLE `userProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`headline` varchar(255),
	`bio` longtext,
	`phone` varchar(20),
	`location` varchar(255),
	`resumeUrl` varchar(512),
	`resumeKey` varchar(255),
	`profileCompleteness` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userProfiles_id` PRIMARY KEY(`id`)
);
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','recruiter','admin') NOT NULL DEFAULT 'user';