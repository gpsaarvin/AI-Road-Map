import { Router, Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { z } from 'zod';
import mongoose from 'mongoose';

const router = Router();

// In-memory storage for demo mode (when MongoDB is not connected)
const demoProfileStore = new Map<string, any>();

/**
 * Validation Schema for Profile Data
 * Using Zod for runtime type validation
 */
const ProfileSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  phone: z.string()
    .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  country: z.string().optional(),
  profileImage: z.string().optional()
});

/**
 * POST /api/profile
 * Save or update user profile data
 * 
 * @body ProfileData - User profile information
 * @returns Success message with saved user data
 * 
 * Example Request:
 * {
 *   "email": "john.doe@example.com",
 *   "fullName": "John Doe",
 *   "username": "johndoe123",
 *   "phone": "+1 234 567 8900",
 *   "country": "United States",
 *   "profileImage": "data:image/jpeg;base64,/9j/4AAQ..."
 * }
 */
router.post('/profile', async (req: Request, res: Response) => {
  try {
    // Step 1: Validate incoming data
    const validationResult = ProfileSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    const profileData = validationResult.data;

    // Check if MongoDB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      // Demo mode: Use in-memory storage
      console.log('[Profile] Running in demo mode - using in-memory storage');
      
      // Check if username is taken by another user
      for (const [email, profile] of demoProfileStore.entries()) {
        if (profile.username === profileData.username && email !== profileData.email) {
          return res.status(400).json({
            success: false,
            message: 'Username is already taken',
            errors: [{ field: 'username', message: 'This username is already in use' }]
          });
        }
      }

      // Save to in-memory store
      const savedProfile = {
        email: profileData.email,
        fullName: profileData.fullName,
        username: profileData.username,
        phone: profileData.phone || '',
        country: profileData.country || '',
        profileImage: profileData.profileImage || '',
        updatedAt: new Date().toISOString()
      };

      demoProfileStore.set(profileData.email, savedProfile);
      console.log(`[Profile] Saved profile for ${profileData.email} (demo mode)`);

      return res.status(200).json({
        success: true,
        message: 'Profile saved successfully (demo mode - data not persisted)',
        data: savedProfile
      });
    }

    // MongoDB mode: Use database
    // Step 2: Check if username is already taken by another user
    const existingUsername = await User.findOne({ 
      username: profileData.username,
      email: { $ne: profileData.email } // Exclude current user's email
    });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken',
        errors: [{ field: 'username', message: 'This username is already in use' }]
      });
    }

    // Step 3: Find user by email or create new user
    // Using email as unique identifier (upsert operation)
    const updatedUser = await User.findOneAndUpdate(
      { email: profileData.email }, // Find by email
      {
        $set: {
          fullName: profileData.fullName,
          username: profileData.username,
          phone: profileData.phone || '',
          country: profileData.country || '',
          profileImage: profileData.profileImage || ''
        }
      },
      {
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        runValidators: true // Run schema validators
      }
    );

    // Step 4: Return success response
    return res.status(200).json({
      success: true,
      message: 'Profile saved successfully',
      data: {
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        phone: updatedUser.phone,
        country: updatedUser.country,
        profileImage: updatedUser.profileImage,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (error: any) {
    console.error('Profile save error:', error);

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
        errors: [{ field, message: `This ${field} is already in use` }]
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }

    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: 'Failed to save profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/profile/:email
 * Retrieve user profile by email
 * 
 * @param email - User's email address
 * @returns User profile data
 */
router.get('/profile/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    // Validate email format
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }

    // Check if MongoDB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      // Demo mode: Use in-memory storage
      console.log('[Profile] Fetching from demo mode storage');
      const profile = demoProfileStore.get(email.toLowerCase());

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'User not found (demo mode)'
        });
      }

      return res.status(200).json({
        success: true,
        data: profile
      });
    }

    // MongoDB mode: Use database
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user data (excluding sensitive fields)
    return res.status(200).json({
      success: true,
      data: {
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        phone: user.phone,
        country: user.country,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
