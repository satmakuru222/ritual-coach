import { NextResponse } from 'next/server';
import { validateEnvironment } from '@/lib/config/env';

export async function GET() {
  try {
    const validation = validateEnvironment();
    
    return NextResponse.json({
      isValid: validation.isValid,
      status: {
        notion: {
          configured: !!process.env.NOTION_API_KEY && 
                     !!process.env.NOTION_DATABASE_RITUAL_PROFILES &&
                     !!process.env.NOTION_DATABASE_RITUALS &&
                     !!process.env.NOTION_DATABASE_FESTIVALS &&
                     !!process.env.NOTION_DATABASE_MANTRAS &&
                     !!process.env.NOTION_DATABASE_PRASADAM &&
                     !!process.env.NOTION_DATABASE_CHECKLISTS,
          hasValidKey: process.env.NOTION_API_KEY?.startsWith('ntn_') || false,
        },
        openai: {
          configured: !!process.env.OPENAI_API_KEY,
          hasValidKey: process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' && 
                      (process.env.OPENAI_API_KEY?.startsWith('sk-') || false),
        },
      },
      missingVars: validation.missingVars,
      errors: validation.errors,
    });
  } catch (error) {
    console.error('Environment status check failed:', error);
    return NextResponse.json(
      { 
        isValid: false, 
        error: 'Failed to check environment status',
        status: {
          notion: { configured: false, hasValidKey: false },
          openai: { configured: false, hasValidKey: false },
        },
      },
      { status: 500 }
    );
  }
}