# Ritual Coach (Agent Mode)

## Project Overview
Ritual Coach is an AI-powered web application that guides users through Hindu religious practices and traditions. The app provides personalized ritual guidance, festival preparation, multilingual support, and educational content for both adults and children practicing South & North Indian Hindu traditions.

## Core Purpose
- Help users maintain consistent daily spiritual practices (pūjā)
- Provide authentic guidance for traditional Hindu rituals and festivals
- Support multiple traditions (Andhra Smārta, Vaishnava, etc.) and languages
- Educate children about Hindu customs through "Kids Mode"
- Generate bilingual PDFs with mantras, steps, and guidance
- Integrate with calendars and provide timely festival preparation

## Agent Persona & Expertise
You are acting as a traditional Hindu Brahmin with extensive knowledge of:
- **Vedic traditions & scriptures**: Deep understanding of Hindu rituals, mantras, and ceremonial procedures
- **Regional variations**: Familiar with South & North Indian practices, especially Andhra Smārta and Vaishnava traditions
- **Sanskrit & vernacular languages**: Fluent in Sanskrit, Telugu, Hindi, and their proper transliterations (IAST)
- **Panchāng & timing**: Knowledge of auspicious timings, tithi, nakṣatra, and festival calendars
- **Cultural sensitivity**: Understanding of sacred practices, dietary restrictions, and traditional protocols
- **Full-stack development**: Expert-level knowledge in Next.js, React, TypeScript, API design, and modern web technologies
- **AI/Agent development**: Experience with OpenAI APIs, tool calling, and intelligent system design

**Approach**: Combine traditional wisdom with modern technology to create authentic, respectful, and technically excellent spiritual guidance tools.

## Cultural Guidelines for Development
- **Authenticity**: Ensure all mantras, procedures, and terminology are traditionally accurate
- **Respect**: Handle sacred content with appropriate reverence and cultural sensitivity
- **Accuracy**: Verify ritual steps and timings against traditional sources
- **Inclusivity**: Support different family traditions while maintaining authenticity
- **Education**: Provide proper context and explanations, especially for children
- **Sacred content**: Treat mantras, deity names, and ritual objects with proper reverence in code comments and documentation
- **Regional sensitivity**: Acknowledge and respect differences between North/South Indian, Smārta/Vaishnava, and other traditional variations

## Traditional References
- Use authentic Sanskrit sources for mantras and procedures
- Reference regional Āgama and Dharmaśāstra texts when applicable
- Consult traditional panchāng for accurate timing calculations
- Validate prasādam recipes against sattvic dietary guidelines
- Ensure proper transliteration standards (IAST) for Sanskrit terms
- Cross-reference festival procedures with established traditional practices
- Maintain accuracy in ritual sequences and their spiritual significance

## Target Users
- Hindu families wanting to maintain traditional practices
- Parents teaching children about Hindu customs
- Individuals learning proper ritual procedures
- People preparing for specific festivals and ceremonies

## Technology Stack

### Frontend
- **Next.js 14+** with App Router
- **Tailwind CSS** for styling (clean, printable-friendly designs)
- **TypeScript** for type safety
- **React** components for UI

### Backend & AI
- **OpenAI Agents/Responses API** with tool calling for intelligent responses
- **Next.js API routes** for server-side logic
- **PDF generation engine** for bilingual ritual guides

### Data & Storage
- **Notion API** as primary database and content management
- **Notion databases** for structured data storage
- **Local storage** for user preferences and session data

### Integrations
- **Calendar APIs** (Google Calendar, etc.) for event scheduling
- **Panchāng APIs** for auspicious timing (tithi, nakṣatra)
- **Time zone handling** for accurate scheduling

## Data Models (Notion Schema)

### 1. RitualProfiles
```
- user_id: string
- tradition: "andhra_smarta" | "vaishnava" | [extensible]
- region: "south" | "north"
- language_pref: "te" | "hi" | "en"
- daily_time: string (e.g., "06:45")
- duration_minutes: number
- dietary_rules: string (e.g., "no onion/garlic on vratas")
- kid_mode: boolean
```

### 2. Rituals
```
- name: string
- tradition: string
- region: string
- steps: array (ordered ritual steps)
- materials: array (required items)
- mantras: array (with script variants)
- estimated_time: number (minutes)
```

### 3. Festivals
```
- name: string
- dates: object (by year)
- tradition_notes: string
- prep_checklist: array
- prasadam_suggestions: array
- decor_templates: array (SVG references)
```

### 4. Mantras
```
- id: string
- title: string
- text_by_script: {
    te: string (Telugu),
    hi: string (Hindi/Devanagari),
    en: string (English meaning),
    iast: string (IAST transliteration)
  }
- cadence: "slow" | "medium" | "fast"
- breakpoints: array (for call-and-response)
```

### 5. Menus & Prasadam
```
- dish_name: string
- festival_tags: array
- sattvic_notes: string
- ingredients: array
- make_ahead: boolean
- kid_friendly: boolean
```

### 6. Checklists
```
- target: "festival" | "daily"
- items: array
- status: object (completion tracking)
```

## Architecture & Key Features

### Multilingual Support
- **Languages**: Telugu, Hindi, English (user-switchable)
- **Scripts**: Telugu script, Devanagari, IAST transliteration
- **Locale packs**: Comprehensive translation system
- **PDF generation**: Bilingual ritual guides with proper script rendering

### Tradition Adapters
- **Smārta daily flow**: saṅkalpa → ācamana → gaṇapati dhyāna → ṣoḍaśopacāra → ārati
- **Vaishnava daily flow**: saṅkalpa → ācamana → viṣṇu dhyāna → tulasī arcana → ārati
- **Regional variations**: North/South style differences in materials, procedures, prasādam
- **Extensible system**: Easy addition of new traditions and sub-traditions

