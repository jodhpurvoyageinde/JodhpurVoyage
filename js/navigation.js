/* ==========================================================================
   JODHPUR VOYAGE - NAVIGATION & MOBILE DRAWER LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const navMenu = document.querySelector('.nav-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const hasSubmenuItems = document.querySelectorAll('.nav-item.has-mega');

  // Open Mobile Drawer
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.add('active');
      if (mobileOverlay) mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Close Mobile Drawer
  function closeMobileNav() {
    if (navMenu) navMenu.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  // Handle Mobile Accordion Menus & Sublink Clicks
  hasSubmenuItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const megaMenu = item.querySelector('.mega-menu');
    const chevron = item.querySelector('.mega-chevron');

    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 991) {
          e.preventDefault();
          
          const isOpen = item.classList.contains('mobile-open');
          
          // Close other active accordions
          hasSubmenuItems.forEach(other => {
            if (other !== item) {
              other.classList.remove('mobile-open');
              const otherChevron = other.querySelector('.mega-chevron');
              if (otherChevron) otherChevron.classList.remove('rotate');
            }
          });
          
          if (!isOpen) {
            item.classList.add('mobile-open');
            if (chevron) chevron.classList.add('rotate');
          } else {
            item.classList.remove('mobile-open');
            if (chevron) chevron.classList.remove('rotate');
          }
        }
      });
    }

    if (megaMenu) {
      const subLinks = megaMenu.querySelectorAll('a');
      subLinks.forEach(subLink => {
        subLink.addEventListener('click', closeMobileNav);
      });
    }
  });

  // Desktop Mega Menu Hover Intent with Grace Period
  hasSubmenuItems.forEach(item => {
    let leaveTimer = null;
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth > 991) {
        if (leaveTimer) clearTimeout(leaveTimer);
        item.classList.add('mega-active');
      }
    });
    item.addEventListener('mouseleave', () => {
      if (window.innerWidth > 991) {
        leaveTimer = setTimeout(() => {
          item.classList.remove('mega-active');
        }, 350);
      }
    });
  });

  // ESC key to close mobile drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
      closeMobileNav();
    }
  });

  // Handle Window Resize (Reset Drawer State)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 991) {
      closeMobileNav();
      hasSubmenuItems.forEach(item => {
        item.classList.remove('mobile-open');
        const chevron = item.querySelector('.mega-chevron');
        if (chevron) chevron.classList.remove('rotate');
      });
    }
  });
});
