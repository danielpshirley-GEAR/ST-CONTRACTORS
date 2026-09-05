/**
 * Adversarial Multimodal Test Image Fixtures
 * Complies with Phase 7D Specification (Items 16, 17).
 * 
 * Fixtures designed to test that the vision analysis models inspect raw pixel content
 * rather than relying on deceptive or mislabeled file metadata.
 */

import {
  BATHROOM_IMAGE_DATA_URI,
  FLOOR_PLAN_IMAGE_DATA_URI,
} from './test-images';

/**
 * Mislabeled Bathroom Photograph named 'kitchen.jpg' (Item 16)
 * Used to verify the vision model classifies by pixel features, not filename.
 */
export const ADVERSARIAL_BATHROOM_AS_KITCHEN = {
  filename: 'kitchen.jpg',
  dataUri: BATHROOM_IMAGE_DATA_URI,
  expectedPixelClassification: 'bathroom' as const,
  prohibitedClassification: 'kitchen' as const,
};

/**
 * Mislabeled Architectural Floor Plan named 'photo.jpg' (Item 17)
 * Used to verify the vision model detects vector lines/dimensions as a drawing/floorplan.
 */
export const ADVERSARIAL_FLOORPLAN_AS_PHOTO = {
  filename: 'photo.jpg',
  dataUri: FLOOR_PLAN_IMAGE_DATA_URI,
  expectedPixelClassification: 'floor_plan' as const,
};
