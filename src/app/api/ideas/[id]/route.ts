import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const idea = await prisma.idea.findUnique({
      where: { id },
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
        },
        keywords: true,
        communitySignals: true,
      },
    });

    if (!idea) {
      return NextResponse.json(
        { success: false, error: 'Idea not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: idea,
    });
  } catch (error) {
    console.error('GET /api/ideas/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch idea' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, problem, solution, targetMarket, revenueModel } = body;

    const idea = await prisma.idea.update({
      where: { id },
      data: {
        title,
        description,
        problem,
        solution,
        targetMarket,
        revenueModel,
        updatedAt: new Date(),
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
    });
  } catch (error) {
    console.error('PUT /api/ideas/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update idea' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.idea.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Idea deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/ideas/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete idea' },
      { status: 500 }
    );
  }
}