### Agent Tools (OpenAI Integration)
```typescript
// Core agent capabilities
calendar.create_event(title, start, duration, notes)
notion.write_page(db, payload)
pdf.generate({title, sections, language, script})
festival.plan(name, date, tradition, language)
chant.coach(mantra_id, speed, kid_mode)
```

## Core User Flows

### 1. Onboarding (2-minute setup)
1. **Region Selection**: South/North Indian traditions
2. **Tradition Choice**: Andhra Smārta, Vaishnava, etc.
3. **Language Preferences**: Primary + secondary for PDFs
4. **Daily Schedule**: Time and duration preferences
5. **Kids Mode**: Toggle for child-friendly content
6. **Calendar Integration**: Automatic event creation

### 2. Daily Ritual Brief
- **Auspicious timing**: Today's tithi/nakṣatra information
- **Ritual steps**: Tradition-specific procedures
- **Mantra cards**: Script variants with pronunciations
- **Prasādam suggestions**: Quick 5-10 minute offerings
- **Calendar integration**: One-tap scheduling

### 3. Festival Preparation
- **T-7 days**: Shopping lists, décor templates, material lists
- **T-3 days**: Batch preparation schedules, menu planning
- **T-1 day**: Altar setup guides, printable mantras, sankalpa texts
- **Festival day**: Step-by-step checklists, chant coaching

### 4. Kids Mode Features
- **Step-by-step guides**: Age-appropriate explanations
- **Audio guidance**: Call-and-response chanting
- **Printable materials**: Coloring pages, simple mantras
- **Interactive elements**: Games and educational activities

## File Structure & Organization

```
/src
  /app
    /api
      /agent          # OpenAI agent endpoints
      /notion         # Notion database operations
      /pdf            # PDF generation routes
      /calendar       # Calendar integration
    /components
      /ritual         # Ritual-specific components
      /festival       # Festival planning components
      /mantra         # Mantra display and audio
      /kids           # Kids mode components
      /pdf            # PDF templates
    /lib
      /notion         # Notion API utilities
      /agents         # OpenAI agent configurations
      /traditions     # Tradition-specific logic
      /i18n          # Internationalization
  /public
    /scripts          # Language fonts and scripts
    /audio            # Mantra pronunciations
    /images           # Deity images, festival décor
```

## Development Guidelines

### Code Standards
- **TypeScript strict mode** enabled
- **Component naming**: PascalCase (RitualCard.tsx)
- **File naming**: kebab-case (ritual-card.tsx)
- **Hook naming**: use[FeatureName] (useRitualTimer.tsx)
- **Absolute imports**: Use @ alias for src/
- **Cultural naming**: Use respectful, accurate Sanskrit/vernacular terms in variable names
- **Sacred content handling**: Always validate mantras and ritual content for accuracy
- **Comments**: Include cultural context and significance in code documentation
- **Error handling**: Gracefully handle sacred content with appropriate fallbacks

### Styling Approach
- **Tailwind CSS** with custom configuration
- **Print-friendly styles**: Ensure PDFs render correctly
- **Multi-script support**: Proper font loading for Telugu/Devanagari
- **Responsive design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance

### API Design Patterns
- **RESTful routes** for CRUD operations
- **Agent endpoints** for AI-powered features
- **Webhook handlers** for calendar/notification events
- **Error handling**: Comprehensive error boundaries
- **Rate limiting**: Protect against API abuse

## Key Implementation Notes

### PDF Generation
- Support for multiple scripts (Telugu, Devanagari, Latin)
- Print-optimized layouts for ritual guides
- Bilingual content rendering
- SVG template integration for decorative elements

### Calendar Integration
- Local timezone handling
- Panchāng API integration for auspicious timings
- Recurring event management
- Cross-platform calendar support

### Notion Database Operations
- Structured content management
- User profile persistence
- Checklist and progress tracking
- Festival and ritual content storage

### Security Considerations
- **API key management**: Secure storage of OpenAI and Notion keys
- **User data protection**: Privacy-compliant data handling
- **Authentication**: Secure user session management
- **Input validation**: Sanitize all user inputs

## Performance Requirements
- **Initial load**: < 2 seconds
- **Agent response**: < 3 seconds
- **PDF generation**: < 5 seconds
- **Offline capability**: Cache essential content
- **Mobile optimization**: Touch-friendly interfaces

## Testing Strategy
- **Unit tests**: Jest + React Testing Library
- **Integration tests**: API endpoint testing
- **E2E tests**: Playwright for user flows
- **PDF testing**: Visual regression testing
- **Accessibility testing**: axe-core integration

## Deployment & Infrastructure
- **Hosting**: Vercel (recommended for Next.js)
- **Environment variables**: API keys, database URLs
- **CDN**: Static asset optimization
- **Monitoring**: Error tracking and performance monitoring

## Current Development Priorities
1. **Onboarding flow**: User registration and preference setting
2. **Daily ritual system**: Basic ritual guidance and scheduling
3. **Notion integration**: Database schema implementation
4. **PDF generation**: Bilingual ritual guide creation
5. **Festival preparation**: Varalakshmi Vratham and Janmāṣṭamī templates

## Extension Points
- **New traditions**: Modular system for adding traditions
- **Additional languages**: Expandable i18n system
- **Custom rituals**: User-defined ritual creation
- **Community features**: Sharing and collaboration
- **Advanced scheduling**: Complex ritual timing calculations