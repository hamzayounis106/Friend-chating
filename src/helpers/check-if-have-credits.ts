import dbConnect from '@/lib/db';
import Credit from '@/app/models/Credit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

// Updated return type to match the actual returned data
type CreditsCheckResult = {
  success?: boolean;
  error?: string;
  availableCredits?: number;
};

export const checkIfHaveCredits = async (): Promise<CreditsCheckResult> => {
  try {
    await dbConnect(); // Ensure Mongoose connects

    // Get the current user's session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.error('No authenticated user');
      return { error: 'No authenticated user' };
    }

    const availableCredits = await Credit.find({
      isUsed: false,
      patientId: new mongoose.Types.ObjectId(session.user.id),
    }).exec();
    // const creditCount = availableCredits.length;

    if (!availableCredits || availableCredits.length === 0) {
      // console.error("No credits found for this user");
      return {
        success: false,
      };
    }

    return {
      success: true,
      availableCredits: availableCredits.length,
    };
  } catch (error) {
    console.error('Error checking for available credits:', error);
    return { error: 'Failed to check for available credits' };
  }
};
