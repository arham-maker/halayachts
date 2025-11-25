/**
 * Cloud Storage Service - Production-ready file upload handler
 * Supports multiple storage providers with fallback
 */

import { logger } from './utils';

/**
 * Storage provider interface
 */
class StorageProvider {
  async upload(file, path) {
    throw new Error('StorageProvider.upload() must be implemented');
  }

  async delete(path) {
    throw new Error('StorageProvider.delete() must be implemented');
  }

  getPublicUrl(path) {
    throw new Error('StorageProvider.getPublicUrl() must be implemented');
  }
}

/**
 * Local filesystem storage - stores files in public/uploads folder
 * Works in both development and production (on platforms that support filesystem writes)
 */
class LocalStorageProvider extends StorageProvider {
  constructor() {
    super();
    this.basePath = process.cwd();
  }

  async upload(file, path) {
    const fs = await import('fs/promises');
    const pathModule = await import('path');
    
    // Ensure path starts with 'uploads/' for proper folder structure
    const normalizedPath = path.startsWith('uploads/') ? path : `uploads/${path}`;
    const fullPath = pathModule.join(this.basePath, 'public', normalizedPath);
    const dir = pathModule.dirname(fullPath);
    
    try {
      // Create directory if it doesn't exist
      await fs.mkdir(dir, { recursive: true });
      
      // Convert file to buffer and write
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(fullPath, buffer);
      
      logger.log(`File uploaded to: ${normalizedPath}`);
      
      return { success: true, path: normalizedPath };
    } catch (error) {
      // Check if it's a filesystem permission error (e.g., on Vercel)
      if (error.code === 'EACCES' || error.code === 'EROFS') {
        throw new Error(
          'Filesystem is read-only. This platform does not support local file storage. ' +
          'Please configure Cloudinary or AWS S3 for file uploads.'
        );
      }
      throw error;
    }
  }

  async delete(path) {
    const fs = await import('fs/promises');
    const pathModule = await import('path');
    
    // Ensure path starts with 'uploads/'
    const normalizedPath = path.startsWith('uploads/') ? path : `uploads/${path}`;
    const fullPath = pathModule.join(this.basePath, 'public', normalizedPath);
    
    try {
      await fs.unlink(fullPath);
      return { success: true };
    } catch (error) {
      // File might not exist, ignore error
      if (error.code !== 'ENOENT') {
        logger.error('Error deleting file:', error);
      }
      return { success: true };
    }
  }

  getPublicUrl(path) {
    // Ensure path starts with '/' for public URL
    const normalizedPath = path.startsWith('uploads/') ? `/${path}` : path;
    return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  }
}

/**
 * Cloudinary storage provider
 */
class CloudinaryStorageProvider extends StorageProvider {
  constructor() {
    super();
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    this.apiKey = process.env.CLOUDINARY_API_KEY;
    this.apiSecret = process.env.CLOUDINARY_API_SECRET;
    this.folder = process.env.CLOUDINARY_FOLDER || 'hala-yachts';
  }

  async upload(file, path) {
    if (!this.cloudName || !this.apiKey || !this.apiSecret) {
      throw new Error('Cloudinary credentials not configured');
    }

    // Convert file to base64 for Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Use unsigned upload preset for simplicity (or signed upload with signature)
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'unsigned';
    
    const formData = new URLSearchParams();
    formData.append('file', dataUri);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', this.folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(error.error?.message || 'Cloudinary upload failed');
    }

    const data = await response.json();
    return {
      success: true,
      path: data.secure_url,
      publicId: data.public_id,
    };
  }

  async delete(path) {
    // Extract public_id from URL
    const publicId = path.split('/').pop().replace(/\.[^/.]+$/, '');
    
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await this.generateSignature(publicId, timestamp);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_id: publicId,
          signature,
          timestamp,
          api_key: this.apiKey,
        }),
      }
    );

    return { success: response.ok };
  }

  getPublicUrl(path) {
    return path; // Cloudinary returns full URL
  }

  async generateSignature(publicId, timestamp) {
    const crypto = await import('crypto');
    const message = `public_id=${publicId}&timestamp=${timestamp}${this.apiSecret}`;
    return crypto.createHash('sha1').update(message).digest('hex');
  }
}

/**
 * AWS S3 storage provider
 */
class S3StorageProvider extends StorageProvider {
  constructor() {
    super();
    // Note: For production, use AWS SDK v3
    // This is a placeholder structure
    this.bucket = process.env.AWS_S3_BUCKET;
    this.region = process.env.AWS_S3_REGION || 'us-east-1';
  }

  async upload(file, path) {
    // Implementation would use AWS SDK
    // For now, return error if not configured
    if (!this.bucket) {
      throw new Error('AWS S3 not configured');
    }
    throw new Error('S3 upload not implemented - use Cloudinary or local storage');
  }

  async delete(path) {
    throw new Error('S3 delete not implemented');
  }

  getPublicUrl(path) {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${path}`;
  }
}

/**
 * Get the appropriate storage provider
 */
export function getStorageProvider() {
  // Check for Cloudinary first (most common)
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY
  ) {
    logger.info('Using Cloudinary storage provider');
    return new CloudinaryStorageProvider();
  }

  // Check for S3
  if (process.env.AWS_S3_BUCKET) {
    logger.info('Using AWS S3 storage provider');
    return new S3StorageProvider();
  }

  // Fallback to local filesystem storage
  // Note: This works on platforms with writable filesystem (Railway, Render, traditional hosting)
  // On Vercel/Netlify (serverless), filesystem is read-only - use cloud storage instead
  logger.info('Using local filesystem storage (public/uploads folder)');
  return new LocalStorageProvider();
}

/**
 * Upload file using the configured storage provider
 * @param {File} file - The file to upload
 * @param {string} folder - Folder name ('yachts' or 'locations')
 * @returns {Promise<{success: boolean, filePath: string}>}
 */
export async function uploadFile(file, folder = 'uploads') {
  const provider = getStorageProvider();
  const timestamp = Date.now();
  const extension = file.name.split('.').pop() || 'jpg';
  
  // Create filename with proper folder structure
  // For local storage: uploads/yachts/timestamp.ext or uploads/locations/timestamp.ext
  const filename = `uploads/${folder}/${timestamp}.${extension}`;
  
  try {
    const result = await provider.upload(file, filename);
    return {
      success: true,
      filePath: provider.getPublicUrl(result.path),
      ...result,
    };
  } catch (error) {
    logger.error('File upload error:', error);
    throw error;
  }
}

/**
 * Delete file using the configured storage provider
 */
export async function deleteFile(path) {
  const provider = getStorageProvider();
  try {
    return await provider.delete(path);
  } catch (error) {
    logger.error('File delete error:', error);
    throw error;
  }
}

