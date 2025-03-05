import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import jobSlice from './slices/jobSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    jobs: jobSlice,
  },
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
