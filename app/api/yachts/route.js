import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { logger, formatErrorResponse, isProduction } from '../../../lib/utils';

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic';

/**
 * Generate a unique slug by appending numbers if duplicates exist (WordPress-style)
 * @param {string} baseSlug - The base slug to check
 * @param {object} db - MongoDB database instance
 * @returns {Promise<string>} - A unique slug
 */
async function generateUniqueSlug(baseSlug, db) {
  let slug = baseSlug;
  let counter = 2;
  
  // Check if the base slug exists
  let existingYacht = await db.collection('yachts').findOne({ 
    $or: [
      { slug: slug },
      { slugs: { $in: [slug] } }
    ]
  });
  
  // If slug exists, try slug-2, slug-3, etc. until we find a unique one
  while (existingYacht) {
    slug = `${baseSlug}-${counter}`;
    existingYacht = await db.collection('yachts').findOne({ 
      $or: [
        { slug: slug },
        { slugs: { $in: [slug] } }
      ]
    });
    counter++;
  }
  
  return slug;
}

export async function GET() {
  try {
    const { connection } = await connectToDatabase();
    const db = connection.db || connection;
    
    const yachts = await db.collection('yachts').find({}).toArray();

    yachts.sort((a, b) => {
      const aLen = Number(a.length);
      const bLen = Number(b.length);
      const aVal = Number.isFinite(aLen) ? aLen : Number.POSITIVE_INFINITY;
      const bVal = Number.isFinite(bLen) ? bLen : Number.POSITIVE_INFINITY;
      return aVal - bVal;
    });
    
    logger.log(`Fetched ${yachts.length} yachts`);
    
    return NextResponse.json(yachts, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error) {
    logger.error('Error fetching yachts:', error);
    
    const errorResponse = isProduction()
      ? { error: 'Failed to fetch yachts' }
      : formatErrorResponse(error);

    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
}

// POST - Create new yacht
export async function POST(request) {
  try {
    const { connection } = await connectToDatabase();
    const db = connection.db || connection;
    
    const yachtData = await request.json();

    // Ensure slug is present - auto-generate from title if missing
    if (yachtData.title && !yachtData.slug) {
      yachtData.slug = yachtData.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    
    // Validation - required fields
    if (!yachtData.title || !yachtData.slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // Auto-generate unique slug if duplicate exists (WordPress-style)
    yachtData.slug = await generateUniqueSlug(yachtData.slug, db);

    // Auto-generate sequential numeric ID if not provided
    if (!yachtData.id) {
      const lastYacht = await db
        .collection('yachts')
        .find({}, { projection: { id: 1 } })
        .sort({ id: -1 })
        .limit(1)
        .toArray();

      const lastId = lastYacht[0]?.id ? Number(lastYacht[0].id) || 0 : 0;
      yachtData.id = lastId + 1;
    }

    // Default yacht_id to same as id if not provided
    if (!yachtData.yacht_id) {
      yachtData.yacht_id = yachtData.id;
    }

    // Create new yacht with timestamps
    const newYacht = {
      ...yachtData,
      status: yachtData.status || 'published', // Default to 'published' if not provided
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('yachts').insertOne(newYacht);
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Yacht created successfully',
        yacht: {
          _id: result.insertedId.toString(),
          ...newYacht
        }
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Error creating yacht:', error);
    
    const errorResponse = isProduction()
      ? { error: 'Failed to create yacht' }
      : formatErrorResponse(error);

    return NextResponse.json(
      errorResponse,
      { status: 500 }
    );
  }
}