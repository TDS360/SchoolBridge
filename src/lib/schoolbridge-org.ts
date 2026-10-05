export type ResourceStatus = "available" | "limited" | "full" | "closed";
export type VerificationState = "verified" | "review" | "reported";
export type CostType = "free" | "paid" | "sliding" | "deposit";

export type OrgResource = {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  studentDescription?: string;
  grades: string;
  geography: string;
  studentStatus: string;
  incomeRequirement: string;
  costType: CostType;
  costDetail: string;
  days: string[];
  startTime: string;
  endTime: string;
  mode: "In person" | "Online" | "Hybrid";
  appointmentRequired: boolean;
  capacity: number;
  spotsOpen: number;
  status: ResourceStatus;
  address: string;
  zip: string;
  transit: string;
  languages: string[];
  accessibility: string[];
  needTags: string[];
  bring: string[];
  phone: string;
  email: string;
  website: string;
  contactPerson: string;
  verification: VerificationState;
  lastUpdatedDays: number;
  paused: boolean;
  views: number;
  matches: number;
  connections: number;
  unresolved: number;
};

export const organizationProfile = {
  name: "Prince George's Community Learning Center",
  initials: "PG",
  type: "Community learning nonprofit",
  county: "Prince George's County",
};

export const resourceCategories = [
  "Academic Help",
  "Food",
  "School Supplies",
  "Technology",
  "Transportation",
  "Scholarships",
  "Programs",
  "Community Support",
];

export const needTagOptions = [
  "Chemistry",
  "Biology",
  "Math",
  "Geometry",
  "Homework help",
  "Test preparation",
  "Reading & writing",
  "Laptop assistance",
  "Internet access",
  "Meals & groceries",
  "School supplies",
  "Bus & transit",
  "Scholarships",
  "College & career",
  "Mentoring",
  "Childcare",
];

export const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const languageOptions = ["English", "Spanish", "French", "Amharic", "Vietnamese", "ASL"];

export const accessibilityOptions = [
  "Wheelchair accessible",
  "Hearing support available",
  "Large print / vision support",
  "Quiet space available",
  "Staff trained in accommodations",
];

export const bringOptions = [
  "Student ID",
  "Proof of enrollment",
  "Parent/guardian form",
  "Proof of address",
  "Nothing required",
];

export const statusMeta: Record<ResourceStatus, { label: string; dot: string; chip: string }> = {
  available: { label: "Available", dot: "bg-primary", chip: "bg-tint-green text-primary" },
  limited: { label: "Limited", dot: "bg-gold", chip: "bg-tint-yellow text-foreground" },
  full: { label: "Full", dot: "bg-coral", chip: "bg-tint-coral text-foreground" },
  closed: {
    label: "Temporarily closed",
    dot: "bg-muted-foreground",
    chip: "bg-muted text-muted-foreground",
  },
};

export const verificationMeta: Record<
  VerificationState,
  { label: string; chip: string; note: string }
> = {
  verified: {
    label: "Verified",
    chip: "bg-tint-green text-primary",
    note: "Recently confirmed by your team.",
  },
  review: {
    label: "Needs review",
    chip: "bg-tint-yellow text-foreground",
    note: "Information may be out of date.",
  },
  reported: {
    label: "Reported",
    chip: "bg-tint-coral text-foreground",
    note: "Someone reported inaccurate information.",
  },
};

export const blankResource = (): OrgResource => ({
  id: "",
  name: "",
  category: "Academic Help",
  shortDescription: "",
  fullDescription: "",
  grades: "",
  geography: organizationProfile.county,
  studentStatus: "Currently enrolled",
  incomeRequirement: "None",
  costType: "free",
  costDetail: "",
  days: [],
  startTime: "16:00",
  endTime: "18:00",
  mode: "In person",
  appointmentRequired: false,
  capacity: 20,
  spotsOpen: 20,
  status: "available",
  address: "",
  zip: "",
  transit: "",
  languages: ["English"],
  accessibility: [],
  needTags: [],
  bring: [],
  phone: "",
  email: "",
  website: "",
  contactPerson: "",
  verification: "verified",
  lastUpdatedDays: 0,
  paused: false,
  views: 0,
  matches: 0,
  connections: 0,
  unresolved: 0,
});

