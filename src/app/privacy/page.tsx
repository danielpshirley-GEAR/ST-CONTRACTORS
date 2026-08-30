import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Mail } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy Policy | UK GDPR Compliance',
  description: `Learn how ${siteConfig.name} collects, protects, and processes your personal project information in accordance with the UK Data Protection Act 2018 and UK GDPR.`,
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'February 2026';

  return (
    <div className="py-16 sm:py-24 bg-white text-slate-900 text-left">
      <Container size="md">
        {/* Header */}
        <div className="space-y-4 pb-10 border-b border-slate-200">
          <Badge variant="brand" className="bg-amber-100 text-amber-900 border-amber-300 text-xs">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            UK Data Protection Act 2018 &amp; UK GDPR Compliant
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">
            Last Updated: {lastUpdated} • Data Controller: {siteConfig.company.name} (Reg No: {siteConfig.company.registrationNumber})
          </p>
        </div>

        {/* Content Sections */}
        <div className="mt-10 space-y-10 text-slate-700 text-sm leading-relaxed">
          {/* 1. Introduction */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <Eye className="h-5 w-5 text-amber-600" />
              1. Introduction &amp; Data Controller
            </h2>
            <p>
              {siteConfig.company.name} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting the privacy and personal data of homeowners and prospective clients who use our website, project calculators, interactive visualisers, and quotation planning tools.
            </p>
            <p>
              For the purposes of the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018, the Data Controller is <strong>{siteConfig.company.name}</strong>, registered in England &amp; Wales under company number <strong>{siteConfig.company.registrationNumber}</strong>, with registered office at {siteConfig.company.address}.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-600" />
              2. Information We Collect
            </h2>
            <p>We may collect and process the following categories of personal and project information:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Contact Information:</strong> Full name, email address, telephone number, and preferred consultation schedule.</li>
              <li><strong>Property &amp; Project Data:</strong> Property address, postcode, property era (e.g. Victorian, Edwardian), room dimensions, architectural requirements, estimated target budget, and statutory status (e.g. Permitted Development / Planning status).</li>
              <li><strong>Uploaded Documentation:</strong> Architectural drawings, floorplans, structural calculation summaries, and site photographs provided by you for preliminary surveyor evaluation.</li>
              <li><strong>Technical &amp; Telemetry Data:</strong> IP address, browser type, referral URLs, UTM marketing attribution parameters, and anonymised calculator session interaction logs.</li>
            </ul>
          </section>

          {/* 3. Lawful Bases for Processing */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-amber-600" />
              3. Lawful Bases for Processing Your Data
            </h2>
            <p>Under UK GDPR Article 6, we process your data under the following lawful bases:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Card className="p-4 bg-slate-50 border-slate-200 space-y-1">
                <strong className="text-slate-900 font-heading block">Contract Performance / Pre-Contract Steps</strong>
                <span className="text-xs text-slate-600">
                  To prepare construction cost estimates, conduct surveyor feasibility reviews, book site consultations, and draft formal construction tenders.
                </span>
              </Card>
              <Card className="p-4 bg-slate-50 border-slate-200 space-y-1">
                <strong className="text-slate-900 font-heading block">Legitimate Business Interests</strong>
                <span className="text-xs text-slate-600">
                  To refine our calculation pricing accuracy, monitor website performance, secure our systems against fraud, and measure organic marketing attribution.
                </span>
              </Card>
            </div>
          </section>

          {/* 4. How We Use and Share Data */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-600" />
              4. Data Sharing &amp; Third-Party Processors
            </h2>
            <p className="font-semibold text-slate-900">
              We do NOT sell, rent, or trade your personal information to third-party lead brokers, marketing agencies, or unaffiliated builders.
            </p>
            <p>
              Your data is processed strictly within our direct construction organisation and shared only with verified technical sub-processors essential for service delivery:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Cloud Infrastructure:</strong> Secure server hosting and encrypted database providers.</li>
              <li><strong>Communications:</strong> Transactional email delivery and SMS appointment notification dispatchers.</li>
              <li><strong>Professional Specialists:</strong> With your explicit consent, project drawings may be reviewed by our appointed structural engineers or Party Wall surveyors for formal quotation drafting.</li>
            </ul>
          </section>

          {/* 5. Data Retention & Security */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold font-heading text-slate-900">
              5. Data Retention &amp; Security Measures
            </h2>
            <p>
              We maintain robust technical and organisational security measures, including SSL/TLS encryption, secure database credentials, and role-based staff access controls.
            </p>
            <p>
              Project inquiries that do not proceed to a formal construction contract are securely retained for 24 months for quotation revalidation purposes before automated anonymisation or deletion. Active construction client records are maintained for 10 years in alignment with our structural insurance warranty obligations.
            </p>
          </section>

          {/* 6. Your Legal Rights */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold font-heading text-slate-900">
              6. Your Statutory Rights Under UK GDPR
            </h2>
            <p>You possess statutory rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600">
              <li><strong>Right of Access:</strong> Request a copy of the personal information we hold concerning you.</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete project records.</li>
              <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request deletion of your contact information where ongoing processing is no longer necessary.</li>
              <li><strong>Right to Restrict or Object:</strong> Restrict processing or object to direct communications.</li>
            </ul>
          </section>

          {/* 7. Contact Us & Data Protection Officer */}
          <section className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <h2 className="text-base font-bold font-heading text-slate-900 flex items-center gap-2">
              <Mail className="h-4 w-4 text-amber-600" />
              7. Contact Our Data Protection Team
            </h2>
            <p className="text-xs text-slate-600">
              If you have any questions regarding this Privacy Policy or wish to exercise your statutory rights, please contact our Data Compliance Team:
            </p>
            <div className="text-xs text-slate-800 space-y-1 font-mono">
              <div><strong>Email:</strong> {siteConfig.company.email}</div>
              <div><strong>Telephone:</strong> {siteConfig.company.phone}</div>
              <div><strong>Address:</strong> {siteConfig.company.address}</div>
            </div>
            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
              You also retain the statutory right to lodge a complaint with the UK supervisory authority, the Information Commissioner&apos;s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline">ico.org.uk</a>.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
