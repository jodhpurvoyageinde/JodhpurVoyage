import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const dynamicSeoPlugin = () => ({
  name: 'dynamic-seo-transform',
  async transformIndexHtml(html, ctx) {
    const rawUrl = ctx?.originalUrl || ctx?.path || '/';
    const cleanPath = rawUrl.split('?')[0].replace(/^\//, '').replace(/\/$/, '');

    // Skip root or assets/files
    if (!cleanPath || cleanPath.includes('.') || cleanPath.startsWith('assets') || cleanPath.startsWith('@')) {
      return html;
    }

    const slug = cleanPath.replace(/^tours\//, '').replace(/^destinations\//, '').replace(/^blog\//, '');
    let entityData = null;
    let entityType = 'tour';

    const apiBases = ['http://localhost:5000/api', 'http://127.0.0.1:5000/api', 'https://jodhpurvoyage.onrender.com/api'];

    for (const base of apiBases) {
      // 1. Try Custom SEO by path
      try {
        const seoRes = await fetch(`${base}/seo/by-path?path=${encodeURIComponent('/' + cleanPath)}`, {
          signal: AbortSignal.timeout(1000)
        });
        if (seoRes.ok) {
          const s = await seoRes.json();
          if (s && s.title) {
            entityData = s;
            entityType = 'customSeo';
            break;
          }
        }
      } catch (e) {}

      // 2. Try Tour Detail
      try {
        const tourRes = await fetch(`${base}/tours/${encodeURIComponent(slug)}`, {
          signal: AbortSignal.timeout(1000)
        });
        if (tourRes.ok) {
          const t = await tourRes.json();
          if (t && t.title) {
            entityData = t;
            entityType = 'tour';
            break;
          }
        }
      } catch (e) {}

      // 3. Try Destination Detail
      try {
        const destRes = await fetch(`${base}/destinations/${encodeURIComponent(slug)}`, {
          signal: AbortSignal.timeout(1000)
        });
        if (destRes.ok) {
          const d = await destRes.json();
          if (d && d.name) {
            entityData = d;
            entityType = 'destination';
            break;
          }
        }
      } catch (e) {}

      if (entityData) break;
    }

    if (entityData) {
      let title = '';
      let desc = '';
      let keywords = '';
      let image = entityData.image || '/images/dest-rajasthan.jpg';

      if (entityType === 'tour') {
        title = entityData.seoTitle || entityData.metaTitle || `${entityData.title} — Circuit Privé | Jodhpur Voyage`;
        desc = entityData.seoDescription || entityData.metaDescription || entityData.subtitle || `Découvrez le circuit ${entityData.title}`;
        keywords = entityData.seoKeywords || entityData.metaKeywords || `${entityData.title?.toLowerCase()}, circuit rajasthan, voyage sur mesure`;
      } else if (entityType === 'destination') {
        title = entityData.seoTitle || entityData.metaTitle || `Voyage au ${entityData.name} — Circuits sur Mesure | Jodhpur Voyage`;
        desc = entityData.seoDescription || entityData.metaDescription || entityData.shortDescription || `Voyage au ${entityData.name}`;
        keywords = entityData.seoKeywords || entityData.metaKeywords || `voyage ${entityData.name?.toLowerCase()}, circuit rajasthan`;
      } else {
        title = entityData.title || '';
        desc = entityData.description || '';
        keywords = entityData.keywords || '';
        if (entityData.ogImage) image = entityData.ogImage;
      }

      if (title) {
        html = html.replace(/<title>.*?<\/title>/is, `<title>${title}</title>`);
        html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/is, `<meta property="og:title" content="${title}" />`);
        html = html.replace(/<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/is, `<meta name="twitter:title" content="${title}" />`);
      }
      if (desc) {
        html = html.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/is, `<meta name="description" content="${desc}" />`);
        html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/is, `<meta property="og:description" content="${desc}" />`);
        html = html.replace(/<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/is, `<meta name="twitter:description" content="${desc}" />`);
      }
      if (keywords) {
        html = html.replace(/<meta\s+name=["']keywords["']\s+content=["'].*?["']\s*\/?>/is, `<meta name="keywords" content="${keywords}" />`);
      }
      if (image) {
        html = html.replace(/<meta\s+property=["']og:image["']\s+content=["'].*?["']\s*\/?>/is, `<meta property="og:image" content="${image}" />`);
        html = html.replace(/<meta\s+name=["']twitter:image["']\s+content=["'].*?["']\s*\/?>/is, `<meta name="twitter:image" content="${image}" />`);
      }
      html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/is, `<link rel="canonical" href="https://jodhpurvoyage.com/${cleanPath}" />`);
    }

    return html;
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dynamicSeoPlugin()]
});
