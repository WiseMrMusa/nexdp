import { NextResponse } from 'next/server';
import { getAuthHeader } from '@/lib/auth';

// Mock template data
const MOCK_TEMPLATES = {
  '1': {
    id: '1',
    title: 'Business Card Template',
    description: 'A professional business card design with modern layout',
    elements: [
      {
        type: 'text',
        content: 'John Doe',
        position: { x: 100, y: 100 }
      },
      {
        type: 'text',
        content: 'CEO & Founder',
        position: { x: 100, y: 150 }
      },
      {
        type: 'image',
        url: 'https://picsum.photos/200',
        position: { x: 300, y: 100 }
      }
    ],
    createdAt: '2024-03-20T10:00:00Z',
    userId: '1',
    likes: 42,
    comments: [
      {
        id: '1',
        content: 'Great design!',
        userId: '2',
        username: 'jane',
        createdAt: '2024-03-20T11:00:00Z'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Social Media Post',
    description: 'Instagram post template with gradient background',
    elements: [
      {
        type: 'text',
        content: 'Summer Sale!',
        position: { x: 150, y: 150 }
      },
      {
        type: 'image',
        url: 'https://picsum.photos/400',
        position: { x: 200, y: 200 }
      }
    ],
    createdAt: '2024-03-19T15:30:00Z',
    userId: '1',
    likes: 28,
    comments: []
  }
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check authentication
  const authHeader = getAuthHeader();
  if (!authHeader.Authorization) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const templateId = params.id;
  const template = MOCK_TEMPLATES[templateId as keyof typeof MOCK_TEMPLATES];

  if (!template) {
    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(template);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check authentication
  const authHeader = getAuthHeader();
  if (!authHeader.Authorization) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const templateId = params.id;
  const template = MOCK_TEMPLATES[templateId as keyof typeof MOCK_TEMPLATES];

  if (!template) {
    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    );
  }

  try {
    const updates = await request.json();
    const updatedTemplate = {
      ...template,
      ...updates,
      id: templateId, // Ensure ID cannot be changed
      createdAt: template.createdAt, // Ensure creation date cannot be changed
      userId: template.userId // Ensure user ID cannot be changed
    };

    // In a real app, we would save this to a database
    MOCK_TEMPLATES[templateId as keyof typeof MOCK_TEMPLATES] = updatedTemplate;

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check authentication
  const authHeader = getAuthHeader();
  if (!authHeader.Authorization) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const templateId = params.id;
  const template = MOCK_TEMPLATES[templateId as keyof typeof MOCK_TEMPLATES];

  if (!template) {
    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    );
  }

  // In a real app, we would delete from a database
  delete MOCK_TEMPLATES[templateId as keyof typeof MOCK_TEMPLATES];

  return NextResponse.json(
    { message: 'Template deleted successfully' },
    { status: 200 }
  );
} 