/**
 * GEOCODING & LOCAL SEO TYPES
 */

export interface GeocodedAddress {
  formattedAddress: string;
  borough: string;
  county: string;
  outwardPostcode: string;
  fullPostcode?: string;
  lat: number;
  lng: number;
  isInServiceArea: boolean;
  pricingMultiplier: number;
}
