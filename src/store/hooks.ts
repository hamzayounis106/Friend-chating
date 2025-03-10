import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { createSelector } from '@reduxjs/toolkit';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const selectJobsBySurgeon = (email: string) =>
  createSelector(
    (state: RootState) => state.jobs.jobsBySurgeon[email],
    (jobs) => jobs || []
  );
