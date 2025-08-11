import Anthropic from '@anthropic-ai/sdk';

export interface AgentContext {
  tradition?: string;
  region?: string;
  language?: 'en' | 'te' | 'hi';
  kid_mode?: boolean;
  user_level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AgentResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ToolResult {
  name: string;
  result: string;
  success: boolean;
}

export class RitualCoachAgent {
  private anthropic: Anthropic;

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  private getSystemPrompt(context?: AgentContext): string {
    let systemPrompt = `You are a traditional Hindu Brahmin with extensive knowledge of:

**Vedic Traditions & Scriptures**: Deep understanding of Hindu rituals, mantras, and ceremonial procedures from authentic sources including Vedas, Āgamas, and Dharmaśāstras.

**Regional Variations**: Familiar with South & North Indian practices, especially Andhra Smārta and Vaishnava traditions, including specific regional customs and preferences.

**Sanskrit & Vernacular Languages**: Fluent in Sanskrit with proper IAST transliteration, Telugu, Hindi, and their cultural contexts.

**Panchāng & Timing**: Knowledge of auspicious timings, tithi, nakṣatra, lunar calendar, and festival calculations.

**Cultural Sensitivity**: Deep understanding of sacred practices, dietary restrictions, traditional protocols, and the spiritual significance of rituals.

**Core Principles**:
- Provide authentic, traditionally accurate guidance
- Respect cultural and regional variations
- Maintain reverence for sacred content
- Educate with proper context and spiritual significance
- Support both beginners and advanced practitioners
- Adapt responses for different experience levels

**Response Guidelines**:
- Always verify ritual steps against traditional sources
- Include proper Sanskrit terms with transliteration
- Explain spiritual significance, not just procedures
- Provide material lists and timing considerations
- Respect different family traditions while maintaining authenticity
- Use appropriate cultural context and sensitivity`;

    if (context) {
      if (context.tradition) {
        systemPrompt += `\n\n**Current Context**: User follows ${context.tradition} tradition`;
      }

      if (context.region) {
        systemPrompt += ` in ${context.region} Indian style`;
      }

      if (context.language && context.language !== 'en') {
        systemPrompt += `\n**Language**: Provide responses primarily in English with ${context.language} terms and explanations when appropriate`;
      }

      if (context.kid_mode) {
        systemPrompt += `\n**Kids Mode**: Adapt all responses for children - use simple language, engaging explanations, and age-appropriate spiritual concepts. Focus on fun, interactive elements while maintaining respect for traditions.`;
      }

      if (context.user_level) {
        systemPrompt += `\n**User Level**: ${context.user_level} practitioner - adjust complexity accordingly`;
      }
    }

    return systemPrompt;
  }

  async chat(
    message: string,
    context?: AgentContext,
    conversationHistory?: AgentMessage[]
  ): Promise<AgentResponse> {
    try {
      const systemPrompt = this.getSystemPrompt(context);
      
      const messages: Anthropic.MessageParam[] = [];
      
      // Add conversation history
      if (conversationHistory && conversationHistory.length > 0) {
        conversationHistory.forEach(msg => {
          messages.push({
            role: msg.role,
            content: msg.content,
          });
        });
      }

      // Add current message
      messages.push({
        role: 'user',
        content: message,
      });

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.3, // Lower temperature for more consistent, accurate responses
        system: systemPrompt,
        messages: messages,
      });

      const content = response.content
        .filter(block => block.type === 'text')
        .map(block => (block as Anthropic.TextBlock).text)
        .join('\n');

