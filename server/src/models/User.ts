import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  preferredUnit: 'kg' | 'lbs';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    preferredUnit: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
  },
  { timestamps: true }
);

export default model<IUser>('User', UserSchema);
