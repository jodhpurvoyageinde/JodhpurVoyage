import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  resolveCustomUrl,
  fetchTourBySlug,
  fetchDestinationBySlug,
  fetchBlogBySlug
} from '../services/api';

import Home from '../pages/Home';
import TourDetail from '../pages/TourDetail';
import DestinationDetail from '../pages/DestinationDetail';
import BlogDetail from '../pages/BlogDetail';
import Contact from '../pages/Contact';
import Destinations from '../pages/Destinations';
import Tours from '../pages/Tours';
import Blog from '../pages/Blog';
import VoyageSurMesure from '../pages/VoyageSurMesure';
import QuiNousSommes from '../pages/QuiNousSommes';
import NotreEquipe from '../pages/NotreEquipe';
import InfosPratiques from '../pages/InfosPratiques';
import Commentaires from '../pages/Commentaires';
import SEO from './SEO';

const CustomUrlResolver = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resolvedType, setResolvedType] = useState('loading');
  const [resolvedSlug, setResolvedSlug] = useState('');
  const [resolvedData, setResolvedData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const path = location.pathname;

    const resolveRoute = async () => {
      setResolvedType('loading');

      try {
        // 1. Try Resolving against backend CustomUrl rules
        const customRes = await resolveCustomUrl(path);
        if (isMounted && customRes && customRes.data && customRes.data.targetUrl) {
          const item = customRes.data;

          if (item.targetUrl) {
            let cleanTarget = item.targetUrl.trim().toLowerCase();
            const normalizedCurrent = path.toLowerCase().trim();

            // Ignore '#' targets or self-links without redirect loops
            if (cleanTarget === '#' || cleanTarget.startsWith('#')) {
              if (isMounted) setResolvedType('home');
              return;
            }

            // External URLs
            if (item.targetUrl.startsWith('http://') || item.targetUrl.startsWith('https://')) {
              window.location.replace(item.targetUrl);
              return;
            }

            // Package category or destination redirect /destination/{slug} or /destinations/{slug} -> /category/{slug}
            if (cleanTarget.startsWith('/destination/') || cleanTarget.startsWith('/destinations/')) {
              cleanTarget = cleanTarget.replace(/^\/destinations?\//i, '/category/');
              item.targetUrl = item.targetUrl.replace(/^\/destinations?\//i, '/category/');
            }

            // Handle 301 / 302 Redirects without self-looping
            if (cleanTarget !== normalizedCurrent && (item.redirectType === 301 || item.redirectType === 302)) {
              navigate(item.targetUrl, { replace: true });
              return;
            }

            // Direct internal page rewrites (HTTP 200)
            if (
              cleanTarget === '/contact' || 
              cleanTarget === '/contact-us' || 
              cleanTarget === '/contactus' || 
              cleanTarget === '/contact.html' || 
              cleanTarget === '/contact-us.html' || 
              cleanTarget === '/contactus.html' || 
              cleanTarget.includes('contact')
            ) {
              setResolvedType('contact');
              return;
            }
            if (cleanTarget === '/destinations' || cleanTarget === '/destinations.html') {
              setResolvedType('destinations_main');
              return;
            }
            if (cleanTarget === '/tours' || cleanTarget === '/circuits' || cleanTarget === '/tours.html') {
              setResolvedType('tours_main');
              return;
            }
            if (cleanTarget === '/blog' || cleanTarget === '/blog.html') {
              setResolvedType('blog_main');
              return;
            }
            if (cleanTarget === '/voyage-sur-mesure' || cleanTarget === '/custom-trip' || cleanTarget === '/voyage-sur-mesure.html') {
              setResolvedType('voyage_sur_mesure');
              return;
            }
            if (cleanTarget === '/qui-nous-sommes' || cleanTarget === '/qui-sommes-nous') {
              setResolvedType('qui_sommes_nous');
              return;
            }
            if (cleanTarget === '/notre-equipe') {
              setResolvedType('notre_equipe');
              return;
            }
            if (cleanTarget === '/infos-pratiques') {
              setResolvedType('infos_pratiques');
              return;
            }
            if (cleanTarget === '/commentaires' || cleanTarget === '/avis') {
              setResolvedType('commentaires');
              return;
            }

            // Entity detail pages
            if (item.targetType === 'tour') {
              const slugPart = item.targetUrl.replace(/^\/tours\//, '').replace(/^\//, '');
              const s = slugPart || item.targetId || path.replace(/^\//, '');
              try {
                const tourRes = await fetchTourBySlug(s);
                if (isMounted && tourRes && tourRes.data) {
                  setResolvedSlug(s);
                  setResolvedData(tourRes.data);
                  setResolvedType('tour');
                  return;
                }
              } catch (e) {}
              setResolvedSlug(s);
              setResolvedType('tour');
              return;
            }
            if (item.targetType === 'destination') {
              const slugPart = item.targetUrl.replace(/^\/(destinations|category)\//, '').replace(/^\//, '');
              const s = slugPart || item.targetId || path.replace(/^\//, '');
              try {
                const destRes = await fetchDestinationBySlug(s);
                if (isMounted && destRes && destRes.data) {
                  setResolvedSlug(s);
                  setResolvedData(destRes.data);
                  setResolvedType('destination');
                  return;
                }
              } catch (e) {}
              setResolvedSlug(s);
              setResolvedType('destination');
              return;
            }
            if (item.targetType === 'blog') {
              const slugPart = item.targetUrl.replace(/^\/blog\//, '').replace(/^\//, '');
              const s = slugPart || item.targetId || path.replace(/^\//, '');
              try {
                const blogRes = await fetchBlogBySlug(s);
                if (isMounted && blogRes && blogRes.data) {
                  setResolvedSlug(s);
                  setResolvedData(blogRes.data);
                  setResolvedType('blog');
                  return;
                }
              } catch (e) {}
              setResolvedSlug(s);
              setResolvedType('blog');
              return;
            }

            // Fallback navigate
            navigate(item.targetUrl, { replace: true });
            return;
          }
        }
      } catch (err) {
        // Custom URL not mapped explicitly in CustomUrl collection, try entity slug resolution
      }

      // 2. Try fetching entity directly by slug/customUrl
      const cleanSlug = path.replace(/^\/+/, '').trim();
      if (!cleanSlug) {
        if (isMounted) setResolvedType('home');
        return;
      }

      try {
        let tourRes = null;
        try {
          tourRes = await fetchTourBySlug(cleanSlug);
        } catch (e1) {
          const stripped = cleanSlug.replace(/^-+/, '');
          if (stripped && stripped !== cleanSlug) {
            try {
              tourRes = await fetchTourBySlug(stripped);
            } catch (e2) {}
          }
        }
        if (isMounted && tourRes && tourRes.data) {
          setResolvedSlug(cleanSlug);
          setResolvedData(tourRes.data);
          setResolvedType('tour');
          return;
        }
      } catch (err) {}

      try {
        const destRes = await fetchDestinationBySlug(cleanSlug);
        if (isMounted && destRes.data) {
          setResolvedSlug(cleanSlug);
          setResolvedData(destRes.data);
          setResolvedType('destination');
          return;
        }
      } catch (err) {}

      try {
        const blogRes = await fetchBlogBySlug(cleanSlug);
        if (isMounted && blogRes.data) {
          setResolvedSlug(cleanSlug);
          setResolvedData(blogRes.data);
          setResolvedType('blog');
          return;
        }
      } catch (err) {}

      // Fallback to Home if unmatched
      if (isMounted) setResolvedType('home');
    };

    resolveRoute();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate]);

  if (resolvedType === 'loading') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: 'var(--primary-color, #0D9488)' }}></i>
          <p style={{ marginTop: '16px', color: '#64748B', fontWeight: '500' }}>Chargement de la page...</p>
        </div>
      </div>
    );
  }

  if (resolvedType === 'contact') {
    return (
      <>
        <SEO />
        <Contact />
      </>
    );
  }

  if (resolvedType === 'destinations_main') {
    return (
      <>
        <SEO />
        <Destinations />
      </>
    );
  }

  if (resolvedType === 'tours_main') {
    return (
      <>
        <SEO />
        <Tours />
      </>
    );
  }

  if (resolvedType === 'blog_main') {
    return (
      <>
        <SEO />
        <Blog />
      </>
    );
  }

  if (resolvedType === 'voyage_sur_mesure') {
    return (
      <>
        <SEO />
        <VoyageSurMesure />
      </>
    );
  }

  if (resolvedType === 'qui_sommes_nous') {
    return (
      <>
        <SEO />
        <QuiNousSommes />
      </>
    );
  }

  if (resolvedType === 'notre_equipe') {
    return (
      <>
        <SEO />
        <NotreEquipe />
      </>
    );
  }

  if (resolvedType === 'infos_pratiques') {
    return (
      <>
        <SEO />
        <InfosPratiques />
      </>
    );
  }

  if (resolvedType === 'commentaires') {
    return (
      <>
        <SEO />
        <Commentaires />
      </>
    );
  }

  if (resolvedType === 'tour') {
    return <TourDetail overrideSlug={resolvedSlug} initialTour={resolvedData} />;
  }

  if (resolvedType === 'destination') {
    return <DestinationDetail overrideSlug={resolvedSlug} initialDestination={resolvedData} />;
  }

  if (resolvedType === 'blog') {
    return <BlogDetail overrideSlug={resolvedSlug} initialBlog={resolvedData} />;
  }

  return (
    <>
      <SEO />
      <Home />
    </>
  );
};

export default CustomUrlResolver;
