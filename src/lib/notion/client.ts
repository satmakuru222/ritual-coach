import { Client } from '@notionhq/client';
import { RitualProfile, Ritual, Festival, Mantra, PrasadamDish, Checklist } from '@/types';

export class NotionClient {
  private client: Client;
  private databases: {
    ritualProfiles: string;
    rituals: string;
    festivals: string;
    mantras: string;
    prasadam: string;
    checklists: string;
  };

  constructor() {
    if (!process.env.NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY environment variable is required');
    }

    this.client = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    this.databases = {
      ritualProfiles: process.env.NOTION_DATABASE_RITUAL_PROFILES || '',
      rituals: process.env.NOTION_DATABASE_RITUALS || '',
      festivals: process.env.NOTION_DATABASE_FESTIVALS || '',
      mantras: process.env.NOTION_DATABASE_MANTRAS || '',
      prasadam: process.env.NOTION_DATABASE_PRASADAM || '',
      checklists: process.env.NOTION_DATABASE_CHECKLISTS || '',
    };

    // Validate that all required database IDs are present
    const missingDatabases = Object.entries(this.databases)
      .filter(([_, id]) => !id)
      .map(([name, _]) => name);

    if (missingDatabases.length > 0) {
      throw new Error(`Missing database IDs for: ${missingDatabases.join(', ')}`);
    }
  }

  async createRitualProfile(profile: RitualProfile): Promise<string> {
    const response = await this.client.pages.create({
      parent: { database_id: this.databases.ritualProfiles },
      properties: {
        user_id: { rich_text: [{ text: { content: profile.user_id } }] },
        tradition: { select: { name: profile.tradition } },
        region: { select: { name: profile.region } },
        language_pref: { select: { name: profile.language_pref } },
        daily_time: { rich_text: [{ text: { content: profile.daily_time } }] },
        duration_minutes: { number: profile.duration_minutes },
        dietary_rules: { rich_text: [{ text: { content: profile.dietary_rules } }] },
        kid_mode: { checkbox: profile.kid_mode },
      },
    });
    return response.id;
  }

  async getRitualProfile(userId: string): Promise<RitualProfile | null> {
    const response = await this.client.databases.query({
      database_id: this.databases.ritualProfiles,
      filter: {
        property: 'user_id',
        rich_text: {
          equals: userId,
        },
      },
    });

    if (response.results.length === 0) return null;

    const page = response.results[0];
    if (!('properties' in page)) return null;

    const properties = page.properties;
    
    return {
      user_id: (properties.user_id as any)?.rich_text?.[0]?.text?.content || userId,
      tradition: (properties.tradition as any)?.select?.name || 'andhra_smarta',
      region: (properties.region as any)?.select?.name || 'south',
      language_pref: (properties.language_pref as any)?.select?.name || 'en',
      daily_time: (properties.daily_time as any)?.rich_text?.[0]?.text?.content || '06:45',
      duration_minutes: (properties.duration_minutes as any)?.number || 30,
      dietary_rules: (properties.dietary_rules as any)?.rich_text?.[0]?.text?.content || '',
      kid_mode: (properties.kid_mode as any)?.checkbox || false,
    };
  }

  async getRituals(tradition: string, region: string): Promise<Ritual[]> {
    const response = await this.client.databases.query({
      database_id: this.databases.rituals,
      filter: {
        and: [
          { property: 'tradition', select: { equals: tradition } },
          { property: 'region', select: { equals: region } },
        ],
      },
    });

    return response.results.map((page: any) => ({
      id: page.id,
      name: page.properties.name?.title?.[0]?.text?.content || '',
      tradition: page.properties.tradition?.select?.name || tradition,
      region: page.properties.region?.select?.name || region,
      steps: JSON.parse(page.properties.steps?.rich_text?.[0]?.text?.content || '[]'),
      materials: JSON.parse(page.properties.materials?.rich_text?.[0]?.text?.content || '[]'),
      mantras: JSON.parse(page.properties.mantras?.rich_text?.[0]?.text?.content || '[]'),
      estimated_time: page.properties.estimated_time?.number || 30,
    }));
  }

  async getFestivals(): Promise<Festival[]> {
    const response = await this.client.databases.query({
      database_id: this.databases.festivals,
    });

    return response.results.map((page: any) => ({
      id: page.id,
      name: page.properties.name?.title?.[0]?.text?.content || '',
      dates: JSON.parse(page.properties.dates?.rich_text?.[0]?.text?.content || '{}'),
      tradition_notes: page.properties.tradition_notes?.rich_text?.[0]?.text?.content || '',
      prep_checklist: JSON.parse(page.properties.prep_checklist?.rich_text?.[0]?.text?.content || '[]'),
      prasadam_suggestions: JSON.parse(page.properties.prasadam_suggestions?.rich_text?.[0]?.text?.content || '[]'),
      decor_templates: JSON.parse(page.properties.decor_templates?.rich_text?.[0]?.text?.content || '[]'),
    }));
  }

  async getMantra(id: string): Promise<Mantra | null> {
    try {
      const response = await this.client.pages.retrieve({ page_id: id });
      if (!('properties' in response)) return null;

      const properties = response.properties;
      
      return {
        id: response.id,
        title: (properties.title as any)?.title?.[0]?.text?.content || '',
        text_by_script: JSON.parse((properties.text_by_script as any)?.rich_text?.[0]?.text?.content || '{}'),
        cadence: (properties.cadence as any)?.select?.name || 'medium',
        breakpoints: JSON.parse((properties.breakpoints as any)?.rich_text?.[0]?.text?.content || '[]'),
      };
    } catch (error) {
      console.error('Error fetching mantra:', error);
      return null;
    }
  }

  async writePage(databaseId: string, payload: any): Promise<string> {
    const response = await this.client.pages.create({
      parent: { database_id: databaseId },
      properties: payload,
    });
    return response.id;
  }
}