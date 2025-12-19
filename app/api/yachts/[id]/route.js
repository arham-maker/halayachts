import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { logger, formatErrorResponse, isProduction } from '../../../../lib/utils';

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic';

/**
 * Generate a unique slug by appending numbers if duplicates exist (WordPress-style)
 * @param {string} baseSlug - The base slug to check
 * @param {object} db - MongoDB database instance
 * @param {string} excludeId - MongoDB ObjectId to exclude from check (for updates)
 * @returns {Promise<string>} - A unique slug
 */
async function generateUniqueSlug(baseSlug, db, excludeId = null) {
  let slug = baseSlug;
  let counter = 2;
  
  // Build query to check for existing slug
  const query = {
    $or: [
      { slug: slug },
      { slugs: { $in: [slug] } }
    ]
  };
  
  // Exclude current yacht if updating
  if (excludeId) {
    query._id = { $ne: new ObjectId(excludeId) };
  }
  
  // Check if the base slug exists
  let existingYacht = await db.collection('yachts').findOne(query);
  
  // If slug exists, try slug-2, slug-3, etc. until we find a unique one
  while (existingYacht) {
    slug = `${baseSlug}-${counter}`;
    const newQuery = {
      $or: [
        { slug: slug },
        { slugs: { $in: [slug] } }
      ]
    };
    if (excludeId) {
      newQuery._id = { $ne: new ObjectId(excludeId) };
    }
    existingYacht = await db.collection('yachts').findOne(newQuery);
    counter++;
  }
  
  return slug;
}

// GET - Fetch yacht by ID or slug
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const { connection } = await connectToDatabase();
    const db = connection.db || connection;
    
    let yacht = null;
    
    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (isValidObjectId) {
      // Try to find by MongoDB _id
      try {
        yacht = await db.collection('yachts').findOne({ 
          _id: new ObjectId(id) 
        });
      } catch (objectIdError) {
        // If ObjectId conversion fails, treat as slug
        // ObjectId conversion failed, treating as slug
      }
    }
    
    // If not found by ID, try to find by slug
    if (!yacht) {
      // Try to find by slug
      yacht = await db.collection('yachts').findOne({ slug: id });
      
      // If not found by slug, try slugs array
      if (!yacht) {
        yacht = await db.collection('yachts').findOne({ slugs: { $in: [id] } });
      }
    }

    if (!yacht) {
      return NextResponse.json(
        { error: 'Yacht not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(yacht);
  } catch (error) {
    logger.error('Error fetching yacht:', error);
    
    const errorResponse = isProduction()
      ? { error: 'Failed to fetch yacht' }
      : formatErrorResponse(error);

    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
}

// PUT - Update yacht
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    const { connection } = await connectToDatabase();
    const db = connection.db || connection;
    
    const updateData = await request.json();
    
    // Remove _id from update data if present
    delete updateData._id;
    
    // Check if yacht exists
    const existingYacht = await db.collection('yachts').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!existingYacht) {
      return NextResponse.json(
        { error: 'Yacht not found' },
        { status: 404 }
      );
    }

    // If slug is being updated, auto-generate unique slug if duplicate exists (WordPress-style)
    if (updateData.slug && updateData.slug !== existingYacht.slug) {
      updateData.slug = await generateUniqueSlug(updateData.slug, db, id);
    }

    // Update yacht
    const updatePayload = {
      ...updateData,
      updatedAt: new Date()
    };

    const result = await db.collection('yachts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatePayload }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update yacht' },
        { status: 500 }
      );
    }

    const updatedYacht = await db.collection('yachts').findOne({ 
      _id: new ObjectId(id) 
    });

    return NextResponse.json({
      success: true,
      message: 'Yacht updated successfully',
      yacht: updatedYacht
    });
  } catch (error) {
    logger.error('Error updating yacht:', error);
    
    const errorResponse = isProduction()
      ? { error: 'Failed to update yacht' }
      : formatErrorResponse(error);

    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
}

// DELETE - Delete yacht
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    const { connection } = await connectToDatabase();
    const db = connection.db || connection;
    
    // Check if yacht exists
    const existingYacht = await db.collection('yachts').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!existingYacht) {
      return NextResponse.json(
        { error: 'Yacht not found' },
        { status: 404 }
      );
    }

    // Delete yacht
    const result = await db.collection('yachts').deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete yacht' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Yacht deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting yacht:', error);
    
    const errorResponse = isProduction()
      ? { error: 'Failed to delete yacht' }
      : formatErrorResponse(error);

    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
}

