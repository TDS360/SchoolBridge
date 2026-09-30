import {
  Apple,
  BookOpen,
  BriefcaseBusiness,
  Bus,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Laptop,
  Lightbulb,
  PackageOpen,
  type LucideIcon,
} from "lucide-react";

export type StudentLevel = "middle" | "high" | "college";

export type SupportCategory = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  tone: "green" | "coral" | "yellow" | "blue";
};

export type MatchResource = {
  id: string;
  name: string;
  provider: string;
  score: number;
  category: string;
  summary: string;
  tags: string[];
  distance: string;
  schedule: string;
  mode: "In person" | "Online" | "Hybrid";
  verified: string;
  parentNote?: string;
  deadline?: string;
};

export const levelLabels: Record<StudentLevel, string> = {
  middle: "Middle school",
  high: "High school",
  college: "Community college",
};

const shared = {
  food: { id: "food", label: "Food & meals", shortLabel: "Food", description: "Meals, groceries, and food pantries", icon: Apple, tone: "coral" as const },
  transport: { id: "transport", label: "Transportation", shortLabel: "Rides", description: "Bus passes, rides, and travel help", icon: Bus, tone: "blue" as const },
  community: { id: "community", label: "Community support", shortLabel: "Support", description: "Trusted local and family support", icon: HandHeart, tone: "green" as const },
};

export const categoriesByLevel: Record<StudentLevel, SupportCategory[]> = {
  middle: [
    { id: "academic", label: "Homework & tutoring", shortLabel: "Homework", description: "Help with classwork and tough subjects", icon: BookOpen, tone: "green" },
    shared.food,
    { id: "supplies", label: "School supplies", shortLabel: "Supplies", description: "Backpacks, notebooks, and class materials", icon: PackageOpen, tone: "yellow" },
    { id: "technology", label: "Devices & internet", shortLabel: "Technology", description: "Laptops, hotspots, and computer access", icon: Laptop, tone: "blue" },
    shared.transport,
    { id: "programs", label: "After-school programs", shortLabel: "Programs", description: "Clubs, activities, and enrichment", icon: Lightbulb, tone: "coral" },
    { id: "mentoring", label: "Mentoring", shortLabel: "Mentoring", description: "A trusted adult to learn and grow with", icon: HeartPulse, tone: "green" },
    shared.community,
  ],
  high: [
    { id: "academic", label: "Tutoring & test prep", shortLabel: "Academic", description: "Subject help, SAT, ACT, and study support", icon: BookOpen, tone: "green" },
    shared.food,
    { id: "supplies", label: "School supplies", shortLabel: "Supplies", description: "Class, project, and testing materials", icon: PackageOpen, tone: "yellow" },
    { id: "technology", label: "Devices & internet", shortLabel: "Technology", description: "Chromebooks, laptops, and hotspots", icon: Laptop, tone: "blue" },
    shared.transport,
    { id: "scholarships", label: "Scholarships", shortLabel: "Scholarships", description: "Awards, deadlines, and application help", icon: GraduationCap, tone: "yellow" },
    { id: "programs", label: "College & career", shortLabel: "Programs", description: "Internships, mentoring, and college access", icon: BriefcaseBusiness, tone: "coral" },
    shared.community,
  ],
  college: [
    { id: "academic", label: "Course tutoring", shortLabel: "Tutoring", description: "Coursework, writing, and study support", icon: BookOpen, tone: "green" },
    { ...shared.food, label: "Food & basic needs", description: "Campus pantries, meals, and emergency support" },
    { id: "supplies", label: "Textbooks & supplies", shortLabel: "Textbooks", description: "Books, lab materials, and class supplies", icon: PackageOpen, tone: "yellow" },
    { id: "technology", label: "Laptop & internet", shortLabel: "Technology", description: "Loaner laptops, hotspots, and computer labs", icon: Laptop, tone: "blue" },
    { ...shared.transport, description: "Transit passes and campus transportation" },
    { id: "scholarships", label: "Grants & scholarships", shortLabel: "Financial aid", description: "Emergency grants, aid, and scholarships", icon: GraduationCap, tone: "yellow" },
    { id: "programs", label: "Career & transfer help", shortLabel: "Career", description: "Jobs, internships, advising, and transfer planning", icon: BriefcaseBusiness, tone: "coral" },
    { id: "wellbeing", label: "Childcare & wellbeing", shortLabel: "Wellbeing", description: "Childcare, counseling, and community care", icon: HeartPulse, tone: "green" },
  ],
};

export const prompts: Record<StudentLevel, string> = {
  middle: "I need help with math after school, and my parent can't drive me.",
  high: "I need free chemistry tutoring after 5 PM and I take the bus.",
  college: "I need evening accounting tutoring and help getting a laptop.",
};

