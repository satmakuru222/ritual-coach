import { NextRequest, NextResponse } from 'next/server';
import { RitualCoachAgent, AgentContext } from '@/lib/agents/claude-client';

let agent: RitualCoachAgent;

try {
  agent = new RitualCoachAgent();
} catch (error) {
  console.error('Failed to initialize Claude agent:', error);
  // Agent will be undefined if initialization fails
}

export async function POST(request: NextRequest) {
  if (!agent) {
    return NextResponse.json(
      { error: 'Claude agent not properly initialized. Check environment variables.' },
      { status: 500 }
    );
  }

  try {
    const { message, context, conversation_history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const agentContext: AgentContext = {
      tradition: context?.tradition,
      region: context?.region,
      language: context?.language || 'en',
      kid_mode: context?.kid_mode || false,
      user_level: context?.user_level || 'beginner',
    };

    const response = await agent.chat(message, agentContext, conversation_history);

    return NextResponse.json({
      success: true,
      response: response.content,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Agent API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!agent) {
    return NextResponse.json(
      { error: 'Claude agent not properly initialized. Check environment variables.' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const tradition = searchParams.get('tradition') || 'andhra_smarta';
    const region = searchParams.get('region') || 'south';
    const language = searchParams.get('language') || 'en';

    switch (type) {
      case 'daily_ritual':
        const dailyResponse = await agent.getDailyRitual(tradition, region, language);
        return NextResponse.json({
          success: true,
          type: 'daily_ritual',
          response: dailyResponse.content,
          usage: dailyResponse.usage,
        });

      case 'festival':
        const festivalName = searchParams.get('festival');
        const date = searchParams.get('date') || new Date().toISOString();
        
        if (!festivalName) {
          return NextResponse.json(
            { error: 'Festival name is required' },
            { status: 400 }
          );
        }

        const festivalResponse = await agent.getFestivalGuidance(festivalName, date, tradition, language);
        return NextResponse.json({
          success: true,
          type: 'festival',
          response: festivalResponse.content,
          usage: festivalResponse.usage,
        });

      case 'mantra':
        const mantraName = searchParams.get('mantra');
        const script = searchParams.get('script') || 'iast';
        
        if (!mantraName) {
          return NextResponse.json(
            { error: 'Mantra name is required' },
            { status: 400 }
          );
        }

        const mantraResponse = await agent.getMantraGuidance(mantraName, script, language);
        return NextResponse.json({
          success: true,
          type: 'mantra',
          response: mantraResponse.content,
          usage: mantraResponse.usage,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid type. Use: daily_ritual, festival, or mantra' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Agent GET error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}