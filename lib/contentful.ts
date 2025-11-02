import { createClient } from 'contentful';

// Initialize Contentful client if credentials are provided
let contentfulClient: ReturnType<typeof createClient> | null = null;

if (process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN) {
  contentfulClient = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
  });
}

export interface LandingPageContent {
  title: string;
  description: string;
  sequelEventId: string;
  formFields?: {
    label: string;
    placeholder: string;
    type: string;
    required: boolean;
  }[];
}

/**
 * Fetches landing page content from Contentful
 * Falls back to hardcoded values if Contentful is not configured
 */
export async function getLandingPageContent(slug: string = 'default'): Promise<LandingPageContent> {
  // If Contentful is configured, fetch from CMS
  if (contentfulClient) {
    try {
      const entries = await contentfulClient.getEntries({
        content_type: 'landingPage',
        'fields.slug': slug,
        limit: 1,
      });

      if (entries.items.length > 0) {
        const page = entries.items[0].fields as any;
        return {
          title: page.title || 'Sequel with Custom Form Integration',
          description: page.description || 'Experience seamless event registration',
          sequelEventId: page.sequelEventId,
          formFields: page.formFields || [],
        };
      }
    } catch (error) {
      console.error('Error fetching from Contentful:', error);
      // Fall back to default values
    }
  }

  // Default content if Contentful is not configured or fetch fails
  return {
    title: 'Sequel with Custom Form Integration',
    description: 'Experience seamless event registration with a custom form',
    sequelEventId: 'f39bd025-3a7c-475c-8019-f8bb48b3d5ee', // Replace with your event ID
  };
}

/**
 * Example Contentful schema for reference:
 * 
 * Content Type: landingPage
 * - title (Short text)
 * - description (Long text)
 * - slug (Short text, unique)
 * - sequelEventId (Short text) - This is where you store the Sequel event ID from CMS
 */

