import { Schema, model, Document, Types } from 'mongoose';

export interface IProgram extends Document {
  userId: Types.ObjectId;
  name: string;
  description?: string;
  workoutIds: Types.ObjectId[]; // references to Workout collection
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema = new Schema<IProgram>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    workoutIds: [{ type: Schema.Types.ObjectId, ref: 'Workout' }],
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<IProgram>('Program', ProgramSchema);
