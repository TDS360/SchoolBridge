# SchoolBridge Student Experience

## Goal

Build a polished, responsive SchoolBridge prototype focused on three connected experiences: the landing page, an adaptive triage flow, and personalized resource matches.

## Pages and flow

- **Home (`/`)**: branded navigation, the supplied headline and supporting copy, primary and secondary actions, an embedded “What do you need help with?” triage bar, student-level selector, category preview, traditional-vs-SchoolBridge comparison, and four-step explanation.
- **Find help (`/get-started`)**: a compact multi-step flow for student level, general location, support categories, relevant constraints, and a natural-language request. Never request an exact home address.
- **Matches (`/matches`)**: ranked demo resources with match scores, concise fit reasons, category and practicality filters, responsive result cards, and an explainable match panel showing requirement-by-requirement scores.

## Student-level tailoring

- **Middle school**: tutoring/homework, meals, school supplies, devices/internet, rides, after-school and enrichment programs, mentoring, and family/community support. Use simpler language and surface parent/guardian requirements.
- **High school**: subject tutoring, test preparation, meals, supplies, devices/internet, transportation, scholarships, college/career programs, internships, mentoring, and community support. Highlight deadlines and grade eligibility.
- **Community college**: course tutoring, food pantry/basic needs, textbooks/supplies, laptop and internet access, transit, scholarships/emergency grants, childcare, career support, transfer help, and mental-health/community services. Highlight campus, enrollment, modality, and schedule fit.
- Selection changes the categories, placeholder examples, recommended results, language, eligibility details, and fit explanation.

## Interaction details

- The home triage bar supports fast category selection and a plain-language request, then opens the full flow with that context preserved.
- The guided flow allows multiple needs and only shows constraints relevant to those needs.
- Submitting produces locally generated demo matches suitable for a hackathon presentation; no account or saved database state is included.
- Filters update visible results, best matches remain first, and students can inspect why each recommendation fits.
- Include clear empty states, keyboard focus, readable contrast, and mobile controls without dense or overlapping layouts.

## Visual direction

- Friendly editorial style with bold readable type, warm light surfaces, energetic green as the action color, coral and yellow support accents, and simple school-life illustrations made from interface shapes/icons.
- Avoid institutional or government-directory styling; keep the experience clean, welcoming, fast, and student-centered.
- Use semantic design tokens and the existing interface controls; add restrained motion with reduced-motion support.

## Technical details

- Use TanStack routes for `/`, `/get-started`, and `/matches`, each with unique title, description, Open Graph, and Twitter metadata.
- Keep triage state in a small client-side context shared across the three routes; results are deterministic demo data tailored to the selected student level and needs.
- Add a shared responsive SchoolBridge header and mobile navigation appropriate to the implemented flow.
- Validate the build and test desktop and mobile flows in the live preview.
