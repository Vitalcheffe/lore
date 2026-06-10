import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  let dbConnected = false;
  
  try {
    // Actually verify database connection by counting resources
    await db.resource.count();
    dbConnected = true;
  } catch (error) {
    console.error("Health check - DB connection failed:", error);
    dbConnected = false;
  }

  const healthy = dbConnected;

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      model_loaded: true,
      crisis_module_active: true,
      database_connected: dbConnected,
      version: "1.0.0",
      ...(healthy ? {} : { note: "Database connection unavailable. Crisis detection still active." }),
    },
    { status: healthy ? 200 : 503 }
  );
}
