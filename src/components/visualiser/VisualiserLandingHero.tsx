'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  X,
  Ruler,
  MapPin,
  PoundSterling,
  Calendar,
  Layers,
  Check,
  HelpCircle,
} from 'lucide-react';
import { UploadedAssetCategory } from '@/types/visualiser-scope';

interface VisualiserLandingHeroProps {
  onGenerate: (data: {
    briefText: string;
    images: { url: string; filename: string; category?: UploadedAssetCategory }[];
    dimensions?: { length?: number; width?: number; height?: number };
    propertyType?: string;
    propertyEra?: string;
    location?: string;
    budget?: number;
    desiredCompletion?: string;
  }) => void;
  isLoading: boolean;
  initialPrompt?: string;
  initialLength?: number;
  initialWidth?: number;
}

export const SAMPLE_QUICK_BRIEFS = [
  {
    label: 'Open-Plan Kitchen Knockthrough',
    text: 'Knock down the wall between my kitchen and dining room, install a 3m quartz island, add black Crittall doors and underfloor heating.',
  },
  {
    label: 'Victorian Rear Extension',
    text: '5m x 3.8m rear extension on a Victorian terrace with frameless glass rooflight, aluminium bifold doors, and open-plan kitchen diner.',
  },
  {
    label: 'Luxury Master En-Suite Wet Room',
    text: 'Convert family bathroom into a walk-in wet room with Schlüter tanking, 1200x600 Italian porcelain tiles, and concealed brass shower.',
  },
  {
    label: 'Dormer Loft Conversion',
    text: 'Rear dormer loft conversion creating a master bedroom suite with private en-suite shower, Juliet balcony, and built-in eaves wardrobes.',
  },
];

