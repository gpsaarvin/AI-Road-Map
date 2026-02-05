import { Schema, model } from 'mongoose';

const CourseSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }
}, { timestamps: true });

export const Course = model('Course', CourseSchema);
