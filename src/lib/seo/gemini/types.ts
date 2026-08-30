/**
 * GEMINI SEO ASSISTANT TYPES
 */

import { SearchIntent, ContentBriefOutput } from '../types';

export interface SeoInterpretationPromptInput {
  targetKeyword: string;
  searchIntent?: SearchIntent;
  monthlyVolume?: number;
  currentPosition?: number;
  existingUrls?: string[];
  competitorWeaknesses?: string[];
}
