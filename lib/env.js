/**
 * Environment variable validation
 * Run this on app startup to ensure all required variables are set
 */

import { logger } from './utils';

const requiredEnvVars = {
  production: ['MONGODB_URI', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'],
  development: ['MONGODB_URI'],
};

export function validateEnvironment() {
  const env = process.env.NODE_ENV || 'development';
  const required = requiredEnvVars[env] || requiredEnvVars.development;
  const missing = [];

  required.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    const error = `Missing required environment variables: ${missing.join(', ')}`;
    logger.error(error);
    
    if (env === 'production') {
      throw new Error(error);
    } else {
      logger.warn('⚠️  Running in development mode with missing variables. Some features may not work.');
    }
  } else {
    logger.log('✅ Environment variables validated');
  }

  // Warn about cloud storage in production
  if (env === 'production') {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const hasCloudinary =
      Boolean(process.env.CLOUDINARY_URL) ||
      (cloudName && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) ||
      (cloudName && uploadPreset);

    if (!hasCloudinary) {
      logger.warn('⚠️  Cloudinary is not configured. File uploads will not work in production.');
    }
  }
}

