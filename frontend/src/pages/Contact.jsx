import React, { useState, useEffect } from 'react';
import { sendContactMessage } from '../services/api';
import SEO from '../components/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
    honeypot: ''
  });

  const [num1, setNum1] = useState(5);
  const [num2, setNum2] = useState(3);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setNum1(n1);
    setNum2(n2);
    setCaptchaInput('');
    setCaptchaError(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Honeypot anti-spam check
    if (formData.honeypot) {
      console.warn('Bot submission caught by honeypot.');
      return;
    }

    // Captcha validation
    if (parseInt(captchaInput, 10) !== num1 + num2) {
      setCaptchaError(true);
      setErrorMsg('Veuillez vérifier le calcul anti-spam pour valider l\'envoi.');
      return;
    }

    setLoading(true);

    try {
      await sendContactMessage({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: 'Demande de contact (Site Web)',
        message: formData.message
      });

      setSuccessMsg(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        message: '',
        honeypot: ''
      });
      generateCaptcha();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter par téléphone.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SEO pageKey="contact" />
      {/* HERO BANNER */}
      <section className="contact-hero-section">
        <img 
          src="https://www.jodhpurvoyage.com/wp-content/uploads/2026/07/Voyage-Jaisalmer.jpg" 
          onError={(e) => { e.currentTarget.src = "/images/Voyage-Jaisalmer.jpg"; }}
          alt="Contact Banner" 
          className="contact-hero-bg" 
        />
        <div className="container contact-hero-content">
          <span className="hero-badge"><i className="fas fa-envelope-open-text"></i> À Votre Écoute</span>
          <h1 className="contact-hero-title">Contactez Nous</h1>
          <p className="contact-hero-desc">
            Une question sur un itinéraire ? Notre équipe locale francophone basée à Jodhpur est à votre disposition.
          </p>
        </div>
      </section>

      {/* MAIN CONTACT SECTION */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="contact-grid">
            {/* Left: Details & Map */}
            <div>
              <span className="section-subtitle">Agence Réceptive</span>
              <h2 className="section-title">Nos Coordonnées Directes</h2>
              <p className="contact-lead-desc">
                Basés au cœur du Rajasthan à Jodhpur, nous organisons votre séjour de A à Z avec la réactivité et la proximité d'une agence en direct.
              </p>

              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-icon-circle">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <strong className="contact-info-title">Email</strong>
                    <p><a href="mailto:Info@jodhpurvoyage.com" className="contact-info-link">Info@jodhpurvoyage.com</a></p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-circle">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <strong className="contact-info-title">Téléphone & WhatsApp</strong>
                    <p><a href="tel:+919650698869" className="contact-info-link">+91-96 50 69 88 69</a></p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon-circle">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <strong className="contact-info-title">Adresse en Inde</strong>
                    <p className="contact-lead-desc" style={{ marginTop: '4px', lineHeight: '1.6' }}>
                      <strong>En Inde – Mr. Singh</strong><br />
                      11, Mehtab Singh ka, Nohra vali Line, Alwar,<br />
                      Rajasthan 301001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div>
              <div className="contact-form-card">
                <h3 className="contact-form-title">Envoyez-nous un Message</h3>
                <form id="contact-form" onSubmit={handleSubmit}>
                  {/* Anti-Spam Honeypot Field (Hidden from humans) */}
                  <div className="hp-check-wrap" style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                    <input 
                      type="text" 
                      name="honeypot" 
                      tabIndex="-1" 
                      autoComplete="off" 
                      value={formData.honeypot} 
                      onChange={handleChange} 
                    />
                  </div>

                  {errorMsg && (
                    <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                      <i className="fas fa-exclamation-circle"></i> {errorMsg}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Nom complet *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="fullName" 
                      placeholder="Votre nom et prénom" 
                      required 
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="contact-form-row">
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        name="email" 
                        placeholder="exemple@domaine.fr" 
                        required 
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Téléphone / WhatsApp *</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        name="phone" 
                        placeholder="+33 6 12 34 56 78" 
                        required 
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message ou Projet de voyage *</label>
                    <textarea 
                      className="form-control" 
                      name="message" 
                      rows="4" 
                      placeholder="Décrivez votre projet, vos dates souhaitées ou vos questions..." 
                      required
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  {/* Anti-Spam Captcha Field */}
                  <div className="form-group spam-verify-group">
                    <label className="form-label" htmlFor="captcha-answer">
                      <i className="fas fa-shield-alt"></i> Protection Anti-Spam : Combien font <span id="math-num1">{num1}</span> + <span id="math-num2">{num2}</span> ? *
                    </label>
                    <input 
                      type="number" 
                      className={`form-control ${captchaError ? 'border-danger' : ''}`}
                      id="captcha-answer" 
                      name="captcha_answer" 
                      placeholder={`Entrez le résultat (ex: ${num1 + num2})`} 
                      required
                      value={captchaInput}
                      onChange={(e) => {
                        setCaptchaInput(e.target.value);
                        setCaptchaError(false);
                      }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
                    {loading ? (
                      <><i className="fas fa-spinner fa-spin"></i> Envoi en cours...</>
                    ) : (
                      <>Envoyer le message <i className="fas fa-paper-plane"></i></>
                    )}
                  </button>

                  {successMsg && (
                    <div id="contact-success-msg" className="contact-success-alert" style={{ display: 'block', marginTop: '18px' }}>
                      <i className="fas fa-check-circle"></i> Merci ! Votre message a été envoyé avec succès. Nous vous recontacterons très rapidement.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Widgets */}
      <a href="https://wa.me/919650698869" target="_blank" rel="noopener noreferrer" className="floating-whatsapp" aria-label="Contactez-nous sur WhatsApp">
        <i className="fab fa-whatsapp"></i>
        <span className="whatsapp-tooltip">Contactez-nous sur WhatsApp</span>
      </a>
    </div>
  );
};

export default Contact;
