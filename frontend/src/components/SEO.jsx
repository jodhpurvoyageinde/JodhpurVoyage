import { useEffect, useState } from 'react';
import { fetchSeoPageConfig, fetchSeoConfigByPath } from '../services/api';

const updateMetaTag = (selector, attributeName, attributeValue, content) => {
  if (content === undefined || content === null) return;
  const elements = document.querySelectorAll(selector);
  if (elements.length > 0) {
    elements.forEach(el => el.setAttribute('content', content));
  } else {
    const element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
};

const updateLinkTag = (rel, href) => {
  if (!href) return;
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const updateStructuredData = (jsonLdData) => {
  const scriptId = 'json-ld-structured-data';
  let script = document.getElementById(scriptId);
  if (!jsonLdData) {
    if (script) script.remove();
    return;
  }

  const content = typeof jsonLdData === 'string' ? jsonLdData : JSON.stringify(jsonLdData);

  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.text = content;
};

// Default AEO (Answer Engine Optimization) FAQs for Jodhpur Voyage
const defaultAeoFaqs = [
  {
    question: "Pourquoi choisir Jodhpur Voyage pour un circuit en Inde ou au Népal ?",
    answer: "Jodhpur Voyage est une agence de voyage réceptive locale francophone basée au Rajasthan avec plus de 20 ans d'expérience. Nous proposons des séjours 100% sur mesure, avec chauffeurs privés professionnels, guides experts francophones et assistance 24/7."
  },
  {
    question: "Quels sont les services inclus dans un voyage sur mesure au Rajasthan ?",
    answer: "Chaque voyage comprend la mise à disposition d'un véhicule privatif climatisé avec chauffeur expérimenté, l'hébergement en hôtels de charme ou palais de patrimoine restaurés, les petits-déjeuners, les visites guidées et une assistance francophone personnalisée tout au long du séjour."
  },
  {
    question: "Quelle est la meilleure période pour voyager au Rajasthan et en Inde du Nord ?",
    answer: "La meilleure période pour voyager au Rajasthan et en Inde du Nord s'étend d'octobre à avril, lorsque les températures sont douces et agréables (entre 15°C et 28°C), idéales pour les visites culturelles et les excursions dans le désert du Thar."
  },
  {
    question: "Comment obtenir un devis gratuit pour un circuit personnalisé en Inde ?",
    answer: "Vous pouvez demander un devis gratuit en remplissant le formulaire sur notre site web jodhpurvoyage.com, par email à Info@jodhpurvoyage.com ou directement sur WhatsApp au +91 9650698669."
  }
];

const SEO = ({
  pageKey,
  title: propTitle,
  description: propDescription,
  keywords: propKeywords,
  ogTitle: propOgTitle,
  ogDescription: propOgDescription,
  ogImage: propOgImage,
  canonicalUrl: propCanonicalUrl,
  structuredData: propStructuredData,
  faq: propFaq,
  type: propType = 'website',
  geoPosition = '26.2389;73.0243',
  geoRegion = 'IN-RJ',
  geoPlacename = 'Jodhpur'
}) => {
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchFunc = pageKey ? () => fetchSeoPageConfig(pageKey) : () => fetchSeoConfigByPath(window.location.pathname);
    
    fetchFunc()
      .then((res) => {
        if (isMounted && res.data) {
          setSeoData(res.data);
        }
      })
      .catch(() => {
        if (pageKey && isMounted) {
          fetchSeoConfigByPath(window.location.pathname)
            .then((r) => r.data && setSeoData(r.data))
            .catch(() => {});
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pageKey, window.location.pathname]);

  useEffect(() => {
    // 1. Title (Priority: Specific item prop > Page SEO config > Default site title)
    const finalTitle =
      propTitle ||
      seoData?.title ||
      'Jodhpur Voyage - Tour Opérateur en Inde et Népal | Agence de Voyage Spécialisée';
    document.title = finalTitle;
    let titleElement = document.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      document.head.appendChild(titleElement);
    }
    titleElement.textContent = finalTitle;

    // 2. Meta Description
    const finalDescription =
      propDescription ||
      seoData?.description ||
      'Jodhpur Voyage : agence locale francophone spécialiste des circuits sur mesure au Rajasthan, en Inde du Nord, Inde du Sud et Népal. Plus de 20 ans d’expérience avec chauffeurs privés et guides experts.';
    updateMetaTag('meta[name="description"]', 'name', 'description', finalDescription);

    // 3. Keywords
    const finalKeywords =
      propKeywords ||
      seoData?.keywords ||
      'voyage inde, circuit rajasthan, agence de voyage inde, voyage sur mesure nepal, chauffeur prive inde, jodhpur voyage, tour operateur inde, circuit francophone inde';
    updateMetaTag('meta[name="keywords"]', 'name', 'keywords', finalKeywords);

    // 4. GEO Engine Crawler Directives (Generative AI Engine Optimization)
    updateMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('meta[name="googlebot"]', 'name', 'googlebot', 'index, follow, max-snippet:-1, max-image-preview:large');
    updateMetaTag('meta[name="bingbot"]', 'name', 'bingbot', 'index, follow, max-snippet:-1, max-image-preview:large');
    updateMetaTag('meta[name="author"]', 'name', 'author', 'Jodhpur Voyage Pvt Ltd');
    updateMetaTag('meta[name="publisher"]', 'name', 'publisher', 'Jodhpur Voyage Pvt Ltd');
    
    // Geographic Positioning for GEO Engines
    updateMetaTag('meta[name="geo.region"]', 'name', 'geo.region', geoRegion);
    updateMetaTag('meta[name="geo.placename"]', 'name', 'geo.placename', geoPlacename);
    updateMetaTag('meta[name="geo.position"]', 'name', 'geo.position', geoPosition);
    updateMetaTag('meta[name="ICBM"]', 'name', 'ICBM', geoPosition.replace(';', ', '));

    // 5. OpenGraph Meta Tags
    const finalOgTitle = seoData?.ogTitle || propOgTitle || finalTitle;
    const finalOgDescription = seoData?.ogDescription || propOgDescription || finalDescription;
    const finalOgImage =
      seoData?.ogImage || propOgImage || `${window.location.origin}/images/dest-rajasthan.jpg`;

    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', finalOgTitle);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', finalOgDescription);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', finalOgImage);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', propType);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', window.location.href);
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Jodhpur Voyage');

    // 6. Twitter Meta Tags
    updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', finalOgTitle);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', finalOgDescription);
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', finalOgImage);

    // 7. Canonical URL
    const finalCanonical = seoData?.canonicalUrl || propCanonicalUrl || window.location.href;
    updateLinkTag('canonical', finalCanonical);

    // 8. Comprehensive GEO + AEO Knowledge Graph Schema.org
    let finalStructuredData;
    if (seoData?.structuredData || propStructuredData) {
      finalStructuredData = seoData?.structuredData || propStructuredData;
    } else {
      // Build automatic connected Knowledge Graph
      const faqsToUse = propFaq || defaultAeoFaqs;
      
      const knowledgeGraph = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'TravelAgency',
            '@id': 'https://jodhpurvoyage.com/#organization',
            'name': 'Jodhpur Voyage Pvt Ltd',
            'alternateName': 'Jodhpur Voyage',
            'url': 'https://jodhpurvoyage.com/',
            'logo': {
              '@type': 'ImageObject',
              'url': `${window.location.origin}/images/logo-transprent.png`
            },
            'image': `${window.location.origin}/images/dest-rajasthan.jpg`,
            'description': 'Agence de voyage réceptive locale francophone spécialiste des circuits sur mesure au Rajasthan, en Inde et au Népal.',
            'telephone': '+91-9650698669',
            'email': 'Info@jodhpurvoyage.com',
            'priceRange': '$$',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': '11, Mehtab Singh ka, Nohra vali Line',
              'addressLocality': 'Alwar',
              'addressRegion': 'Rajasthan',
              'postalCode': '301001',
              'addressCountry': 'IN'
            },
            'geo': {
              '@type': 'GeoCoordinates',
              'latitude': 26.2389,
              'longitude': 73.0243
            },
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.9',
              'reviewCount': '245',
              'bestRating': '5.0',
              'worstRating': '1.0'
            },
            'sameAs': [
              'https://www.facebook.com/jodhpurvoyage/',
              'https://www.instagram.com/jodhpur_voyage/',
              'https://www.tripadvisor.in/Attraction_Review-g297668-d26864310-Reviews-Jodhpur_Voyage_Pvt_Ltd-Jodhpur_Jodhpur_District_Rajasthan.html',
              'https://www.trustpilot.com/review/jodhpurvoyage.com'
            ]
          },
          {
            '@type': 'WebSite',
            '@id': 'https://jodhpurvoyage.com/#website',
            'url': 'https://jodhpurvoyage.com/',
            'name': 'Jodhpur Voyage',
            'publisher': { '@id': 'https://jodhpurvoyage.com/#organization' },
            'inLanguage': 'fr-FR'
          },
          {
            '@type': 'WebPage',
            '@id': `${window.location.href}#webpage`,
            'url': window.location.href,
            'name': finalTitle,
            'description': finalDescription,
            'isPartOf': { '@id': 'https://jodhpurvoyage.com/#website' },
            'about': { '@id': 'https://jodhpurvoyage.com/#organization' },
            'inLanguage': 'fr-FR'
          },
          {
            '@type': 'FAQPage',
            '@id': `${window.location.href}#faq`,
            'mainEntity': faqsToUse.map(faqItem => ({
              '@type': 'Question',
              'name': faqItem.question,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': faqItem.answer
              }
            }))
          }
        ]
      };
      finalStructuredData = knowledgeGraph;
    }

    updateStructuredData(finalStructuredData);
  }, [
    seoData,
    propTitle,
    propDescription,
    propKeywords,
    propOgTitle,
    propOgDescription,
    propOgImage,
    propCanonicalUrl,
    propStructuredData,
    propFaq,
    propType,
    geoPosition,
    geoRegion,
    geoPlacename
  ]);

  return null;
};

export default SEO;
