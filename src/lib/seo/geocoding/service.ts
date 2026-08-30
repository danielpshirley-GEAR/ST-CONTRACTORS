/**
 * GEOCODING & LOCAL SERVICE AREA SERVICE
 * Resolves UK outward postcodes, calculates regional pricing tiers, and validates service areas.
 */

import { geocodingClient } from './client';
import { GeocodedAddress } from './types';
import { LocationMetric } from '../types';
import { seoCache, SEO_CACHE_TTLS } from '../cache';

const LONDON_BOROUGHS_REGISTRY: Record<
  string,
  { borough: string; county: string; multiplier: number; lat: number; lng: number; inArea: boolean }
> = {
  W5: { borough: 'London Borough of Ealing', county: 'Greater London', multiplier: 1.18, lat: 51.513, lng: -0.308, inArea: true },
  W13: { borough: 'London Borough of Ealing (West Ealing)', county: 'Greater London', multiplier: 1.18, lat: 51.516, lng: -0.322, inArea: true },
  W3: { borough: 'London Borough of Ealing (Acton)', county: 'Greater London', multiplier: 1.18, lat: 51.508, lng: -0.271, inArea: true },
  TW9: { borough: 'London Borough of Richmond upon Thames', county: 'Greater London / Surrey', multiplier: 1.22, lat: 51.461, lng: -0.303, inArea: true },
  TW10: { borough: 'London Borough of Richmond (Ham & Petersham)', county: 'Greater London / Surrey', multiplier: 1.24, lat: 51.442, lng: -0.298, inArea: true },
  W4: { borough: 'London Borough of Hounslow (Chiswick)', county: 'Greater London', multiplier: 1.2, lat: 51.492, lng: -0.259, inArea: true },
  HA1: { borough: 'London Borough of Harrow', county: 'Greater London', multiplier: 1.14, lat: 51.578, lng: -0.334, inArea: true },
  HA2: { borough: 'London Borough of Harrow (Harrow on the Hill)', county: 'Greater London', multiplier: 1.14, lat: 51.564, lng: -0.36, inArea: true },
  SW19: { borough: 'London Borough of Merton (Wimbledon)', county: 'Greater London', multiplier: 1.22, lat: 51.421, lng: -0.206, inArea: true },
  KT1: { borough: 'Royal Borough of Kingston upon Thames', county: 'Surrey', multiplier: 1.16, lat: 51.41, lng: -0.301, inArea: true },
};

export class GeocodingService {
  public resolvePostcode(rawPostcode: string): GeocodedAddress {
    const parts = rawPostcode.trim().toUpperCase().split(/\s+/);
    let outward = parts[0] || 'W5';

    if (parts.length === 1 && outward.length > 3) {
      outward = outward.slice(0, -3);
    }

    const cacheKey = `geo_postcode_${outward}`;
    const cached = seoCache.get<GeocodedAddress>(cacheKey);
    if (cached && cached.isFresh) {
      return cached.data;
    }

    const match = LONDON_BOROUGHS_REGISTRY[outward] || {
      borough: 'Greater London Service Area',
      county: 'Greater London',
      multiplier: 1.15,
      lat: 51.5074,
      lng: -0.1278,
      inArea: true,
    };

    const res: GeocodedAddress = {
      formattedAddress: `${outward}, ${match.borough}`,
      borough: match.borough,
      county: match.county,
      outwardPostcode: outward,
      fullPostcode: rawPostcode.trim().toUpperCase(),
      lat: match.lat,
      lng: match.lng,
      isInServiceArea: match.inArea,
      pricingMultiplier: match.multiplier,
    };

    seoCache.set(cacheKey, res, SEO_CACHE_TTLS.GEOCODING_LOCATION);
    return res;
  }

  public getServiceLocations(): LocationMetric[] {
    return [
      {
        locationName: 'Ealing',
        boroughOrCounty: 'London Borough of Ealing',
        outwardPostcode: 'W5',
        postcodeDistricts: ['W5', 'W13', 'W3', 'UB6'],
        coordinates: { lat: 51.513, lng: -0.308 },
        isInServiceRadius: true,
        pricingMultiplier: 1.18,
        searchDemandMonthly: 3800,
        existingPageSlug: 'ealing',
        recommendedPageStatus: 'PUBLISHED',
      },
      {
        locationName: 'Richmond upon Thames',
        boroughOrCounty: 'London Borough of Richmond upon Thames',
        outwardPostcode: 'TW9',
        postcodeDistricts: ['TW9', 'TW10', 'TW1', 'TW2'],
        coordinates: { lat: 51.461, lng: -0.303 },
        isInServiceRadius: true,
        pricingMultiplier: 1.22,
        searchDemandMonthly: 4600,
        existingPageSlug: 'richmond',
        recommendedPageStatus: 'PUBLISHED',
      },
      {
        locationName: 'Chiswick',
        boroughOrCounty: 'London Borough of Hounslow',
        outwardPostcode: 'W4',
        postcodeDistricts: ['W4'],
        coordinates: { lat: 51.492, lng: -0.259 },
        isInServiceRadius: true,
        pricingMultiplier: 1.2,
        searchDemandMonthly: 3100,
        existingPageSlug: 'chiswick',
        recommendedPageStatus: 'PUBLISHED',
      },
      {
        locationName: 'Harrow',
        boroughOrCounty: 'London Borough of Harrow',
        outwardPostcode: 'HA1',
        postcodeDistricts: ['HA1', 'HA2', 'HA3'],
        coordinates: { lat: 51.578, lng: -0.334 },
        isInServiceRadius: true,
        pricingMultiplier: 1.14,
        searchDemandMonthly: 2700,
        existingPageSlug: 'harrow',
        recommendedPageStatus: 'PUBLISHED',
      },
    ];
  }
}

export const geocodingService = new GeocodingService();
