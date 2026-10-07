import React, { useState, useEffect, useRef } from 'react';

const getTourImages = (tour) => {
  if (!tour) return ['/images/dest-rajasthan.jpg'];
  const list = [];

  // 1. Gather images from tour.gallery
  if (Array.isArray(tour.gallery) && tour.gallery.length > 0) {
    tour.gallery.forEach((img) => {
      if (typeof img === 'string' && img.trim()) list.push(img.trim());
      else if (img && typeof img.url === 'string') list.push(img.url.trim());
    });
  }

  // 2. Add main tour image at front if not present
  if (tour.image && !list.includes(tour.image)) {
    list.unshift(tour.image);
  }

  // 3. Supplement with curated high-definition photos from website library based on destination
  const contextText = `${tour.category || ''} ${tour.location || ''} ${tour.title || ''} ${(tour.cities || []).map(c => c.name || '').join(' ')}`.toLowerCase();

  const curatedLibrary = [];
  if (contextText.includes('ladakh') || contextText.includes('tibet') || contextText.includes('leh') || contextText.includes('himalaya')) {
    curatedLibrary.push(
      '/images/dest-ladakh.jpg',
      '/images/dest-himachal.jpg',
      '/images/image-9.jpg',
      '/images/dest-nepal.jpg',
      '/images/travel-to-india.jpg'
    );
  } else if (contextText.includes('kerala') || contextText.includes('sud') || contextText.includes('alleppey') || contextText.includes('munnar')) {
    curatedLibrary.push(
      '/images/dest-kerala.jpg',
      '/images/dest-karnataka.jpg',
      '/images/image-12.jpg',
      '/images/dest-goa.jpg'
    );
  } else if (contextText.includes('varanasi') || contextText.includes('bénarès') || contextText.includes('benares') || contextText.includes('gange')) {
    curatedLibrary.push(
      '/images/dest-varanasi.jpg',
      '/images/dest-tajmahal.jpg',
      '/images/image-6.jpg',
      '/images/image-8.jpg'
    );
  } else if (contextText.includes('gujarat') || contextText.includes('kutch')) {
    curatedLibrary.push(
      '/images/dest-gujarat.jpg',
      '/images/dest-rajasthan.jpg',
      '/images/Voyage-Jaisalmer.jpg'
    );
  } else {
    // Default Rajasthan & North India circuits
    curatedLibrary.push(
      '/images/dest-rajasthan.jpg',
      '/images/dest-tajmahal.jpg',
      '/images/dest-jodhpur.jpg',
      '/images/jaipur-travel.jpg',
      '/images/Voyage-Jaisalmer.jpg',
      '/images/image-7.jpg'
    );
  }

  curatedLibrary.forEach((img) => {
    if (!list.includes(img) && list.length < 6) {
      list.push(img);
    }
  });

  return list.length > 0 ? list : ['/images/dest-rajasthan.jpg'];
};

const TourImageSlider = ({ tour }) => {
  const images = getTourImages(tour);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-play slider every 4.5 seconds
  useEffect(() => {
    if (images.length <= 1 || isPaused || isLightboxOpen) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [images.length, isPaused, isLightboxOpen]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  const activeImage = images[currentIndex] || images[0];

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '16px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.06))',
        border: '1px solid #E2E8F0',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Slide Viewport */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '420px',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
          cursor: 'pointer'
        }}
        onClick={() => setIsLightboxOpen(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          key={currentIndex}
          src={activeImage}
          alt={tour?.title || 'Circuit'}
          onError={(e) => {
            e.currentTarget.src = '/images/dest-rajasthan.jpg';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease, opacity 0.3s ease',
            display: 'block'
          }}
        />


        {/* Counter Badge */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            color: '#ffffff',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            zIndex: 3
          }}
        >
          <i className="fas fa-camera"></i> {currentIndex + 1} / {images.length}
        </div>

        {/* Fullscreen icon button */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            color: '#ffffff',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            zIndex: 3,
            transition: 'background 0.2s'
          }}
          title="Agrandir les photos"
        >
          <i className="fas fa-expand-alt"></i>
        </div>


        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              style={{
                position: 'absolute',
                top: '50%',
                left: '12px',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(6px)',
                color: '#1E293B',
                border: 'none',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                transition: 'all 0.2s ease',
                zIndex: 4
              }}
              aria-label="Image précédente"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              type="button"
              onClick={handleNext}
              style={{
                position: 'absolute',
                top: '50%',
                right: '12px',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(6px)',
                color: '#1E293B',
                border: 'none',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                transition: 'all 0.2s ease',
                zIndex: 4
              }}
              aria-label="Image suivante"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${images.length}, 1fr)`,
            gap: '10px',
            marginTop: '12px'
          }}
        >
          {images.map((img, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  height: '68px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isActive ? '2.5px solid var(--primary-color, #0D9488)' : '1px solid #CBD5E1',
                  opacity: isActive ? 1 : 0.65,
                  transform: isActive ? 'scale(1.02)' : 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(13,148,136,0.3)' : 'none'
                }}
              >
                <img
                  src={img}
                  alt={`Vignette ${idx + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = '/images/dest-rajasthan.jpg';
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#ffffff',
              fontSize: '1.6rem',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            ✕
          </button>

          <img
            src={activeImage}
            alt={tour?.title || 'Photo'}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '92vw',
              maxHeight: '88vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.4rem',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleNext}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.4rem',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TourImageSlider;
