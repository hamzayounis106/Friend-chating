import { OfferType } from '@/app/(dashboard)/dashboard/chat/[chatId]/offer/page';
import Offer from '@/app/models/Offer';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

export const getOffersForSingleJob = async (
  jobId: string
): Promise<OfferType[]> => {
  try {
    console.log('Fetching offers for job:', jobId);
    await dbConnect();

    // Use the passed jobId parameter instead of hardcoded value
    const offers = await Offer.find({
      jobId: new mongoose.Types.ObjectId(jobId),
    }).sort({ createdAt: -1 }); // Sort by newest first

    return offers as OfferType[];
  } catch (error) {
    console.error('Error fetching offers:', error);
    return []; // Return empty array instead of throwing
  }
};