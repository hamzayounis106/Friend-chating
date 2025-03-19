// store/slices/jobSlice.ts
import { JobData } from '@/components/jobs/job';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface JobState {
  jobsBySurgeon: Record<string, JobData[]>; // Key: surgeon email
  unseenJobCounts: Record<string, number>;
  newJobIdsBySurgeon: Record<string, string[]>; // Track new job IDs per surgeon
  latestJobsBySurgeon: Record<string, JobData | null>; // Store only the last job per surgeon
}

const initialState: JobState = {
  jobsBySurgeon: {},
  unseenJobCounts: {},
  newJobIdsBySurgeon: {},
  latestJobsBySurgeon: {},
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // Initialize surgeon's job list
    // setInitialJobs: (
    //   state,
    //   action: PayloadAction<{ email: string; jobs: JobData[] }>
    // ) => {
    //   const { email, jobs } = action.payload;
    //   state.jobsBySurgeon[email] = jobs;
    // },
    setInitialJobs: (
      state,
      action: PayloadAction<{ email: string; jobs: JobData[] }>
    ) => {
      const { email, jobs } = action.payload;
      state.jobsBySurgeon[email] = jobs;
    },

    addJob: (state, action: PayloadAction<{ email: string; job: JobData }>) => {
      const { email, job } = action.payload;
      const existingJobs = state.jobsBySurgeon[email] || [];

      if (!existingJobs.some((j) => j._id === job._id)) {
        state.jobsBySurgeon[email] = [...existingJobs, job];
        state.newJobIdsBySurgeon[email] = [
          ...(state.newJobIdsBySurgeon[email] || []),
          job._id,
        ];
      }
    },

    // Remove accepted job for specific surgeon
    // removeAcceptedJob: (
    //   state,
    //   action: PayloadAction<{ email: string; jobId: string }>
    // ) => {
    //   const { email, jobId } = action.payload;
    //   state.jobsBySurgeon[email] =
    //     state.jobsBySurgeon[email]?.filter((job) => job._id !== jobId) || [];

    //   state.newJobIdsBySurgeon[email] =
    //     state.newJobIdsBySurgeon[email]?.filter((id) => id !== jobId) || [];
    // },

    removeAcceptedJob: (
      state,
      action: PayloadAction<{ email: string; jobId: string }>
    ) => {
      const { email, jobId } = action.payload;
      state.jobsBySurgeon[email] =
        state.jobsBySurgeon[email]?.filter((job) => job._id !== jobId) || [];
      state.newJobIdsBySurgeon[email] =
        state.newJobIdsBySurgeon[email]?.filter((id) => id !== jobId) || [];
    },
    // Count management
    setUnseenJobCount: (
      state,
      action: PayloadAction<{ email: string; count: number }>
    ) => {
      const { email, count } = action.payload;
      state.unseenJobCounts[email] = count;
    },

    incrementUnseenJobCount: (
      state,
      action: PayloadAction<{ email: string }>
    ) => {
      const { email } = action.payload;
      state.unseenJobCounts[email] = (state.unseenJobCounts[email] || 0) + 1;
    },

    decrementUnseenJobCount: (
      state,
      action: PayloadAction<{ email: string }>
    ) => {
      const { email } = action.payload;
      if (state.unseenJobCounts[email] > 0) {
        state.unseenJobCounts[email]--;
      }
    },

    // Clear new job IDs for a surgeon
    // clearNewJobs: (state, action: PayloadAction<{ email: string }>) => {
    //   const { email } = action.payload;
    //   state.newJobIdsBySurgeon[email] = [];
    // },
    clearNewJobs: (state, action: PayloadAction<{ email: string }>) => {
      const { email } = action.payload;
      state.newJobIdsBySurgeon[email] = [];
    },

    // Add job without marking as new (for initial load)
    addJobSilent: {
      reducer: (
        state,
        action: PayloadAction<{ email: string; job: JobData }>
      ) => {
        const { email, job } = action.payload;
        const existingJobs = state.jobsBySurgeon[email] || [];

        if (!existingJobs.some((j) => j._id === job._id)) {
          state.jobsBySurgeon[email] = [...existingJobs, job];
        }
      },
      prepare: (email: string, job: JobData) => ({
        payload: { email, job },
      }),
    },

    // Reset all state for a surgeon
    clearSurgeonState: (state, action: PayloadAction<{ email: string }>) => {
      const { email } = action.payload;
      delete state.jobsBySurgeon[email];
      delete state.unseenJobCounts[email];
      delete state.newJobIdsBySurgeon[email];
    },
    // setLatestJob: (
    //   state,
    //   action: PayloadAction<{ email: string; job: JobData }>
    // ) => {
    //   const { email, job } = action.payload;
    //   state.latestJobsBySurgeon[email] = job;
    // },
    setLatestJob: (
      state,
      action: PayloadAction<{ email: string; job: JobData }>
    ) => {
      const { email, job } = action.payload;
      state.latestJobsBySurgeon[email] = job;

      // Also update the job list immediately
      const existingJobs = state.jobsBySurgeon[email] || [];
      if (!existingJobs.some((j) => j._id === job._id)) {
        state.jobsBySurgeon[email] = [job, ...existingJobs]; // Add at the beginning
      }
    },
  },
});

export const {
  setInitialJobs,
  addJob,
  removeAcceptedJob,
  setUnseenJobCount,
  incrementUnseenJobCount,
  decrementUnseenJobCount,
  clearNewJobs,
  addJobSilent,
  clearSurgeonState,
  setLatestJob,
} = jobSlice.actions;

export default jobSlice.reducer;
