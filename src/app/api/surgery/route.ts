import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Surgery from "@/app/models/surgery";
import User from "@/app/models/User";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    // Connect to MongoDB
    await dbConnect();

    let surgeries = [];

    // Fetch surgeries based on user role
    if (userRole === "surgeon") {
      // Get surgeries where the user is the surgeon
      surgeries = await Surgery.find({ surgeonId: userId })
        .populate({
          path: "patientId",
          model: User,
          select: "name email image",
        })
        .populate({
          path: "jobId",
          select: "title description createdAt",
        })
        .populate({
          path: "offerId",
          select: "cost date location status",
        })
        .sort({ scheduledDate: 1 }); // Sort by upcoming surgeries
    } else if (userRole === "patient") {
      // Get surgeries where the user is the patient
      surgeries = await Surgery.find({ patientId: userId })
        .populate({
          path: "surgeonId",
          model: User,
          select: "name email image",
        })
        .populate({
          path: "jobId",
          select: "title description createdAt",
        })
        .populate({
          path: "offerId",
          select: "cost date location status",
        })
        .sort({ scheduledDate: 1 }); // Sort by upcoming surgeries
    } else {
      // For other roles (admin, etc.)
      return NextResponse.json({ error: "Unauthorized role" }, { status: 403 });
    }

    return NextResponse.json({ surgeries }, { status: 200 });
  } catch (error) {
    console.error("Error fetching surgeries:", error);
    return NextResponse.json(
      { error: "Failed to fetch surgeries" },
      { status: 500 }
    );
  }
}