export const seedResources: OrgResource[] = [
  {
    ...blankResource(),
    id: "chem-tutoring",
    name: "Free Chemistry Tutoring",
    category: "Academic Help",
    shortDescription: "Drop-in chemistry help from screened college tutors.",
    fullDescription:
      "Students get small-group and one-on-one chemistry support three evenings a week. Tutors cover homework, lab reports, and exam review for high school and first-year college chemistry.",
    grades: "Grades 8–12",
    studentStatus: "Currently enrolled",
    costType: "free",
    days: ["Monday", "Tuesday", "Wednesday"],
    startTime: "17:00",
    endTime: "19:00",
    capacity: 20,
    spotsOpen: 18,
    status: "available",
    address: "4210 Learning Way, Hyattsville",
    zip: "20781",
    transit: "Bus routes F6 and 83 stop at the door.",
    languages: ["English", "Spanish"],
    accessibility: ["Wheelchair accessible", "Quiet space available"],
    needTags: ["Chemistry", "Biology", "Homework help", "Test preparation"],
    bring: ["Student ID", "Proof of enrollment"],
    phone: "(301) 555-0142",
    email: "tutoring@pgclc.org",
    website: "https://pgclc.org/tutoring",
    contactPerson: "Academic Support Team",
    verification: "verified",
    lastUpdatedDays: 2,
    views: 183,
    matches: 53,
    connections: 41,
    unresolved: 12,
  },
  {
    ...blankResource(),
    id: "chromebook-lending",
    name: "Chromebook Lending",
    category: "Technology",
    shortDescription: "Take-home Chromebooks and hotspots for the school year.",
    fullDescription:
      "Students who need a device can borrow a Chromebook for the full term, with an optional mobile hotspot for home internet. Devices are cleaned and checked before every loan.",
    grades: "Grades 6–12",
    costType: "free",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    startTime: "09:00",
    endTime: "18:00",
    mode: "In person",
    capacity: 25,
    spotsOpen: 6,
    status: "limited",
    address: "4210 Learning Way, Hyattsville",
    zip: "20781",
    transit: "Bus routes F6 and 83 stop at the door.",
    languages: ["English", "Spanish"],
    accessibility: ["Wheelchair accessible"],
    needTags: ["Laptop assistance", "Internet access"],
    bring: ["Student ID", "Parent/guardian form"],
    phone: "(301) 555-0188",
    email: "devices@pgclc.org",
    website: "https://pgclc.org/devices",
    contactPerson: "Technology Desk",
    verification: "verified",
    lastUpdatedDays: 1,
    views: 91,
    matches: 26,
    connections: 19,
    unresolved: 7,
  },
  {
    ...blankResource(),
    id: "sat-prep",
    name: "SAT Preparation",
    category: "Academic Help",
    shortDescription: "Six-week SAT course with practice tests included.",
    fullDescription:
      "A structured six-week course covering reading, writing, and math sections, with two full practice tests and score review sessions.",
    grades: "Grades 10–12",
    costType: "free",
    days: ["Saturday"],
    startTime: "10:00",
    endTime: "13:00",
    capacity: 15,
    spotsOpen: 0,
    status: "full",
    address: "4210 Learning Way, Hyattsville",
    zip: "20781",
    transit: "Bus route 83; weekend service runs hourly.",
    languages: ["English"],
    accessibility: ["Wheelchair accessible", "Large print / vision support"],
    needTags: ["Test preparation", "Math", "Reading & writing"],
    bring: ["Student ID"],
    phone: "(301) 555-0155",
    email: "satprep@pgclc.org",
    website: "https://pgclc.org/sat",
    contactPerson: "College Readiness Team",
    verification: "verified",
    lastUpdatedDays: 4,
    views: 142,
    matches: 34,
    connections: 21,
    unresolved: 13,
  },
  {
    ...blankResource(),
    id: "homework-center",
    name: "Homework Center",
    category: "Academic Help",
    shortDescription: "After-school homework help for middle school students.",
    fullDescription:
      "A supervised space with snacks, staff support, and quiet desks for students in grades 6 through 8 to finish homework before heading home.",
    grades: "Grades 6–8",
    costType: "free",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    startTime: "15:30",
    endTime: "18:00",
    capacity: 30,
    spotsOpen: 11,
    status: "available",
    address: "4210 Learning Way, Hyattsville",
    zip: "20781",
    transit: "Walking distance from two middle schools; bus F6.",
    languages: ["English", "Spanish", "Amharic"],
    accessibility: ["Wheelchair accessible", "Quiet space available"],
    needTags: ["Homework help", "Math", "Reading & writing", "Mentoring"],
    bring: ["Parent/guardian form"],
    phone: "(301) 555-0120",
    email: "homework@pgclc.org",
    website: "https://pgclc.org/homework",
    contactPerson: "Youth Programs",
    verification: "review",
    lastUpdatedDays: 41,
    views: 120,
    matches: 18,
    connections: 10,
    unresolved: 8,
  },
  {
    ...blankResource(),
    id: "weekend-meals",
    name: "Weekend Meal Packs",
    category: "Food",
    shortDescription: "Grab-and-go grocery packs for students and families.",
    fullDescription:
      "Each pack holds enough shelf-stable food for a weekend of meals. No paperwork and no questions asked; families are welcome to pick up on a student's behalf.",
    grades: "All students",
    studentStatus: "Any student in the county",
    costType: "free",
    days: ["Friday"],
    startTime: "15:00",
    endTime: "19:00",
    capacity: 60,
    spotsOpen: 22,
    status: "available",
    address: "4210 Learning Way, Hyattsville",
    zip: "20781",
    transit: "Bus routes F6 and 83 stop at the door.",
    languages: ["English", "Spanish"],
    accessibility: ["Wheelchair accessible"],
    needTags: ["Meals & groceries"],
    bring: ["Nothing required"],
    phone: "(301) 555-0177",
    email: "meals@pgclc.org",
    website: "https://pgclc.org/meals",
    contactPerson: "Family Services",
    verification: "verified",
    lastUpdatedDays: 0,
    views: 164,
    matches: 44,
    connections: 38,
    unresolved: 6,
  },
  {
    ...blankResource(),
    id: "transit-support",
    name: "Student Transit Passes",
    category: "Transportation",
    shortDescription: "Monthly reduced-fare bus passes for enrolled students.",
    fullDescription:
      "Students can pick up a reduced-fare monthly pass valid on all county bus routes, so cost and distance stay out of the way of getting help.",
    grades: "Grades 9–12 and college",
    costType: "sliding",
    costDetail: "$5–$15 per month based on household size.",
    days: ["Monday", "Wednesday", "Friday"],
    startTime: "10:00",
    endTime: "16:00",
    capacity: 40,
    spotsOpen: 9,
    status: "limited",
    address: "4210 Learning Way, Hyattsville",
    zip: "20781",
    transit: "Pick up at the front desk.",
    languages: ["English", "Spanish"],
    accessibility: ["Wheelchair accessible"],
    needTags: ["Bus & transit"],
    bring: ["Student ID", "Proof of address"],
    phone: "(301) 555-0199",
    email: "transit@pgclc.org",
    website: "https://pgclc.org/transit",
    contactPerson: "Front Desk",
    verification: "reported",
    lastUpdatedDays: 12,
    views: 77,
    matches: 19,
    connections: 11,
    unresolved: 8,
  },
  {
    ...blankResource(),
    id: "supply-closet",
    name: "School Supply Closet",
    category: "School Supplies",
    shortDescription: "Free notebooks, backpacks, and calculators.",
    fullDescription:
      "An open-shelf closet of school supplies that students can browse themselves, restocked weekly during the school year.",
    grades: "All students",
    costType: "free",
    days: ["Tuesday", "Thursday"],
    startTime: "14:00",
    endTime: "18:00",
    capacity: 50,
    spotsOpen: 31,
    status: "available",
    address: "4210 Learning Way, Hyattsville",
    zip: "20781",
    transit: "Bus routes F6 and 83 stop at the door.",
    languages: ["English", "Spanish"],
    accessibility: ["Wheelchair accessible"],
    needTags: ["School supplies"],
    bring: ["Nothing required"],
    phone: "(301) 555-0133",
    email: "supplies@pgclc.org",
    website: "https://pgclc.org/supplies",
    contactPerson: "Front Desk",
    verification: "verified",
    lastUpdatedDays: 3,
    views: 88,
    matches: 21,
    connections: 17,
    unresolved: 4,
  },
  {
    ...blankResource(),
    id: "mentor-circle",
    name: "Mentor Circle",
    category: "Programs",
    shortDescription: "Weekly mentoring groups led by trained volunteers.",
    fullDescription:
      "Students meet weekly in small mentoring circles to work on goals, study habits, and life after graduation with a consistent trusted adult.",
    grades: "Grades 7–12",
    costType: "free",
    days: ["Thursday"],
    startTime: "17:30",
    endTime: "19:00",
    mode: "Hybrid",
    appointmentRequired: true,
    capacity: 24,
    spotsOpen: 5,
    status: "limited",
    address: "4210 Learning Way, Hyattsville",
    zip: "20781",
    transit: "Bus route F6; online option available.",
    languages: ["English", "Spanish"],
    accessibility: ["Quiet space available", "Staff trained in accommodations"],
    needTags: ["Mentoring", "College & career"],
    bring: ["Parent/guardian form"],
    phone: "(301) 555-0166",
    email: "mentors@pgclc.org",
    website: "https://pgclc.org/mentors",
    contactPerson: "Mentoring Coordinator",
    verification: "verified",
    lastUpdatedDays: 5,
    views: 95,
    matches: 28,
    connections: 20,
    unresolved: 8,
  },
];

