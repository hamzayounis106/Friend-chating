import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import jobSlice from './slices/jobSlice';
import offerReducer from './slices/offerSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    jobs: jobSlice,
    offers: offerReducer,
  },
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
