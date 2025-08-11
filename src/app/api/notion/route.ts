import { NextRequest, NextResponse } from 'next/server';
import { NotionClient } from '@/lib/notion/client';

let notion: NotionClient;

try {
  notion = new NotionClient();
} catch (error) {
  console.error('Failed to initialize Notion client:', error);
  // Client will be undefined if initialization fails
}

export async function GET(request: NextRequest) {
  if (!notion) {
    return NextResponse.json(
      { error: 'Notion client not properly initialized. Check environment variables.' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const tradition = searchParams.get('tradition');
    const region = searchParams.get('region');

    switch (type) {
      case 'profile':
        if (!userId) {
          return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }
        const profile = await notion.getRitualProfile(userId);
        return NextResponse.json({ profile });

      case 'rituals':
        if (!tradition || !region) {
          return NextResponse.json({ error: 'tradition and region required' }, { status: 400 });
        }
        const rituals = await notion.getRituals(tradition, region);
        return NextResponse.json({ rituals });

      case 'festivals':
        const festivals = await notion.getFestivals();
        return NextResponse.json({ festivals });

      case 'mantra':
        const mantraId = searchParams.get('id');
        if (!mantraId) {
          return NextResponse.json({ error: 'mantra id required' }, { status: 400 });
        }
        const mantra = await notion.getMantra(mantraId);
        return NextResponse.json({ mantra });

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Notion API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!notion) {
    return NextResponse.json(
      { error: 'Notion client not properly initialized. Check environment variables.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'profile':
        const profileId = await notion.createRitualProfile(data);
        return NextResponse.json({ id: profileId });

      case 'page':
        const { databaseId, properties } = data;
        const pageId = await notion.writePage(databaseId, properties);
        return NextResponse.json({ id: pageId });

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Notion API error:', error);
    return NextResponse.json(
      { error: 'Failed to create data' },
      { status: 500 }
    );
  }
}