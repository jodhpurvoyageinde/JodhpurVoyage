import React, { useState, useEffect } from 'react';

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Scroll to top button */}
      <button
        type="button"
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Retour en haut de page"
        title="Retour en haut"
      >
        <i className="fas fa-chevron-up"></i>
      </button>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/919650698869"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        aria-label="Contactez-nous sur WhatsApp"
        title="Discuter sur WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
        <span className="whatsapp-tooltip">WhatsApp Instant</span>
      </a>
    </>
  );
};

export default FloatingActions;