export function VisualiserLandingHero({
  onGenerate,
  isLoading,
  initialPrompt = '',
  initialLength,
  initialWidth,
}: VisualiserLandingHeroProps) {
  const [briefText, setBriefText] = useState(initialPrompt);
  const [showOptionalInputs, setShowOptionalInputs] = useState(Boolean(initialLength || initialWidth));
  const [length, setLength] = useState<string>(initialLength ? String(initialLength) : '');
  const [width, setWidth] = useState<string>(initialWidth ? String(initialWidth) : '');
  const [propertyType, setPropertyType] = useState<string>('');
  const [propertyEra, setPropertyEra] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [images, setImages] = useState<{ url: string; filename: string; category: UploadedAssetCategory }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const filesArray = Array.from(e.target.files).filter((f) => allowedMimes.includes(f.type.toLowerCase()));
      filesArray.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setImages((prev) => [
              ...prev,
              {
                url: reader.result as string,
                filename: file.name,
                category: idx === 0 ? 'existing_condition' : 'inspiration',
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImageCategory = (index: number, newCat: UploadedAssetCategory) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, category: newCat } : img))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefText.trim() && images.length === 0) return;

    onGenerate({
      briefText: briefText.trim(),
      images,
      dimensions: {
        length: length ? parseFloat(length) : undefined,
        width: width ? parseFloat(width) : undefined,
      },
      propertyType: propertyType.trim() ? propertyType.trim() : undefined,
      propertyEra: propertyEra.trim() ? propertyEra.trim() : undefined,
      location: location.trim() ? location.trim() : undefined,
      budget: budget ? parseFloat(budget) : undefined,
    });
  };

  return (
    <div className="relative bg-slate-50 border-b border-slate-200 py-12 sm:py-16 overflow-hidden">
      <Container size="md">
        <div className="space-y-6 text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#FFAA4F]" />
            <span>AI Project Design &amp; Scope Builder</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-heading leading-tight">
            What are you planning?
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Describe your project in your own words. It can be one simple sentence or a complete architectural brief. Upload existing photos or plans for an instant scope, 3 finish tiers, and visual concept.
          </p>
        </div>

        {/* Master Input Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Natural Language Input */}
            <div className="space-y-2">
              <label htmlFor="brief-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Describe Your Project Brief
              </label>
              <textarea
                id="brief-input"
                rows={4}
                value={briefText}
                onChange={(e) => setBriefText(e.target.value)}
                placeholder="e.g. I want to knock the wall down between my kitchen and dining room, install a large island, move the sink to the rear wall, add herringbone flooring and 4m aluminium bifold doors..."
                className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 p-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-[#FFAA4F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFAA4F]/20 transition-all font-normal leading-relaxed resize-y"
              />
            </div>

            {/* Quick Sample Prompts */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Or try an example brief:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_QUICK_BRIEFS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setBriefText(sample.text)}
                    className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 transition-colors border border-slate-200/60 text-left"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload Area */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-[#FFAA4F]" />
                  <span>Upload Photos, Plans or Inspiration (Optional)</span>
                </span>
                <span className="text-[11px] text-slate-400">JPG, PNG, WebP up to 10MB</span>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-[#FFAA4F] hover:bg-amber-50/20 rounded-2xl p-6 text-center transition-all bg-slate-50/60 flex flex-col items-center justify-center gap-2"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="p-3 rounded-full bg-amber-100 text-amber-800">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800">
                  Click to upload existing room photos, architectural sketches, or inspiration
                </div>
                <div className="text-[11px] text-slate-500">
                  Our AI will analyze existing walls, openings, and architectural features
                </div>
              </div>

              {/* Uploaded Thumbnails with Classification */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 space-y-1.5 shadow-xs">
                      <div className="relative h-24 w-full rounded-xl overflow-hidden bg-slate-200">
                        <Image src={img.url} alt={img.filename} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                          aria-label="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{img.filename}</div>
                      <select
                        value={img.category}
                        onChange={(e) => updateImageCategory(idx, e.target.value as UploadedAssetCategory)}
                        className="w-full text-[10px] rounded-lg border border-slate-200 bg-white p-1 text-slate-800 font-semibold focus:outline-none"
                      >
                        <option value="existing_condition">Existing Condition</option>
                        <option value="inspiration">Inspiration Image</option>
                        <option value="floor_plan">Floor Plan</option>
                        <option value="drawing">Architectural Drawing</option>
                        <option value="material_reference">Material Reference</option>
                        <option value="unknown">Other / Unclassified</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Optional Extra Inputs Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowOptionalInputs(!showOptionalInputs)}
                className="text-xs font-bold text-[#FFAA4F] hover:text-amber-800 flex items-center gap-1 focus:outline-none"
              >
                <span>{showOptionalInputs ? '− Hide Optional Details' : '+ Add Dimensions, Location & Property Details (Optional)'}</span>
              </button>

              {showOptionalInputs && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Property Type</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:outline-none focus:border-[#FFAA4F]"
                    >
                      <option value="">Not specified</option>
                      <option value="terraced">Terraced</option>
                      <option value="semi_detached">Semi-detached</option>
                      <option value="detached">Detached</option>
                      <option value="flat">Flat</option>
                      <option value="maisonette">Maisonette</option>
                      <option value="bungalow">Bungalow</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Property Era</label>
                    <select
                      value={propertyEra}
                      onChange={(e) => setPropertyEra(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:outline-none focus:border-[#FFAA4F]"
                    >
                      <option value="">Not specified</option>
                      <option value="georgian">Georgian</option>
                      <option value="victorian">Victorian</option>
                      <option value="edwardian">Edwardian</option>
                      <option value="1930s">1930s</option>
                      <option value="post_war">Post-war</option>
                      <option value="modern">Modern</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Length (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 5.0"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:outline-none focus:border-[#FFAA4F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Width (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 3.8"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:outline-none focus:border-[#FFAA4F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Ealing, London"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:outline-none focus:border-[#FFAA4F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500">Target Budget (£)</label>
                    <input
                      type="number"
                      placeholder="e.g. 60000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:outline-none focus:border-[#FFAA4F]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading || (!briefText.trim() && images.length === 0)}
                className="w-full text-sm sm:text-base font-extrabold justify-center bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335] shadow-lg py-4"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                {isLoading ? 'Interpreting Project & Calculating Scope...' : 'Build My Project Plan & Scope'}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
