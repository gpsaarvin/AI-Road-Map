import { Schema, model, Types } from 'mongoose';

const TopicSchema = new Schema({
  title: String,
  description: String,
  estimatedHours: Number
});

const LevelSchema = new Schema({
  level: String,
  topics: [TopicSchema]
});

const RoadmapSchema = new Schema({
  course: { type: Types.ObjectId, ref: 'Course', required: true },
  levels: [LevelSchema],
  totalHours: Number,
  approved: { type: Boolean, default: false }
}, { timestamps: true });

export const Roadmap = model('Roadmap', RoadmapSchema);
