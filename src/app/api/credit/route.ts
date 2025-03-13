import { NextRequest, NextResponse } from "next/server";

import Credit from "@/app/models/Credit";
import User from "@/app/models/User";
import Job from "@/app/models/Job";
import { getServerSession } from "next-auth";

import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { authOptions } from "@/lib/auth";

// Get credits (with filtering options)
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get query parameters
    const url = new URL(req.url);
    const surgeonId = url.searchParams.get("surgeonId");
    const patientId = url.searchParams.get("patientId");
    const jobId = url.searchParams.get("jobId");
    const onlyUnused = url.searchParams.get("onlyUnused") === "true";

    // Connect to database
    await dbConnect();

    // Build query
    const query: any = {};

    if (surgeonId) {
      query.surgeonId = new mongoose.Types.ObjectId(surgeonId);
    }

    if (patientId) {
      query.patientId = new mongoose.Types.ObjectId(patientId);
    }

    if (jobId) {
      query.jobId = new mongoose.Types.ObjectId(jobId);
    }

    if (onlyUnused) {
      query.isUsed = false;
    }

    // Get credits based on query
    const credits = await Credit.find(query).populate("jobId");

    return NextResponse.json({
      success: true,
      credits,
    });
  } catch (error: any) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits: " + error.message },
      { status: 500 }
    );
  }
}

// Purchase a new credit (for patients)
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    console.log("Session in /api/credit:", session); // Add this line

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify user is a patient
    const user = await User.findOne({ email: session.user.email });
    console.log("User in /api/credit:", user); // Add this line

    if (!user || user.role !== "patient") {
      return NextResponse.json(
        { error: "Only patients can purchase credits" },
        { status: 403 }
      );
    }

    const { quantity = 1 } = await req.json();
    console.log("quantity", quantity);
    // Connect to database
    await dbConnect();

    // Create credits
    const creditData = {
      patientId: user._id,

      isUsed: false,
    };
    const patientUser = await User.findOne({ email: session.user.email });
    console.log("patientUser", patientUser);

    const credits = [];
    for (let i = 0; i < quantity; i++) {
      credits.push(creditData);
    }
    console.log("credits array ------------------------------->", credits);
    // Insert credits
    let result;
    try {
        result = await Credit.insertMany(credits);
        
        // Fix: Use spread operator to add all credit IDs to the array instead of nesting arrays
        patientUser.creditIds = [
          ...patientUser.creditIds,
          ...result.map((credit) => credit._id)
        ];
        
        await patientUser.save();
        console.log(
          "patientUser after saving results------------------------------->",
          patientUser
        );
      } catch (error) {
        console.log(
          "error saving all the credits ------------------------------->",
          error
        );
      }
    // const result = await Credit.insertMany(credits);
    console.log("result------------------------------->", result);
    return NextResponse.json(
      {
        success: true,
        message: `${quantity} credit(s) purchased successfully`,
        credits: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error purchasing credits:", error);
    return NextResponse.json(
      { error: "Failed to purchase credits: " + error.message },
      { status: 500 }
    );
  }
}
