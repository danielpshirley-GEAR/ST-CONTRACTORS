'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { Shield } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('apex_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('apex_cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('apex_cookie_consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-3xl">
          <div className="p-2 bg-slate-800 rounded-lg text-brand-400 flex-shrink-0 mt-0.5 sm:mt-0">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-100">
              We value your privacy and data transparency
            </p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              We use essential cookies to maintain security and optional analytical telemetry to optimize our construction planning tools and calculators. No personal details are sold or shared with external third-party advertisers.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDecline}
            className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs"
          >
            Essential Only
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAccept}
            className="text-xs font-semibold px-4"
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
};
