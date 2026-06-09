import { NextRequest, NextResponse } from "next/server";

// ─── Static fallback resources (used when DB is unavailable) ──────
const STATIC_RESOURCES: Array<{
  id: string;
  name: string;
  category: string;
  description: string;
  services?: string;
  verified?: string;
  distance?: string;
}> = [
  {
    id: "s1",
    name: "The Harris Center for Mental Health",
    category: "Mental Health",
    description: "Outpatient therapy, psychiatric services, crisis stabilization, and substance use treatment. Sliding scale fees based on income.",
    services: "Outpatient therapy, Psychiatric services, Crisis stabilization",
    verified: "May 2026",
    distance: "2.1 mi",
  },
  {
    id: "s2",
    name: "Catholic Charities Counseling",
    category: "Mental Health",
    description: "Individual, family, and group counseling. Specialties include PTSD, depression, anxiety, and immigrant/refugee trauma.",
    services: "Individual counseling, Family counseling, Group counseling",
    verified: "April 2026",
    distance: "3.4 mi",
  },
  {
    id: "s3",
    name: "Memorial Hermann Behavioral Health",
    category: "Mental Health",
    description: "Inpatient and outpatient psychiatric care, substance abuse treatment, and crisis intervention services.",
    services: "Inpatient psychiatric, Outpatient care, Crisis intervention",
    verified: "May 2026",
    distance: "5.2 mi",
  },
  {
    id: "s4",
    name: "Houston Housing Authority",
    category: "Housing Assistance",
    description: "Section 8 Housing Choice Voucher program, public housing, and emergency rental assistance for qualifying families.",
    services: "Section 8 vouchers, Public housing, Rental assistance",
    verified: "May 2026",
    distance: "4.0 mi",
  },
  {
    id: "s5",
    name: "Salvation Army Family Shelter",
    category: "Housing Assistance",
    description: "Emergency shelter for families with children. Provides meals, case management, and transition assistance.",
    services: "Emergency shelter, Meals, Case management",
    verified: "April 2026",
    distance: "3.8 mi",
  },
  {
    id: "s6",
    name: "Star of Hope Mission",
    category: "Housing Assistance",
    description: "Emergency shelter, transitional living, and permanent supportive housing for men, women, and families.",
    services: "Emergency shelter, Transitional living, Spiritual support",
    verified: "May 2026",
    distance: "6.1 mi",
  },
  {
    id: "s7",
    name: "Houston Food Bank",
    category: "Food Assistance",
    description: "Largest food bank in the US. Distributes food through 1,500 community partners. No ID required for most distributions.",
    services: "Food distribution, SNAP assistance, Nutrition education",
    verified: "May 2026",
    distance: "1.5 mi",
  },
  {
    id: "s8",
    name: "SNAP Benefits Office",
    category: "Food Assistance",
    description: "Supplemental Nutrition Assistance Program. Monthly EBT benefits for groceries. Apply online or in person.",
    services: "SNAP application, Benefits renewal, EBT card",
    verified: "May 2026",
    distance: "2.8 mi",
  },
  {
    id: "s9",
    name: "Target Hunger",
    category: "Food Assistance",
    description: "Community-based hunger relief. Food pantries, home-delivered meals for seniors, and community gardens.",
    services: "Food pantry, Senior meals, Community gardens",
    verified: "April 2026",
    distance: "4.2 mi",
  },
  {
    id: "s10",
    name: "Workforce Solutions",
    category: "Employment Services",
    description: "Job search assistance, career counseling, skills training, and connection to employers. Walk-ins welcome.",
    services: "Job placement, Skills training, Resume help",
    verified: "May 2026",
    distance: "2.3 mi",
  },
  {
    id: "s11",
    name: "Goodwill Industries",
    category: "Employment Services",
    description: "Job training programs, career navigation, and employment services for people facing barriers to employment.",
    services: "Job training, Career navigation, Computer skills",
    verified: "May 2026",
    distance: "3.1 mi",
  },
  {
    id: "s12",
    name: "BakerRipley",
    category: "Employment Services",
    description: "Workforce development, financial coaching, and small business support for underserved communities.",
    services: "Workforce development, Financial coaching, ESL classes",
    verified: "May 2026",
    distance: "5.4 mi",
  },
  {
    id: "s13",
    name: "Houston Volunteer Lawyers",
    category: "Legal Aid",
    description: "Free civil legal services for low-income residents. Immigration, family law, housing disputes, and benefits.",
    services: "Immigration law, Family law, Housing disputes",
    verified: "May 2026",
    distance: "4.5 mi",
  },
  {
    id: "s14",
    name: "Catholic Charities Legal Services",
    category: "Legal Aid",
    description: "Immigration legal services, citizenship assistance, and DACA renewal help. Multilingual staff available.",
    services: "Immigration services, Citizenship assistance, DACA renewal",
    verified: "April 2026",
    distance: "3.4 mi",
  },
  {
    id: "s15",
    name: "Harris Health System",
    category: "Healthcare",
    description: "Community health centers with sliding scale fees. Primary care, specialty care, and pharmacy services.",
    services: "Primary care, Specialty care, Pharmacy",
    verified: "May 2026",
    distance: "2.7 mi",
  },
  {
    id: "s16",
    name: "Community Health Choice",
    category: "Healthcare",
    description: "Affordable health insurance plans, Medicaid/CHIP enrollment assistance, and provider network.",
    services: "Health insurance, Medicaid enrollment, CHIP",
    verified: "April 2026",
    distance: "6.0 mi",
  },
  {
    id: "s17",
    name: "Santa Maria Hostel",
    category: "Substance Abuse",
    description: "Residential and outpatient substance abuse treatment for women, including those with children.",
    services: "Residential treatment, Outpatient care, Family support",
    verified: "May 2026",
    distance: "4.8 mi",
  },
  {
    id: "s18",
    name: "Cenikor Foundation",
    category: "Substance Abuse",
    description: "Long-term residential substance abuse treatment with vocational training and life skills development.",
    services: "Residential treatment, Vocational training, Aftercare",
    verified: "April 2026",
    distance: "7.2 mi",
  },
  {
    id: "s19",
    name: "Houston Area Urban League",
    category: "Senior Services",
    description: "Senior employment program, benefits counseling, and community services for adults 55+.",
    services: "Senior employment, Benefits counseling, Social services",
    verified: "May 2026",
    distance: "3.9 mi",
  },
  {
    id: "s20",
    name: "Meals on Wheels Houston",
    category: "Senior Services",
    description: "Home-delivered meals for homebound seniors. Also provides wellness checks and social connection.",
    services: "Home-delivered meals, Wellness checks, Pet food program",
    verified: "May 2026",
    distance: "1.8 mi",
  },
];