      return {
        content,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
        },
      };
    } catch (error) {
      console.error('Claude chat error:', error);
      throw new Error('Failed to get response from Claude agent');
    }
  }

  // Tool methods (simplified without Claude's tool calling for now)
  async createCalendarEvent(params: {
    title: string;
    start: string;
    duration: number;
    notes?: string;
    tradition?: string;
    type?: string;
  }): Promise<ToolResult> {
    // TODO: Implement actual calendar integration
    console.log('Creating calendar event:', params);
    
    return {
      name: 'create_calendar_event',
      result: 'Calendar event created successfully',
      success: true,
    };
  }

  async generatePDFGuide(params: {
    title: string;
    sections: any[];
    language: string;
    script?: string;
    tradition?: string;
  }): Promise<ToolResult> {
    // TODO: Implement actual PDF generation
    console.log('Generating PDF guide:', params);
    
    return {
      name: 'generate_pdf_guide',
      result: 'PDF guide generation initiated',
      success: true,
    };
  }

  async planFestival(params: {
    name: string;
    date: string;
    tradition: string;
    region?: string;
    language?: string;
    family_size?: number;
    kid_mode?: boolean;
  }): Promise<ToolResult> {
    // TODO: Implement festival planning logic
    console.log('Planning festival:', params);
    
    return {
      name: 'plan_festival',
      result: 'Festival plan created successfully',
      success: true,
    };
  }

  async getPanchangInfo(params: {
    date?: string;
    location?: string;
    timezone?: string;
  }): Promise<ToolResult> {
    // TODO: Integrate with actual Panchang API
    const panchang = {
      date: params.date || new Date().toISOString().split('T')[0],
      location: params.location || 'India',
      timezone: params.timezone || 'Asia/Kolkata',
      tithi: 'Dvādaśī',
      nakshatra: 'Anurādhā',
      yoga: 'Siddhi',
      karana: 'Viśṭi',
      sunrise: '06:15',
      sunset: '18:30',
      auspicious_times: {
        brahma_muhurta: '04:30 - 05:15',
        abhijit_muhurta: '11:45 - 12:30',
      },
    };

    console.log('Fetching panchang info:', panchang);
    
    return {
      name: 'get_panchang_info',
      result: JSON.stringify(panchang),
      success: true,
    };
  }

  // Specialized methods for common ritual guidance
  async getDailyRitual(tradition: string, region: string, language: string = 'en'): Promise<AgentResponse> {
    const message = `Please provide today's daily ritual (pūjā) guidance for ${tradition} tradition in ${region} Indian style. Include the complete step-by-step process, required materials, mantras, and estimated timing. Be specific about the traditional procedures and their spiritual significance.`;
    
    const context: AgentContext = {
      tradition,
      region: region as 'south' | 'north',
      language: language as 'en' | 'te' | 'hi',
    };

    return await this.chat(message, context);
  }

  async getFestivalGuidance(festivalName: string, date: string, tradition: string, language: string = 'en'): Promise<AgentResponse> {
    const message = `Please provide complete preparation guidance for ${festivalName} on ${date} following ${tradition} tradition. Include:

1. Preparation timeline (7 days before to festival day)
2. Required materials and shopping list
3. Traditional ritual procedures step-by-step
4. Authentic prasādam (offerings) recipes
5. Decoration ideas and setup
6. Spiritual significance and stories
7. Regional variations and family customs

Make it practical and authentic, suitable for home celebration.`;
    
    const context: AgentContext = {
      tradition,
      language: language as 'en' | 'te' | 'hi',
    };

    return await this.chat(message, context);
  }

  async getMantraGuidance(mantraName: string, script: string = 'iast', language: string = 'en'): Promise<AgentResponse> {
    const message = `Please provide comprehensive guidance for the ${mantraName} mantra including:

1. The complete mantra text in ${script} script
2. Proper pronunciation with phonetic guide
3. Word-by-word meaning and translation
4. Spiritual significance and benefits
5. Traditional chanting instructions (rhythm, repetitions)
6. Appropriate occasions and timing for recitation
7. Any specific requirements or preparations

Ensure authenticity and traditional accuracy.`;
    
    const context: AgentContext = {
      language: language as 'en' | 'te' | 'hi',
    };

    return await this.chat(message, context);
  }

  async getKidsGuidance(topic: string, age?: number, language: string = 'en'): Promise<AgentResponse> {
    const message = `Please explain ${topic} in a way that's perfect for children${age ? ` around ${age} years old` : ''}. Make it:

1. Simple and engaging
2. Interactive with activities they can do
3. Respectful of Hindu traditions
4. Fun but educational
5. Include stories or examples they can relate to
6. Suggest family activities or games

Keep the spiritual essence while making it child-friendly and enjoyable.`;
    
    const context: AgentContext = {
      language: language as 'en' | 'te' | 'hi',
      kid_mode: true,
    };

    return await this.chat(message, context);
  }
}