export const constraintsFor = (needs: string[]) => {
  const base = ["Free only", "After school / evening", "Online options", "Accessibility needs"];
  if (needs.includes("transport")) base.splice(3, 0, "Public transportation");
  if (needs.includes("food")) base.push("No documents required");
  if (needs.includes("academic")) base.push("One-on-one support");
  if (needs.includes("technology")) base.push("Device to take home");
  return base;
};

export const matchesByLevel: Record<StudentLevel, MatchResource[]> = {
  middle: [
    { id: "library-homework", name: "Homework Lab at Greenfield Library", provider: "Greenfield Public Library", score: 97, category: "academic", summary: "Friendly homework help from screened tutors for grades 6–8.", tags: ["Free", "Grades 6–8", "After school", "Bus accessible"], distance: "1.2 miles", schedule: "Mon–Thu, 3:30–6 PM", mode: "In person", verified: "Verified 2 days ago", parentNote: "A parent or guardian signs the first-visit form." },
    { id: "bright-path", name: "Bright Path Online Tutoring", provider: "Bright Path Youth", score: 92, category: "academic", summary: "Small online study groups with math and science mentors.", tags: ["Free", "Online", "No travel", "Grades 6–9"], distance: "Online", schedule: "Weekdays, 4–8 PM", mode: "Online", verified: "Verified this week", parentNote: "Guardian consent is required to register." },
    { id: "school-supply-hub", name: "Student Supply Hub", provider: "Neighborhood Family Center", score: 86, category: "supplies", summary: "Free notebooks, backpacks, calculators, and art supplies.", tags: ["Free", "Walk-in", "Family welcome"], distance: "2.4 miles", schedule: "Sat, 10 AM–2 PM", mode: "In person", verified: "Verified today" },
  ],
  high: [
    { id: "chemistry-library", name: "Free Chemistry Tutoring", provider: "County Library", score: 96, category: "academic", summary: "Drop-in chemistry support led by local college tutors.", tags: ["Chemistry", "Free", "After 5 PM", "Bus accessible"], distance: "3.1 miles", schedule: "Mon–Wed, 5–7 PM", mode: "In person", verified: "Verified yesterday" },
    { id: "future-forward", name: "Future Forward College Lab", provider: "City Youth Collaborative", score: 91, category: "programs", summary: "Application, essay, FAFSA, and career planning support.", tags: ["Free", "Grades 10–12", "Evenings", "Mentors"], distance: "2.7 miles", schedule: "Tue & Thu, 4–7 PM", mode: "Hybrid", verified: "Verified this week", deadline: "Fall cohort closes Oct 18" },
    { id: "stem-online", name: "STEM Study Room", provider: "Open Learning Network", score: 88, category: "academic", summary: "Live online tutoring in chemistry, algebra, and physics.", tags: ["Free", "Online", "Evenings", "Drop-in"], distance: "Online", schedule: "Daily, 4–9 PM", mode: "Online", verified: "Verified 3 days ago" },
    { id: "transit-pass", name: "Student Transit Pass", provider: "Metro Access", score: 84, category: "transport", summary: "Reduced-fare monthly bus passes for enrolled students.", tags: ["Low cost", "Grades 9–12", "All routes"], distance: "0.8 miles", schedule: "Mon–Fri, 8 AM–5 PM", mode: "In person", verified: "Verified this week" },
  ],
  college: [
    { id: "campus-learning", name: "Evening Learning Commons", provider: "River County Community College", score: 98, category: "academic", summary: "Course tutoring with late hours for enrolled students.", tags: ["Free", "Enrolled students", "Evenings", "Online option"], distance: "On campus", schedule: "Mon–Thu, 4–9 PM", mode: "Hybrid", verified: "Verified today" },
    { id: "laptop-loan", name: "Semester Laptop Loan", provider: "Student Success Office", score: 94, category: "technology", summary: "Take-home laptops and hotspots for the full semester.", tags: ["Free", "Take home", "Currently available", "Enrollment required"], distance: "On campus", schedule: "Mon–Fri, 9 AM–6 PM", mode: "In person", verified: "Verified today", deadline: "12 laptops currently available" },
    { id: "basic-needs", name: "Campus Basic Needs Center", provider: "Student Life", score: 91, category: "food", summary: "Groceries, hygiene supplies, emergency aid, and benefits help.", tags: ["Free", "Confidential", "No appointment", "Enrolled students"], distance: "On campus", schedule: "Mon–Thu, 10 AM–7 PM", mode: "In person", verified: "Verified yesterday" },
    { id: "transfer-center", name: "Transfer & Career Studio", provider: "College Advising Center", score: 87, category: "programs", summary: "Transfer planning, resume reviews, and local job connections.", tags: ["Free", "Appointments available", "Online option"], distance: "On campus", schedule: "Mon–Fri, 9 AM–5 PM", mode: "Hybrid", verified: "Verified this week" },
  ],
};