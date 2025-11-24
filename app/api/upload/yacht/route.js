import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Force dynamic rendering for file uploads
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, and WebP images are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for yacht images)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const filename = `yacht-${timestamp}${extension}`;
    
    // Check if we're on Vercel (read-only filesystem)
    const isVercel = process.env.VERCEL === '1';
    
    // On Vercel, the filesystem is read-only except /tmp
    // However, /tmp files are not publicly accessible via HTTP
    // For production, you MUST use cloud storage (S3, Cloudinary, Vercel Blob, etc.)
    if (isVercel) {
      return NextResponse.json(
        { 
          error: 'File uploads to filesystem are not supported on Vercel.',
          details: 'Please use a cloud storage service like AWS S3, Cloudinary, or Vercel Blob Storage for file uploads in production.',
          solution: 'Consider integrating cloud storage or use the upload feature only in local development.'
        },
        { status: 500 }
      );
    }
    
    // Local development - use public directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'yachts');
    const publicUrl = `/uploads/yachts/${filename}`;
    
    // Create directory if it doesn't exist
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (mkdirError) {
      console.error('Error creating directory:', mkdirError);
      // If directory creation fails, try to continue anyway
    }

    // Write file
    const filePath = path.join(uploadDir, filename);
    try {
      await writeFile(filePath, buffer);
    } catch (writeError) {
      console.error('Error writing file:', writeError);
      // Provide more specific error message
      if (writeError.code === 'EACCES' || writeError.code === 'EROFS') {
        return NextResponse.json(
          { 
            error: 'File system is read-only. Please use cloud storage (S3, Cloudinary, or Vercel Blob) for production deployments.',
            details: 'On Vercel, the filesystem is read-only. Consider using a cloud storage service.'
          },
          { status: 500 }
        );
      }
      throw writeError;
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      filePath: publicUrl
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    const errorMessage = error.message || 'Failed to upload file';
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.VERCEL ? 'Vercel filesystem is read-only. Use cloud storage for file uploads.' : undefined
      },
      { status: 500 }
    );
  }
}

