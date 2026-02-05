import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Interface
 * Defines the structure of user profile data with authentication
 */
export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  username: string;
  phone?: string;
  country?: string;
  profileImage?: string;
  firebaseUid?: string;
  preferences?: {
    learningStyle?: string;
    level?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User Schema
 * MongoDB schema for storing user profile information with authentication
 * - email is unique and required (used as primary identifier)
 * - password is hashed using bcrypt before saving
 * - Includes validation for required fields
 * - Timestamps automatically track creation and update times
 */
const UserSchema = new Schema<IUser>({
  // Required fields
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters']
  },
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  
  // Optional fields
  phone: { 
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-()]+$/, 'Please provide a valid phone number']
  },
  country: { 
    type: String,
    trim: true
  },
  profileImage: { 
    type: String, // Base64 string or URL
    default: ''
  },
  
  // Firebase integration
  firebaseUid: { 
    type: String,
    sparse: true // Allows null values while maintaining uniqueness for non-null values
  },
  
  // Learning preferences
  preferences: {
    learningStyle: { type: String },
    level: { type: String }
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Create indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

export const User = model<IUser>('User', UserSchema);
