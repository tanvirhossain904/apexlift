import api from './api';
import { WeeklyVolumePoint, ProgressionResult } from '../types';

export const getWeeklyVolume = (params?: { from?: string; to?: string }) =>
  api.get<WeeklyVolumePoint[]>('/analytics/volume/weekly', { params });

export const getProgression = (exerciseName: string, programId?: string) =>
  api.get<ProgressionResult>('/analytics/progression', { params: { exerciseName, programId } });