export const recentConnections = [
  {
    id: "c1",
    resource: "Chemistry Tutoring",
    needs: ["Chemistry", "Free tutoring", "After-school availability"],
    ago: "12 minutes ago",
  },
  {
    id: "c2",
    resource: "Chromebook Lending",
    needs: ["Laptop at home", "No cost", "Take-home device"],
    ago: "48 minutes ago",
  },
  {
    id: "c3",
    resource: "Weekend Meal Packs",
    needs: ["Groceries", "No paperwork", "Friday pickup"],
    ago: "2 hours ago",
  },
  {
    id: "c4",
    resource: "Homework Center",
    needs: ["Math homework", "Walking distance", "Grades 6–8"],
    ago: "5 hours ago",
  },
];

export const needsSnapshot = [
  { need: "Chemistry", count: 32 },
  { need: "Math", count: 28 },
  { need: "Test Prep", count: 21 },
  { need: "Technology", count: 14 },
  { need: "School Supplies", count: 8 },
];

export const topStudentNeeds = [
  { need: "Chemistry", count: 53 },
  { need: "Math", count: 31 },
  { need: "Technology", count: 26 },
  { need: "Transportation", count: 19 },
  { need: "Test Prep", count: 17 },
];

export const gapOpportunities = [
  {
    need: "AP Biology",
    requests: 31,
    note: "Mostly high school juniors asking for weekday evenings.",
  },
  { need: "Geometry", requests: 27, note: "Requests cluster around grades 9 and 10." },
  { need: "Laptop assistance", requests: 19, note: "Students need repair help, not only loaners." },
];

