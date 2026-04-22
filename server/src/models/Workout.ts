import { Schema, model, Document, Types } from 'mongoose';

// ─── Subdocument interfaces ───────────────────────────────────────────────────

export interface IExerciseSet {
  reps: number;
  weight: number; // always numeric — unit lives on User.preferredUnit
  rpe?: number;
}

export interface IExercise {
  _id: Types.ObjectId;
  name: string;
  muscleGroup: string;
  sets: IExerciseSet[];
  notes?: string;
}

// ─── Workout document ─────────────────────────────────────────────────────────

export interface IWorkout extends Document {
  userId: Types.ObjectId;
  programId?: Types.ObjectId;
  name: string;
  date: Date;
  exercises: IExercise[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Subdocument schemas ──────────────────────────────────────────────────────

const ExerciseSetSchema = new Schema<IExerciseSet>(
  {
    reps: { type: Number, required: true, min: 1 },
    weight: { type: Number, required: true, min: 0 },
    rpe: { type: Number, min: 6, max: 10 },
  },
  { _id: false } // sets don't need their own ObjectId
);

const ExerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true, trim: true },
  muscleGroup: { type: String, required: true, trim: true },
  sets: { type: [ExerciseSetSchema], default: [] },
  notes: { type: String, trim: true },
});

// ─── Workout schema ───────────────────────────────────────────────────────────

const WorkoutSchema = new Schema<IWorkout>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    programId: { type: Schema.Types.ObjectId, ref: 'Program', index: true },
    name: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now, index: true },
    exercises: { type: [ExerciseSchema], default: [] },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export default model<IWorkout>('Workout', WorkoutSchema);
