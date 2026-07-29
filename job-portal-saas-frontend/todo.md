# Job Portal SaaS Platform - TODO

## Design System & Setup
- [x] Configure global design tokens (colors, typography, spacing, shadows)
- [x] Set up dark/light theme support
- [x] Configure Tailwind CSS with glassmorphism and premium styling
- [x] Create reusable component library (buttons, cards, badges, etc.)

## Public Pages
- [x] Home page - Hero section with search bar
- [x] Home page - Featured jobs section
- [x] Home page - Top companies section
- [x] Home page - Categories section
- [x] Home page - Statistics section
- [x] Home page - How it works section
- [x] Home page - CTA section
- [x] Home page - Footer

## Authentication Module
- [x] User login page
- [x] User registration page
- [ ] Recruiter login page
- [ ] Admin login page
- [ ] Forgot password flow
- [ ] Password reset functionality
- [x] Social login UI

## User Module (Job Seeker)
- [x] User dashboard with activity cards
- [x] Dashboard charts (applications per month, status distribution)
- [x] Browse jobs page with filters and search
- [x] Job details page
- [x] Apply job page with form
- [x] My applications page with status tracking
- [x] User profile page with personal information
- [x] User profile page with professional information
- [x] Resume upload functionality
- [x] Edit profile functionality

## Recruiter Module
- [x] Recruiter dashboard with hiring metrics
- [x] Dashboard charts (hiring trend, monthly applications)
- [ ] Company profile management
- [ ] Post job form
- [ ] Manage jobs page with table
- [ ] Edit job page
- [ ] Applicants page with table
- [ ] Applicant profile modal
- [ ] Applicant actions (shortlist, reject, schedule interview, hire)

## Admin Module
- [x] Admin dashboard with system overview
- [x] Dashboard charts (registrations, jobs posted, applications trend)
- [ ] Admin sidebar navigation
- [ ] Users management table
- [ ] Companies management table
- [ ] Jobs management table
- [ ] Applicants management table
- [ ] Reports section with export functionality
- [ ] Analytics dashboard with KPIs

## Shared Components & Features
- [ ] Navbar with theme toggle
- [ ] Sticky navigation
- [ ] Sidebar navigation (for dashboards)
- [ ] Breadcrumb navigation
- [ ] Profile dropdown menu
- [ ] Search functionality
- [ ] Filtering system
- [ ] Sorting system
- [ ] Pagination
- [ ] Loading skeletons
- [ ] Empty states
- [ ] Error states
- [ ] Success/Error alerts
- [ ] Toast notifications
- [ ] Modal dialogs
- [ ] Confirmation dialogs
- [ ] Status badges
- [ ] Responsive tables
- [ ] Data cards
- [ ] Tooltips
- [ ] File upload components
- [ ] Resume viewer
- [ ] Statistics cards
- [ ] Charts (line, bar, pie)

## Database Schema
- [x] Create users table (extend existing)
- [x] Create companies table
- [x] Create jobs table
- [x] Create applications table
- [x] Create user profiles table
- [x] Create company profiles table
- [x] Create interviews table
- [ ] Create notifications table

## Backend API (tRPC Procedures)
- [x] Auth procedures (login, register, logout, me)
- [x] User procedures (get profile, update profile, upload resume)
- [x] Job procedures (list jobs, get job details, search jobs)
- [x] Application procedures (create, list, update status, withdraw)
- [x] Company procedures (get, update, list)
- [x] Recruiter procedures (post job, manage jobs, view applicants)
- [ ] Admin procedures (manage users, companies, jobs, applicants)

## Testing & Polish
- [ ] Write vitest tests for critical procedures
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Test dark/light theme switching
- [ ] Test form validation
- [ ] Test error handling
- [ ] Add smooth animations and transitions
- [ ] Optimize performance
- [ ] Test accessibility

## Deployment
- [ ] Create checkpoint before publishing
- [ ] Publish to production