export const monthlyTrends = [
  { month: "June", requests: 61, matches: 38, connections: 24 },
  { month: "July", requests: 74, matches: 46, connections: 31 },
  { month: "August", requests: 98, matches: 62, connections: 44 },
  { month: "September", requests: 142, matches: 95, connections: 67 },
  { month: "October", requests: 186, matches: 143, connections: 97 },
];

export const geographicDemand = [
  { area: "ZIP 20781 — Hyattsville", share: 34 },
  { area: "ZIP 20743 — Landover", share: 26 },
  { area: "ZIP 20774 — Upper Marlboro", share: 21 },
  { area: "Other county ZIP codes", share: 19 },
];

export const impact = { reached: 143, connections: 97, unresolved: 46 };

export const statusFromSpots = (spotsOpen: number, capacity: number): ResourceStatus => {
  if (spotsOpen <= 0) return "full";
  if (capacity > 0 && spotsOpen / capacity <= 0.35) return "limited";
  return "available";
};

export const scheduleLine = (resource: OrgResource) => {
  if (!resource.days.length) return "Schedule not set";
  const days =
    resource.days.length > 2
      ? `${resource.days[0]!.slice(0, 3)}–${resource.days[resource.days.length - 1]!.slice(0, 3)}`
      : resource.days.map((d) => d.slice(0, 3)).join(" & ");
  return `${days}, ${formatTime(resource.startTime)}–${formatTime(resource.endTime)}`;
};

export function formatTime(value: string) {
  const [h = NaN, m = 0] = value.split(":").map(Number);
  if (Number.isNaN(h)) return value;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m || 0).padStart(2, "0")} ${suffix}`;
}

export const costLabel = (resource: OrgResource) => {
  if (resource.costType === "free") return "Free";
  if (resource.costType === "sliding")
    return `Sliding scale${resource.costDetail ? ` — ${resource.costDetail}` : ""}`;
  if (resource.costType === "deposit")
    return `Deposit required${resource.costDetail ? ` — ${resource.costDetail}` : ""}`;
  return resource.costDetail || "Paid";
};
