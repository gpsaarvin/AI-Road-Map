import { Schema, model, Types } from 'mongoose';

const ProgressSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  course: { type: Types.ObjectId, ref: 'Course', required: true },
  completedTopics: [{ type: String }]
}, { timestamps: true });

export const Progress = model('Progress', ProgressSchema);
