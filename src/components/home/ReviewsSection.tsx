import React from 'react';
import { Container } from '@/components/ui/Container';
import { ParallaxBlueprintSection } from '@/components/ui/ParallaxBlueprint';

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      quote:
        '“From first call to final sign-off, everything was smooth, on budget, professional and easy.”',
      author: 'Alistair & Clare',
      location: 'Richmond, TW9',
      source: 'Trustpilot',
    },
    {
      quote:
        '“I felt supported at each stage. Every member of the ST Contractors build team was exceptional and respectful.”',
      author: 'Mark & Sarah',
      location: 'Chiswick, W4',
      source: 'Trustpilot',
    },
    {
      quote:
        '“Peace of mind that everything was in hand, from structural calculations to bespoke kitchen finishes.”',
      author: 'Jonathan & Elena',
      location: 'Wimbledon, SW19',
      source: 'Trustpilot',
    },
  ];

  return (
    <ParallaxBlueprintSection
      variant="white"
      className="py-20 sm:py-28 border-b border-slate-200/80"
      aria-labelledby="reviews-heading"
    >
      <Container>
        {/* Clean 3-Column Reviews Grid (Matches Reference Layout on White) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 text-left">
          {reviews.map((review, idx) => (
            <div key={idx} className="flex flex-col justify-between space-y-6">
              {/* Review Quote */}
              <p className="text-lg sm:text-xl lg:text-2xl font-medium text-slate-900 leading-snug tracking-tight">
                {review.quote}
              </p>

              {/* Author & Trustpilot Rating */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="text-base font-bold text-slate-900 font-heading">
                    {review.author}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {review.location}
                  </div>
                </div>

                {/* Trustpilot Star Badge */}
                <div className="flex items-center gap-1.5 pt-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="h-4 w-4 bg-[#00b67a] text-white flex items-center justify-center text-[10px] font-bold rounded-xs"
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-600 ml-1">
                    Trustpilot
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </ParallaxBlueprintSection>
  );
};
