'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Upload, Image as ImageIcon, X, ArrowRight, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { UploadedAssetCategory } from '@/types/visualiser-scope';

interface VisualiserLandingInputProps {
  onStart: (data: {
    briefText: string;
    images: { url: string; filename: string; category?: UploadedAssetCategory }[];
  }) => void;
  isLoading: boolean;
  initialPrompt?: string;
}

const EXAMPLE_BRIEFS = [
  'Convert my garage into a home office.',
  'Extend the back of the house and make a new kitchen.',
  'Completely redo my bathroom.',
  'Turn the loft into a bedroom.',
  'Open the kitchen into the dining room.',
];

export function VisualiserLandingInput({
  onStart,
  isLoading,
  initialPrompt = '',
}: VisualiserLandingInputProps) {
  const [briefText, setBriefText] = useState(initialPrompt);
  const [images, setImages] = useState<{ url: string; filename: string; category: UploadedAssetCategory }[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const planInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, defaultCategory: UploadedAssetCategory) => {
    if (e.target.files) {
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const filesArray = Array.from(e.target.files).filter((f) => allowedMimes.includes(f.type.toLowerCase()));
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setImages((prev) => [
              ...prev,
              {
                url: reader.result as string,
                filename: file.name,
                category: defaultCategory,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefText.trim() && images.length === 0) return;
    onStart({
      briefText: briefText.trim(),
      images,
    });
  };

  return (
    <div className="relative bg-[#0B192C] text-white py-16 sm:py-24 border-b border-slate-800 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      <Container size="md">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[#FFAA4F] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#FFAA4F]" />
            <span>AI Project Consultation &amp; Plan Builder</span>
          </div>

          {/* Master Heading (Stage 1 — Simple Project Input) */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading text-white leading-tight">
              What would you like to do to your home?
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Describe it however you like. A sentence is enough.
            </p>
          </div>

          {/* Master Natural-Language Card */}
          <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl text-left space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <textarea
                  id="brief-input"
                  rows={4}
                  value={briefText}
                  onChange={(e) => setBriefText(e.target.value)}
                  placeholder="e.g. I want to convert my garage into a home office with a new doorway to the hallway, or I want to extend the back of the house with a modern open-plan kitchen..."
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#FFAA4F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFAA4F]/30 transition-all font-normal leading-relaxed resize-y"
                  autoFocus
                />
              </div>

              {/* Example Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick examples:
                </span>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_BRIEFS.map((example, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBriefText(example)}
                      className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-[#FFAA4F]/15 hover:text-slate-950 hover:border-[#FFAA4F]/50 transition-colors border border-slate-200/80 text-left"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Buttons: [Add Photos] [Add Plans] */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    ref={photoInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'existing_condition')}
                    className="hidden"
                  />
                  <input
                    ref={planInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'floor_plan')}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
                  >
                    <ImageIcon className="h-4 w-4 text-[#FFAA4F]" />
                    <span>Add Photos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => planInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
                  >
                    <Upload className="h-4 w-4 text-emerald-600" />
                    <span>Add Plans</span>
                  </button>

                  {images.length > 0 && (
                    <span className="text-xs text-slate-500 font-medium">
                      {images.length} {images.length === 1 ? 'file' : 'files'} attached
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400">
                  Photos &amp; sketches help us personalize your plan
                </div>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 p-1">
                      <div className="relative h-20 w-full rounded-lg overflow-hidden bg-slate-200">
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
                      <div className="text-[10px] text-slate-600 font-medium truncate pt-1">{img.filename}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Primary Action Button (Part 1 Benchmark) */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading || (!briefText.trim() && images.length === 0)}
                  className="w-full text-base font-extrabold justify-center bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335] shadow-xl py-4 rounded-2xl transition-all transform hover:-translate-y-0.5"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  {isLoading ? 'Analysing Your Project...' : 'START MY PROJECT'}
                </Button>
              </div>
            </form>
          </div>

          {/* Reassurance strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Free Consultation Planning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>No Form Filling Upfront</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>UK Building Regs Grounded</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