// GET /api/community-resources — List community resources, optionally filtered by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Try database first
    try {
      const { db } = await import("@/lib/db");

      const where: Record<string, unknown> = {};
      if (category && category !== "All") {
        where.category = category;
      }
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
          { services: { contains: search } },
        ];
      }

      const resources = await db.resource.findMany({
        where,
        orderBy: { name: "asc" },
      });

      if (resources.length > 0) {
        const categories = await db.resource.findMany({
          select: { category: true },
          distinct: ["category"],
          orderBy: { category: "asc" },
        });

        return NextResponse.json({
          resources: resources.map((r: Record<string, unknown>) => ({
            id: r.id,
            name: r.name,
            description: r.description || r.services || "Community resource available",
            category: r.category,
            services: r.services || undefined,
            verified: r.lastVerified || undefined,
            distance: (r as Record<string, unknown>).distance || undefined,
          })),
          categories: categories.map((c: Record<string, unknown>) => c.category),
        });
      }
    } catch (dbError) {
      console.error("DB unavailable, using static resources:", dbError);
    }

    // Fallback: use static resources
    let filtered = STATIC_RESOURCES;
    if (category && category !== "All") {
      filtered = filtered.filter((r) => r.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (r.services && r.services.toLowerCase().includes(q))
      );
    }

    const categories = [...new Set(STATIC_RESOURCES.map((r) => r.category))].sort();

    return NextResponse.json({
      resources: filtered.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        category: r.category,
        services: r.services,
        verified: r.verified,
        distance: r.distance,
      })),
      categories,
    });
  } catch (error) {
    console.error("Error fetching community resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}
