import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { logger, formatErrorResponse, isProduction } from '../../../lib/utils';

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { connection } = await connectToDatabase();
    const db = connection.db || connection;
    
    const yachts = await db.collection('yachts').find({}).toArray();
    
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

    // Check if yacht with same slug already exists
    const existingYacht = await db.collection('yachts').findOne({ 
      $or: [
        { slug: yachtData.slug },
        { slugs: { $in: [yachtData.slug] } }
      ]
    });
    
    if (existingYacht) {
      return NextResponse.json(
        { error: 'Yacht with this slug already exists' },
        { status: 409 }
      );
    }

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