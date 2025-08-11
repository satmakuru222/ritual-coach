import OpenAI from 'openai';
import { AGENT_TOOLS, AGENT_CONFIG, getContextualPrompt } from './config';

export interface AgentContext {
  tradition?: string;
  region?: string;
  language?: 'en' | 'te' | 'hi';
  kid_mode?: boolean;
  user_level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AgentResponse {
  content: string;
  tool_calls?: any[];
  tool_results?: any[];
}

export class RitualCoachAgent {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(
    message: string,
    context?: AgentContext,
    conversationHistory?: AgentMessage[]
  ): Promise<AgentResponse> {
    try {
      const systemPrompt = getContextualPrompt(context);
      
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...(conversationHistory?.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })) || []),
        {
          role: 'user',
          content: message,
        },
      ];

      const completion = await this.openai.chat.completions.create({
        ...AGENT_CONFIG,
        messages,
        tools: AGENT_TOOLS,
        tool_choice: 'auto',
      });

      const response = completion.choices[0].message;

      if (response.tool_calls) {
        const toolResults = await this.executeToolCalls(response.tool_calls);
        
        return {
          content: response.content || '',
          tool_calls: response.tool_calls,
          tool_results: toolResults,
        };
      }

      return {
        content: response.content || '',
      };
    } catch (error) {
      console.error('Agent chat error:', error);
      throw new Error('Failed to get response from Ritual Coach agent');
    }
  }

  private async executeToolCalls(toolCalls: any[]): Promise<any[]> {
    const results = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const { name, arguments: args } = toolCall.function;
        const parsedArgs = JSON.parse(args);

        try {
          switch (name) {
            case 'create_calendar_event':
              return await this.createCalendarEvent(parsedArgs);
            
            case 'generate_pdf_guide':
              return await this.generatePDFGuide(parsedArgs);
            
            case 'plan_festival':
              return await this.planFestival(parsedArgs);
            
            case 'chant_coach':
              return await this.chantCoach(parsedArgs);
            
            case 'get_panchang_info':
              return await this.getPanchangInfo(parsedArgs);
            
            case 'save_user_preference':
              return await this.saveUserPreference(parsedArgs);
            
            default:
              return {
                tool_call_id: toolCall.id,
                result: `Unknown tool: ${name}`,
                success: false,
              };
          }
        } catch (error) {
          return {
            tool_call_id: toolCall.id,
            result: `Error executing ${name}: ${error}`,
            success: false,
          };
        }
      })
    );

    return results;
  }

  private async createCalendarEvent(args: any) {
    // TODO: Implement actual calendar integration
    const event = {
      title: args.title,
      start: args.start,
      duration: args.duration,
      notes: args.notes,
      tradition: args.tradition,
      type: args.type,
    };

    console.log('Creating calendar event:', event);
    
    return {
      result: 'Calendar event created successfully',
      event,
      success: true,
    };
  }

  private async generatePDFGuide(args: any) {
    // TODO: Implement actual PDF generation
    const guide = {
      title: args.title,
      sections: args.sections,
      language: args.language,
      script: args.script,
      tradition: args.tradition,
    };

    console.log('Generating PDF guide:', guide);
    
    return {
      result: 'PDF guide generation initiated',
      guide,
      success: true,
    };
  }

  private async planFestival(args: any) {
    // TODO: Implement festival planning logic
    const plan = {
      name: args.name,
      date: args.date,
      tradition: args.tradition,
      region: args.region,
      language: args.language,
      family_size: args.family_size,
      kid_mode: args.kid_mode,
    };

    console.log('Planning festival:', plan);
    
    return {
      result: 'Festival plan created successfully',
      plan,
      success: true,
    };
  }

  private async chantCoach(args: any) {
    // TODO: Implement mantra coaching logic
    const coaching = {
      mantra_id: args.mantra_id,
      speed: args.speed,
      kid_mode: args.kid_mode,
      language: args.language,
      script: args.script,
    };

    console.log('Providing chant coaching:', coaching);
    
    return {
      result: 'Chant coaching session prepared',
      coaching,
      success: true,
    };
  }

  private async getPanchangInfo(args: any) {
    // TODO: Integrate with actual Panchang API
    const panchang = {
      date: args.date || new Date().toISOString().split('T')[0],
      location: args.location || 'India',
      timezone: args.timezone || 'Asia/Kolkata',
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
      result: 'Panchang information retrieved',
      panchang,
      success: true,
    };
  }

  private async saveUserPreference(args: any) {
    // TODO: Implement actual user preference saving
    const preferences = {
      user_id: args.user_id,
      preferences: args.preferences,
    };

    console.log('Saving user preferences:', preferences);
    
    return {
      result: 'User preferences saved successfully',
      preferences,
      success: true,
    };
  }

  async getDailyRitual(tradition: string, region: string, language: string = 'en') {
    const message = `Please provide today's daily ritual (pūjā) guidance for ${tradition} tradition in ${region} Indian style. Include the complete step-by-step process, required materials, mantras, and estimated timing.`;
    
    const context: AgentContext = {
      tradition,
      region: region as 'south' | 'north',
      language: language as 'en' | 'te' | 'hi',
    };

    return await this.chat(message, context);
  }

  async getFestivalGuidance(festivalName: string, date: string, tradition: string, language: string = 'en') {
    const message = `Please provide complete preparation guidance for ${festivalName} on ${date} following ${tradition} tradition. Include preparation timeline, materials needed, ritual procedures, prasādam suggestions, and decoration ideas.`;
    
    const context: AgentContext = {
      tradition,
      language: language as 'en' | 'te' | 'hi',
    };

    return await this.chat(message, context);
  }

  async getMantraGuidance(mantraName: string, script: string = 'iast', language: string = 'en') {
    const message = `Please provide guidance for the ${mantraName} mantra including proper pronunciation, meaning, spiritual significance, and chanting instructions. Display the mantra in ${script} script.`;
    
    const context: AgentContext = {
      language: language as 'en' | 'te' | 'hi',
    };

    return await this.chat(message, context);
  }
}