import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = Router();

// JWT Secret (should be in .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

// In-memory storage for demo mode
const demoUsers = new Map<string, any>();

/**
 * Register Validation Schema
 */
const RegisterSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  phone: z.string().optional(),
  country: z.string().optional()
});

/**
 * Login Validation Schema
 */
const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

/**
 * Generate JWT Token
 */
const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = RegisterSchema.safeParse(req.body);
    
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

    const { email, password, fullName, username, phone, country } = validationResult.data;

    // Check if MongoDB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      // Demo mode
      console.log('[Auth] Running in demo mode - using in-memory storage');
      
      // Check if user already exists
      if (demoUsers.has(email.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered',
          errors: [{ field: 'email', message: 'This email is already in use' }]
        });
      }

      // Check if username is taken
      for (const user of demoUsers.values()) {
        if (user.username === username) {
          return res.status(400).json({
            success: false,
            message: 'Username already taken',
            errors: [{ field: 'username', message: 'This username is already in use' }]
          });
        }
      }

      // Create user in demo mode (password stored as plain text in demo - NOT FOR PRODUCTION)
      const newUser = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        password, // In demo mode, storing plain text (NOT SECURE - just for testing)
        fullName,
        username,
        phone: phone || '',
        country: country || '',
        profileImage: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      demoUsers.set(email.toLowerCase(), newUser);
      console.log(`[Auth] User registered: ${email} (demo mode)`);

      // Generate token
      const token = generateToken(newUser.id, newUser.email);

      return res.status(201).json({
        success: true,
        message: 'Registration successful (demo mode)',
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
            username: newUser.username,
            phone: newUser.phone,
            country: newUser.country,
            profileImage: newUser.profileImage
          },
          token
        }
      });
    }

    // MongoDB mode
    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        errors: [{ field: 'email', message: 'This email is already in use' }]
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken',
        errors: [{ field: 'username', message: 'This username is already in use' }]
      });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      fullName,
      username,
      phone: phone || '',
      country: country || ''
    });

    await user.save();
    console.log(`[Auth] User registered: ${email}`);

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          username: user.username,
          phone: user.phone,
          country: user.country,
          profileImage: user.profileImage
        },
        token
      }
    });

  } catch (error: any) {
    console.error('[Auth] Registration error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
        errors: [{ field, message: `This ${field} is already in use` }]
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = LoginSchema.safeParse(req.body);
    
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

    const { email, password } = validationResult.data;

    // Check if MongoDB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      // Demo mode
      console.log('[Auth] Login attempt in demo mode');
      
      const user = demoUsers.get(email.toLowerCase());
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          errors: [{ field: 'email', message: 'No account found with this email' }]
        });
      }

      // Check password (plain text in demo mode)
      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          errors: [{ field: 'password', message: 'Incorrect password' }]
        });
      }

      console.log(`[Auth] User logged in: ${email} (demo mode)`);

      // Generate token
      const token = generateToken(user.id, user.email);

      return res.status(200).json({
        success: true,
        message: 'Login successful (demo mode)',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            username: user.username,
            phone: user.phone,
            country: user.country,
            profileImage: user.profileImage
          },
          token
        }
      });
    }

    // MongoDB mode
    // Find user by email and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errors: [{ field: 'email', message: 'No account found with this email' }]
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errors: [{ field: 'password', message: 'Incorrect password' }]
      });
    }

    console.log(`[Auth] User logged in: ${email}`);

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          username: user.username,
          phone: user.phone,
          country: user.country,
          profileImage: user.profileImage
        },
        token
      }
    });

  } catch (error: any) {
    console.error('[Auth] Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile (requires authentication)
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    // Check if MongoDB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      // Demo mode
      const user = demoUsers.get(decoded.email.toLowerCase());
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            username: user.username,
            phone: user.phone,
            country: user.country,
            profileImage: user.profileImage
          }
        }
      });
    }

    // MongoDB mode
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          username: user.username,
          phone: user.phone,
          country: user.country,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });

  } catch (error: any) {
    console.error('[Auth] Token verification error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
});

export default router;
