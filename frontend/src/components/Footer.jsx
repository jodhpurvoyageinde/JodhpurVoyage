import React from 'react';
import { Link } from 'react-router-dom';
import { getCustomPath } from '../utils/customUrlHelper';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Col 1: About */}
        <div className="footer-about">
          <Link to="/" className="brand-logo footer-logo">
            <img 
              src="/images/logo-white-text.png" 
              alt="Jodhpur Voyage Logo" 
              className="brand-logo-img footer-logo-img" 
              onError={(e) => { e.currentTarget.src = '/images/logo-transprent.png'; }}
            />
          </Link>
          <div className="footer-trust-badge">
            <i className="fas fa-shield-alt"></i>
            <span>Agence Locale Francophone Agréée<br /><strong>20+ Ans d'Expérience en Inde et Népal</strong></span>
          </div>
          <p className="footer-recognition-title">Avis Clients et Guides de Voyage</p>
          <div className="footer-recognition-badges">
            <a href="https://www.tripadvisor.in/Attraction_Review-g297668-d26864310-Reviews-Jodhpur_Voyage_Pvt_Ltd-Jodhpur_Jodhpur_District_Rajasthan.html" target="_blank" rel="noreferrer" title="TripAdvisor" className="footer-badge-item">
              <img src="/images/tripadvisor-badge.jpg" alt="TripAdvisor" className="footer-badge-img" />
            </a>
            <a href="https://www.google.com/search?q=Jodhpur+Voyage" target="_blank" rel="noreferrer" title="Google Reviews" className="footer-badge-item">
              <img src="/images/google-review-badge.jpg" alt="Google Reviews" className="footer-badge-img" />
            </a>
            <a href="https://www.trustpilot.com/review/jodhpurvoyage.com" target="_blank" rel="noreferrer" title="Trustpilot" className="footer-badge-item">
              <img src="/images/trustpilot-badge.jpg" alt="Trustpilot" className="footer-badge-img" />
            </a>
            <a href="https://www.petitfute.com/" target="_blank" rel="noreferrer" title="Petit Futé" className="footer-badge-item">
              <img src="/images/petit-fute-badge.jpg" alt="Petit Futé" className="footer-badge-img" />
            </a>
            <a href="https://www.routard.com/" target="_blank" rel="noreferrer" title="Le Guide du Routard" className="footer-badge-item">
              <img src="/images/routard-badge.jpg" alt="Le Guide du Routard" className="footer-badge-img" />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/"><i className="fas fa-chevron-right"></i> Accueil</Link></li>
            <li><Link to={getCustomPath('/qui-sommes-nous')}><i className="fas fa-chevron-right"></i> Qui Sommes Nous</Link></li>
            <li><Link to={getCustomPath('/destinations')}><i className="fas fa-chevron-right"></i> Destination</Link></li>
            <li><Link to={getCustomPath('/voyage-sur-mesure')}><i className="fas fa-chevron-right"></i> Voyage sur mesure</Link></li>
            <li><Link to={getCustomPath('/infos-pratiques')}><i className="fas fa-chevron-right"></i> Infos pratiques</Link></li>
            <li><Link to={getCustomPath('/blog')}><i className="fas fa-chevron-right"></i> Blog</Link></li>
            <li><Link to={getCustomPath('/commentaires')}><i className="fas fa-chevron-right"></i> commentaires</Link></li>
            <li><Link to={getCustomPath('/contact')}><i className="fas fa-chevron-right"></i> Contactez Nous</Link></li>
          </ul>
        </div>

        {/* Col 3: Destinations */}
        <div>
          <h4 className="footer-col-title">Destinations</h4>
          <ul className="footer-links">
            <li><Link to="/destinations/rajasthan"><i className="fas fa-chevron-right"></i> Rajasthan</Link></li>
            <li><Link to="/destinations/gujarat"><i className="fas fa-chevron-right"></i> Gujarat</Link></li>
            <li><Link to="/destinations"><i className="fas fa-chevron-right"></i> Karnataka</Link></li>
            <li><Link to="/destinations/ladakh"><i className="fas fa-chevron-right"></i> Ladakh</Link></li>
            <li><Link to="/destinations"><i className="fas fa-chevron-right"></i> Inde du Nord</Link></li>
            <li><Link to="/destinations/kerala"><i className="fas fa-chevron-right"></i> Inde du Sud</Link></li>
            <li><Link to="/destinations/nepal"><i className="fas fa-chevron-right"></i> Népal</Link></li>
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div>
          <h4 className="footer-col-title">Contact</h4>
          <div className="footer-contact-item">
            <i className="fas fa-envelope"></i>
            <div><a href="mailto:Info@jodhpurvoyage.com" className="footer-contact-link">Info@jodhpurvoyage.com</a></div>
          </div>
          <div className="footer-contact-item">
            <i className="fas fa-phone-alt"></i>
            <div><a href="tel:+919650698669" className="footer-contact-link">+91-96 50 69 86 69</a></div>
          </div>
          <div className="footer-contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <strong>En Inde – Mr. Singh</strong><br />
              11, Mehtab Singh ka, Nohra vali Line, Alwar,<br />
              Rajasthan 301001
            </div>
          </div>
          <div className="top-bar-social footer-social">
            <a href="https://www.facebook.com/jodhpurvoyage/" target="_blank" rel="noreferrer" title="Facebook" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/jodhpur_voyage/" target="_blank" rel="noreferrer" title="Instagram" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Twitter" aria-label="Twitter"><i className="fab fa-x-twitter"></i></a>
            <Link to="/admin/login" title="Accès Admin" style={{ color: 'var(--color-secondary, #C58B39)' }}><i className="fas fa-lock"></i></Link>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <div>© 2026 Jodhpur Voyage - Tous droits réservés. Tour Opérateur en Inde et Népal.</div>
        <div>Designed with elegance for Jodhpur Voyage</div>
      </div>
    </footer>
  );
};

export default Footer;
