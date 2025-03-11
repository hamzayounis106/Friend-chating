import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OfferType {
  _id: string;
  cost: number;
  status: string;
  createdAt: string;
  createdBy: string;
  jobId: string;
  location: string;
  expectedSurgeoryDate: string;
}

interface NotificationType {
  id: string;
  senderId: string;
  senderImg: string;
  senderName: string;
  content: string;
  jobId: string;
  type: 'offer_created' | 'invite_accepted' | 'message';
  timestamp: string;
}

interface OfferState {
  offers: OfferType[];
  notifications: NotificationType[];
}

const initialState: OfferState = {
  offers: [],
  notifications: [],
};

const offerSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    addOffer: (state, action: PayloadAction<OfferType>) => {
      state.offers.push(action.payload);
    },

    updateOfferStatus: (
      state,
      action: PayloadAction<{ offerId: string; status: string }>
    ) => {
      const { offerId, status } = action.payload;
      state.offers = state.offers.map((offer) =>
        offer._id === offerId ? { ...offer, status } : offer
      );
      console.log('offers from the redux slice 😋😋😋😋', state.offers);

      if (status === 'accepted') {
        state.offers = state.offers.map((offer) =>
          offer.jobId === state.offers.find((o) => o._id === offerId)?.jobId &&
          offer._id !== offerId
            ? { ...offer, status: 'declined' }
            : offer
        );
      }
    },
  },
});

export const { addOffer, updateOfferStatus } = offerSlice.actions;
export default offerSlice.reducer;
