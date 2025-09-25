import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // For now, we'll return all ideas without user authentication
    // TODO: Add authentication middleware
    const ideas = await prisma.idea.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            analyses: true,
            keywords: true,
            communitySignals: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await prisma.idea.count();

    return NextResponse.json({
      success: true,
      data: {
        ideas,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('GET /api/ideas error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, problem, solution, targetMarket, revenueModel, userId } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // For demo purposes, create a default user if none provided
    let finalUserId = userId;
    if (!finalUserId) {
      // Check if demo user exists, create if not
      let demoUser = await prisma.user.findUnique({
        where: { email: 'demo@upstart.com' },
      });

      if (!demoUser) {
        demoUser = await prisma.user.create({
          data: {
            email: 'demo@upstart.com',
            name: 'Demo User',
          },
        });
      }
      finalUserId = demoUser.id;
    }

    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        problem,
        solution,
        targetMarket,
        revenueModel,
        userId: finalUserId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: idea,
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/ideas error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create idea' },
      { status: 500 }
    );
  }
}