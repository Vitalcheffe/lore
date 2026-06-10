import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/audit-logs — Generate audit log entries from CommunityResource records
export async function GET() {
  try {
    const resources = await db.communityResource.findMany({
      orderBy: { updatedAt: "desc" },
      take: 20,
    });

    if (resources.length === 0) {
      return NextResponse.json({ logs: [] });
    }

    const logs = resources.map((resource, index) => {
      const updatedAt = resource.updatedAt;
      const hasLastVerified = !!resource.lastVerified;
      const hasServices = !!resource.services;

      // Determine the audit action based on resource data
      let action: string;
      let tier: string;
      let iconType: string;
      let color: string;

      if (hasLastVerified) {
        const verifiedDate = new Date(resource.lastVerified);
        const daysSinceVerified =
          (Date.now() - verifiedDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceVerified <= 30) {
          action = "Recently Updated";
          tier = "4 (Renewed)";
          iconType = "CheckCircle2";
          color = "#059669";
        } else if (hasServices) {
          action = "Navigator Confirmed";
          tier = "3 → 4";
          iconType = "UserCheck";
          color = "#10b981";
        } else {
          action = "Database Verified";
          tier = "2 (Renewed)";
          iconType = "Database";
          color = "#3b82f6";
        }
      } else if (hasServices) {
        action = "Database Verified";
        tier = "1 → 2";
        iconType = "Database";
        color = "#3b82f6";
      } else {
        action = "AI Classified";
        tier = "0 → 1";
        iconType = "Sparkles";
        color = "#f59e0b";
      }

      // Format timestamp from updatedAt
      const timestamp = updatedAt.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      // Generate audit ID
      const dateStr = updatedAt.toISOString().slice(0, 10).replace(/-/g, "");
      const id = `AUD-${dateStr}-${String(index + 1).padStart(3, "0")}`;

      return {
        id,
        timestamp,
        action,
        resource: resource.name,
        navigator: hasLastVerified ? "System" : "AI Model",
        tier,
        iconType,
        color,
      };
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Error generating audit logs:", error);
    return NextResponse.json(
      { error: "Failed to generate audit logs" },
      { status: 500 }
    );
  }
}
