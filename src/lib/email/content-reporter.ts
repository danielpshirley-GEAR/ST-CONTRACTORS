import { siteConfig } from '@/config/site';

export interface ContentReportPayload {
  recipientEmail?: string;
  topic: string;
  targetKeyword: string;
  targetJobValue: string;
  seoArticle: {
    title: string;
    slug: string;
    summary: string;
    fullMarkdown: string;
  };
  royaltyFreeAssets: Array<{
    type: string;
    description: string;
    license: string;
    url: string;
  }>;
  videos: Array<{
    title: string;
    duration: string;
    angle: string;
    footageDirection: string;
    onScreenText: string;
    spokenScript: string;
    cta: string;
  }>;
  carousel: {
    title: string;
    slides: Array<{
      slideNumber: number;
      type: string;
      visualDirection: string;
      copy: string;
    }>;
  };
  socialCaptions: {
    instagramAndTiktok: string;
    linkedin: string;
    hashtags: string[];
  };
}

export function generateContentReportHtml(data: ContentReportPayload): string {
  const recipient = data.recipientEmail || process.env.NOTIFICATION_EMAIL || siteConfig.company.email;

  const assetsRows = data.royaltyFreeAssets
    .map(
      (a) => `
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px 12px; font-weight: bold; color: #FFAA4F;">${a.type}</td>
        <td style="padding: 10px 12px; color: #cbd5e1;">${a.description}</td>
        <td style="padding: 10px 12px; color: #10b981; font-size: 11px;">${a.license}</td>
        <td style="padding: 10px 12px;">
          <a href="${a.url}" target="_blank" style="color: #38bdf8; text-decoration: underline; font-size: 12px;">Download Clip →</a>
        </td>
      </tr>`
    )
    .join('');

  const videosHtml = data.videos
    .map(
      (v, idx) => `
      <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4 style="margin: 0; color: #FFAA4F; font-size: 15px; font-weight: 700;">🎥 Video ${idx + 1}: ${v.title} (${v.duration})</h4>
          <span style="background-color: #334155; color: #94a3b8; font-size: 10px; padding: 2px 8px; border-radius: 999px; font-weight: 600;">${v.angle}</span>
        </div>
        <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 8px;"><strong>Visual / Sourced B-Roll:</strong> ${v.footageDirection}</p>
        <div style="background-color: #1e293b; padding: 10px 14px; border-radius: 8px; margin-bottom: 8px;">
          <span style="color: #e2e8f0; font-size: 11px; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 2px;">On-Screen Text Overlay:</span>
          <span style="color: #f8fafc; font-size: 13px; font-weight: 600;">"${v.onScreenText}"</span>
        </div>
        <div style="background-color: #1e293b; padding: 10px 14px; border-radius: 8px; margin-bottom: 8px;">
          <span style="color: #e2e8f0; font-size: 11px; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 2px;">Spoken Voiceover / Script:</span>
          <span style="color: #f8fafc; font-size: 13px; font-style: italic;">"${v.spokenScript}"</span>
        </div>
        <div style="color: #10b981; font-size: 12px; font-weight: 600;">
          🎯 <strong>Call-to-Action:</strong> ${v.cta}
        </div>
      </div>`
    )
    .join('');

  const carouselHtml = data.carousel.slides
    .map(
      (s) => `
      <div style="background-color: #0f172a; border-left: 4px solid #FFAA4F; padding: 14px 16px; margin-bottom: 12px; border-radius: 0 8px 8px 0;">
        <div style="font-size: 11px; color: #FFAA4F; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">Slide ${s.slideNumber}: ${s.type}</div>
        <div style="color: #94a3b8; font-size: 11px; margin-bottom: 6px;"><em>Layout &amp; Visual: ${s.visualDirection}</em></div>
        <div style="color: #f8fafc; font-size: 13px; white-space: pre-line; line-height: 1.4;">${s.copy}</div>
      </div>`
    )
    .join('');

  const publishUrl = `${siteConfig.url}/admin/editorial/publish?slug=${encodeURIComponent(data.seoArticle.slug)}&title=${encodeURIComponent(data.seoArticle.title)}&category=cost-guides`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ST CONTRACTORS — SEO &amp; Social Content Report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; line-height: 1.5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020617; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; text-align: left;">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 28px 32px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-bottom: 2px solid #FFAA4F;">
              <table width="100%">
                <tr>
                  <td>
                    <span style="background-color: rgba(255, 170, 79, 0.15); color: #FFAA4F; border: 1px solid rgba(255, 170, 79, 0.3); font-size: 10px; font-weight: bold; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ST CONTRACTORS Automated Marketing Engine
                    </span>
                    <h1 style="margin: 12px 0 4px; font-size: 22px; font-weight: 800; color: #ffffff;">
                      New SEO Content &amp; 4-Video Social Pack
                    </h1>
                    <p style="margin: 0 0 16px; font-size: 13px; color: #94a3b8;">
                      Target Keyword: <strong style="color: #e2e8f0;">${data.targetKeyword}</strong> • Estimated Job Value: <strong style="color: #10b981;">${data.targetJobValue}</strong>
                    </p>

                    <!-- 1-CLICK PUBLISH HERO BUTTON -->
                    <div style="margin-top: 14px;">
                      <a href="${publishUrl}" target="_blank" style="display: inline-block; background-color: #FFAA4F; color: #020617; font-weight: 800; font-size: 14px; padding: 12px 24px; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 14px rgba(255, 170, 79, 0.35); text-align: center;">
                        🚀 1-Click Publish to Website →
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section 1: Executive Summary & SEO Guide -->
          <tr>
            <td style="padding: 28px 32px; border-bottom: 1px solid #1e293b;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h2 style="font-size: 16px; color: #FFAA4F; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
                  📄 1. New SEO Guide Ready for Publication
                </h2>
              </div>
              <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 18px;">
                <h3 style="margin: 0 0 8px; font-size: 17px; color: #f8fafc;">${data.seoArticle.title}</h3>
                <p style="margin: 0 0 14px; font-size: 13px; color: #94a3b8;">${data.seoArticle.summary}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; pt: 10px; border-top: 1px solid #1e293b; padding-top: 12px;">
                  <span style="font-size: 11px; color: #64748b;">Target URL: <code style="color: #38bdf8;">/cost-guides/${data.seoArticle.slug}</code></span>
                  <a href="${publishUrl}" target="_blank" style="display: inline-block; background-color: #FFAA4F; color: #020617; font-size: 12px; font-weight: bold; padding: 6px 14px; border-radius: 6px; text-decoration: none;">
                    Publish Now →
                  </a>
                </div>
              </div>
            </td>
          </tr>

          <!-- Section 2: Royalty-Free Commercial Media Sourcing -->
          <tr>
            <td style="padding: 28px 32px; border-bottom: 1px solid #1e293b;">
              <h2 style="font-size: 16px; color: #FFAA4F; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                🎥 2. Royalty-Free Commercial B-Roll &amp; UGC Assets
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 10px; font-size: 12px;">
                <thead>
                  <tr style="background-color: #1e293b; color: #94a3b8; font-size: 11px; text-transform: uppercase;">
                    <th style="padding: 10px 12px; text-align: left;">Asset</th>
                    <th style="padding: 10px 12px; text-align: left;">Description</th>
                    <th style="padding: 10px 12px; text-align: left;">License</th>
                    <th style="padding: 10px 12px; text-align: left;">Link</th>
                  </tr>
                </thead>
                <tbody>
                  ${assetsRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Section 3: 4-Video Scripts (Two 10s + Two 30s) -->
          <tr>
            <td style="padding: 28px 32px; border-bottom: 1px solid #1e293b;">
              <h2 style="font-size: 16px; color: #FFAA4F; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                🎬 3. Video Production Scripts (Two 10s &amp; Two 30s)
              </h2>
              ${videosHtml}
            </td>
          </tr>

          <!-- Section 4: 6-Slide Swipe Carousel Pack -->
          <tr>
            <td style="padding: 28px 32px; border-bottom: 1px solid #1e293b;">
              <h2 style="font-size: 16px; color: #FFAA4F; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                📱 4. 6-Slide High-Converting Swipe Carousel
              </h2>
              <p style="font-size: 12px; color: #94a3b8; margin: 0 0 14px;">Post this to Instagram Carousels and LinkedIn Document Slides:</p>
              ${carouselHtml}
            </td>
          </tr>

          <!-- Section 5: Multi-Platform Captions & Hashtags -->
          <tr>
            <td style="padding: 28px 32px; border-bottom: 1px solid #1e293b;">
              <h2 style="font-size: 16px; color: #FFAA4F; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                📝 5. Ready-to-Publish Captions &amp; Hashtags
              </h2>
              <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 16px; margin-bottom: 14px;">
                <span style="color: #FFAA4F; font-size: 11px; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 6px;">Instagram / TikTok Caption:</span>
                <pre style="margin: 0; font-family: inherit; font-size: 12px; color: #cbd5e1; white-space: pre-wrap; line-height: 1.5;">${data.socialCaptions.instagramAndTiktok}</pre>
              </div>
              <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 16px;">
                <span style="color: #FFAA4F; font-size: 11px; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 6px;">Target Hashtag Cluster:</span>
                <p style="margin: 0; font-size: 12px; color: #38bdf8; font-family: monospace;">${data.socialCaptions.hashtags.join(' ')}</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #020617; text-align: center; font-size: 11px; color: #64748b;">
              © ${new Date().getFullYear()} ${siteConfig.company.name} Automated Construction Acquisition Platform.<br>
              Delivering qualified residential projects across London and Surrey.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendContentReportEmail(payload: ContentReportPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const recipient = payload.recipientEmail || process.env.NOTIFICATION_EMAIL || siteConfig.company.email;
  const html = generateContentReportHtml(payload);
  const subject = `🚀 [Content Pack] ${payload.topic} — 4 Videos, Carousel & Sourced Footage`;

  // If Resend API Key is provided
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'ST CONTRACTORS <onboarding@resend.dev>',
          to: [recipient],
          subject: subject,
          html: html,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to dispatch email via Resend');
      }
      return { success: true, messageId: data.id };
    } catch (err: any) {
      console.error('[Email Dispatch] Resend error:', err);
      return { success: false, error: err.message };
    }
  }

  // Fallback: Log email structure cleanly for dev/staging
  console.log(`[Email Dispatcher] Mock sent to: ${recipient} | Subject: ${subject}`);
  return { success: true, messageId: `mock_${Date.now()}` };
}
