import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Hammer, Home, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function NotFound() {
  return (
    <div className="py-20 sm:py-32 bg-slate-950 text-slate-100 min-h-[70vh] flex items-center architectural-grid">
      <Container size="sm" className="text-center">
        <div className="h-16 w-16 bg-slate-900 border border-slate-800 text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Hammer className="h-8 w-8" aria-hidden="true" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-brand-400 block mb-2">
          Error 404
        </span>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-heading">
          Page Under Construction or Not Found
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-md mx-auto">
          The page you are looking for might have been moved, renamed, or is currently being built by our team.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            href="/"
            variant="primary"
            size="md"
            className="w-full sm:w-auto text-xs sm:text-sm font-semibold"
            leftIcon={<Home className="h-4 w-4" aria-hidden="true" />}
          >
            Back to Homepage
          </Button>

          <Button
            href="/services"
            variant="outline"
            size="md"
            className="w-full sm:w-auto text-xs sm:text-sm text-slate-200 border-slate-700 hover:bg-slate-800"
          >
            Browse Services
          </Button>

          <Button
            href="/contact"
            variant="ghost"
            size="md"
            className="w-full sm:w-auto text-xs sm:text-sm text-slate-300"
          >
            Contact Support
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-850 text-xs text-slate-400">
          Need immediate assistance? Call our direct team on{' '}
          <a
            href={`tel:${siteConfig.company.phone.replace(/\s+/g, '')}`}
            className="font-bold text-white hover:text-brand-400"
          >
            020&nbsp;8123&nbsp;4567
          </a>
        </div>
      </Container>
    </div>
  );
}
