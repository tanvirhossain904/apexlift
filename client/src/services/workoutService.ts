import api from './api';
import { Workout, ExerciseSet } from '../types';

export const createWorkout = (data: { name: string; date?: string; programId?: string }) =>
  api.post<Workout>('/workouts', data);

export const getWorkouts = (params?: { from?: string; to?: string; programId?: string }) =>
  api.get<Workout[]>('/workouts', { params });

export const getWorkout = (id: string) =>
  api.get<Workout>(`/workouts/${id}`);

export const addExercise = (workoutId: string, data: { name: string; muscleGroup: string; notes?: string }) =>
  api.post<Workout>(`/workouts/${workoutId}/exercises`, data);

export const updateExercise = (workoutId: string, exerciseId: string, data: { name?: string; muscleGroup?: string; notes?: string; sets?: ExerciseSet[] }) =>
  api.put<Workout>(`/workouts/${workoutId}/exercises/${exerciseId}`, data);

export const removeExercise = (workoutId: string, exerciseId: string) =>
  api.delete<Workout>(`/workouts/${workoutId}/exercises/${exerciseId}`);
