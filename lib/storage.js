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
          'Please configure Cloudinary for file uploads.'
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
    const config = this.resolveConfig();
    this.cloudName = config.cloudName;
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.folder = config.folder;
    this.uploadPreset = config.uploadPreset;
  }

  resolveConfig() {
    if (process.env.CLOUDINARY_URL) {
      const url = new URL(process.env.CLOUDINARY_URL);
      // Cloudinary URL format: cloudinary://api_key:api_secret@cloud_name
      // The cloud_name is the hostname, not pathname
      return {
        cloudName: url.hostname || url.pathname.replace('/', ''),
        apiKey: url.username,
        apiSecret: url.password,
        folder: process.env.CLOUDINARY_FOLDER || process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || 'halayachts',
        uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      };
    }

    return {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
      folder: process.env.CLOUDINARY_FOLDER || process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || 'halayachts',
      uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    };
  }

  async upload(file, path) {
    // File size check (max 10MB for Cloudinary free tier)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      throw new Error(`File size too large. Maximum size is 10MB. Your file is ${(file.size / (1024*1024)).toFixed(2)}MB`);
    }

    if (!this.cloudName) {
      throw new Error('Cloudinary cloud name not configured');
    }

    if (!this.uploadPreset && (!this.apiKey || !this.apiSecret)) {
      throw new Error(
        'Cloudinary API credentials not configured. Set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET or provide an unsigned upload preset.'
      );
    }

    logger.log(`Uploading file to Cloudinary: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    // Convert file to base64 for Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const formData = new FormData();
    formData.append('file', dataUri);
    formData.append('folder', this.folder);

    if (this.uploadPreset) {
      formData.append('upload_preset', this.uploadPreset);
      logger.log(`Using upload preset: ${this.uploadPreset}`);
    } else {
      const timestamp = Math.round(Date.now() / 1000);
      const paramsToSign = { folder: this.folder, timestamp };
      const signature = await this.generateSignature(paramsToSign);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', this.apiKey);
      formData.append('signature', signature);
      logger.log('Using signed upload with API key');
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    
    // Fetch with timeout
    try {
      const response = await this.fetchWithTimeout(uploadUrl, {
        method: 'POST',
        body: formData,
      }, 30000); // 30 seconds timeout

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        throw new Error(error.error?.message || 'Cloudinary upload failed');
      }

      const data = await response.json();
      logger.log('Cloudinary upload successful:', {
        secure_url: data.secure_url,
        public_id: data.public_id,
        format: data.format
      });

      return {
        success: true,
        path: data.secure_url,
        publicId: data.public_id,
      };
    } catch (error) {
      logger.error('Cloudinary upload error:', error);
      
      // Check if timeout error
      if (error.name === 'AbortError' || error.message.includes('timeout') || error.message.includes('ECONNRESET')) {
        throw new Error('Cloudinary upload timeout. Please try again with a smaller file or check your internet connection.');
      }
      
      throw error;
    }
  }

  async delete(path) {
    // Extract public_id from URL
    const publicId = path.split('/').pop().replace(/\.[^/.]+$/, '');
    
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await this.generateSignature({ public_id: publicId, timestamp });

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

  async generateSignature(params) {
    const crypto = await import('crypto');
    const sortedKeys = Object.keys(params).sort();
    const message = sortedKeys.map((key) => `${key}=${params[key]}`).join('&');
    return crypto.createHash('sha1').update(`${message}${this.apiSecret}`).digest('hex');
  }

  // Helper function for fetch with timeout
  async fetchWithTimeout(url, options, timeout = 30000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}

/**
 * Get the appropriate storage provider
 */
export function getStorageProvider() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const hasCloudinary =
    Boolean(process.env.CLOUDINARY_URL) ||
    (cloudName && apiKey && apiSecret) ||
    (cloudName && Boolean(uploadPreset));

  if (hasCloudinary) {
    logger.info('Using Cloudinary storage provider');
    return new CloudinaryStorageProvider();
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