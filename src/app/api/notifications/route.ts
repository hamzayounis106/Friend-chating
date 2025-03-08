import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Notification from "@/app/models/Notification";
import dbConnect from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Get query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Find notifications where the current user is the receiver
    const notifications = await Notification.find({
      receiverId: session.user.id,
    })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .skip(skip)
      .limit(limit)
      .lean();

    // Get count of unseen notifications
    const unseenCount = await Notification.countDocuments({
      receiverId: session.user.id,
      isSeen: false,
    });

    // Get total count for pagination
    const totalCount = await Notification.countDocuments({
      receiverId: session.user.id,
    });

    return NextResponse.json({
      notifications,
      unseenCount,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// API to mark notifications as seen
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const { notificationIds } = body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Mark specified notifications as seen, ensuring they belong to the current user
    const result = await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        receiverId: session.user.id,
      },
      { isSeen: true }
    );

    return NextResponse.json({
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
