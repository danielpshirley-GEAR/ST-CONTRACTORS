'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { siteConfig } from '@/config/site';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    projectType: 'House Extension',
    inquiryType: 'consultation',
    message: '',
    preferredContactMethod: 'phone',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit your enquiry.');
      }

      setStatus('success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setStatus('error');
      setErrorMessage(message);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen pb-20">
      {/* 1. HERO SECTION (LIGHT GREY) */}
      <section className="bg-slate-50 text-slate-900 pt-10 pb-16 sm:pb-20 border-b border-slate-200">
        <Container>
          <Breadcrumbs items={[{ name: 'Contact' }]} className="mb-8 text-slate-500" />

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-heading leading-tight">
              Let&apos;s discuss your construction project.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Whether you are ready to book a free on-site feasibility survey or simply researching costs and structural viability, our senior team is here to assist.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. CONTACT FORM & DIRECT INFO GRID (WHITE CARDS) */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Form Column */}
            <div className="lg:col-span-7">
              <Card className="p-8 sm:p-12 bg-white border-slate-200 shadow-xl rounded-3xl">
                <div aria-live="polite">
                  {status === 'success' ? (
                    <div className="text-center py-10 space-y-4">
                      <div className="h-16 w-16 bg-emerald-100 border border-emerald-300 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 font-heading">
                        Thank You! Your Enquiry Was Received.
                      </h2>
                      <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                        Our estimating team will review your project details and get in touch within 24&nbsp;business hours to arrange your consultation.
                      </p>
                      <div className="pt-6">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setStatus('idle');
                            setFormData({
                              name: '',
                              email: '',
                              phone: '',
                              postcode: '',
                              projectType: 'House Extension',
                              inquiryType: 'consultation',
                              message: '',
                              preferredContactMethod: 'phone',
                            });
                          }}
                          className="text-slate-800 border-slate-300 hover:bg-slate-50"
                        >
                          Submit Another Enquiry
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 font-heading">
                          Book a Consultation or Send a Message
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                          Fill in your details below and our senior project estimators will respond promptly.
                        </p>
                      </div>

                      {status === 'error' && (
                        <div
                          role="alert"
                          className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
                        >
                          <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="contact-name"
                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                          >
                            Your Full Name <span className="text-[#FFAA4F]">*</span>
                          </label>
                          <input
                            id="contact-name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. David Smith…"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none placeholder:text-slate-400 min-h-[44px]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="contact-phone"
                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                          >
                            Phone Number <span className="text-[#FFAA4F]">*</span>
                          </label>
                          <input
                            id="contact-phone"
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            required
                            autoComplete="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g. 07700 900123…"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none placeholder:text-slate-400 min-h-[44px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="contact-email"
                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                          >
                            Email Address <span className="text-[#FFAA4F]">*</span>
                          </label>
                          <input
                            id="contact-email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            spellCheck={false}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g. david@example.co.uk…"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none placeholder:text-slate-400 min-h-[44px]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="contact-postcode"
                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                          >
                            Project Postcode
                          </label>
                          <input
                            id="contact-postcode"
                            name="postcode"
                            type="text"
                            autoComplete="postal-code"
                            spellCheck={false}
                            value={formData.postcode}
                            onChange={handleChange}
                            placeholder="e.g. W5 2UP…"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none placeholder:text-slate-400 min-h-[44px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="contact-projectType"
                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                          >
                            Project Type
                          </label>
                          <select
                            id="contact-projectType"
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none min-h-[44px] cursor-pointer"
                          >
                            <option value="House Extension">House Extension</option>
                            <option value="Full Renovation">Full Renovation</option>
                            <option value="Kitchen Renovation">Kitchen Renovation</option>
                            <option value="Bathroom Renovation">Bathroom Renovation</option>
                            <option value="Loft Conversion">Loft Conversion</option>
                            <option value="Garden Room">Garden Room / Studio</option>
                            <option value="Garage Conversion">Garage Conversion</option>
                            <option value="Driveway & Paving">Driveway & Paving</option>
                            <option value="Landscaping">Landscaping</option>
                            <option value="New Build">New Build</option>
                            <option value="Other">Other Building Works</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="contact-inquiryType"
                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                          >
                            Enquiry Type
                          </label>
                          <select
                            id="contact-inquiryType"
                            name="inquiryType"
                            value={formData.inquiryType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none min-h-[44px] cursor-pointer"
                          >
                            <option value="consultation">Book Free Site Consultation</option>
                            <option value="callback">Request a Callback</option>
                            <option value="general">General Question</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-message"
                          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                        >
                          Tell Us About Your Project &amp; Requirements <span className="text-[#FFAA4F]">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          rows={4}
                          required
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us what you are planning, any architectural drawings you already have, and your expected timeline…"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none placeholder:text-slate-400"
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={status === 'loading'}
                        className="w-full justify-center text-sm font-bold bg-[#FFAA4F] hover:bg-[#F59E3F] text-slate-950 border border-[#E69335] shadow-md"
                        rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                      >
                        {status === 'loading' ? 'Submitting…' : 'Send Project Request'}
                      </Button>
                    </form>
                  )}
                </div>
              </Card>
            </div>

            {/* Direct Contact Info Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white text-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 space-y-6 shadow-xl">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FFAA4F]">
                    Direct Contact
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
                    Get in Touch
                  </h3>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-[#FFAA4F] flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="text-slate-400 block text-xs">Telephone</span>
                      <a
                        href={`tel:${siteConfig.company.phone.replace(/\s+/g, '')}`}
                        className="text-base font-bold text-slate-900 hover:text-amber-800 transition-colors"
                      >
                        020&nbsp;8123&nbsp;4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-[#FFAA4F] flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="text-slate-400 block text-xs">Email Enquiries</span>
                      <a
                        href={`mailto:${siteConfig.company.email}`}
                        className="text-slate-900 hover:text-amber-800 transition-colors font-semibold"
                      >
                        {siteConfig.company.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#FFAA4F] flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="text-slate-400 block text-xs">Head Office</span>
                      <span className="text-slate-700 font-medium">{siteConfig.company.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-[#FFAA4F] flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <span className="text-slate-400 block text-xs">Working Hours</span>
                      <span className="text-slate-700 font-medium">Mon&nbsp;–&nbsp;Fri: 8:00am&nbsp;–&nbsp;6:00pm</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2 font-medium">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                    <span>No obligation free site feasibility visit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                    <span>Itemized fixed-price proposal delivered within 5&nbsp;days</span>
                  </div>
                </div>
              </div>

              {/* Service Areas Summary Box */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 font-heading">
                  Core Service Locations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {siteConfig.serviceAreas.map((area) => (
                    <Badge key={area.slug} variant="slate" className="text-xs py-1 bg-slate-100 text-slate-800 border-slate-200">
                      {area.name} ({area.region})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
