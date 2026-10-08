import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import VoyageSurMesure from './pages/VoyageSurMesure';
import Commentaires from './pages/Commentaires';
import CommentaireDetail from './pages/CommentaireDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import QuiNousSommes from './pages/QuiNousSommes';
import NotreEquipe from './pages/NotreEquipe';
import InfosPratiques from './pages/InfosPratiques';
import Contact from './pages/Contact';
import CircuitAccompagne from './pages/CircuitAccompagne';
import DynamicPage from './pages/DynamicPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminTours from './pages/admin/AdminTours';
import AdminDestinations from './pages/admin/AdminDestinations';
import AdminReviews from './pages/admin/AdminReviews';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminSEO from './pages/admin/AdminSEO';
import AdminCustomUrls from './pages/admin/AdminCustomUrls';
import AdminMegaMenu from './pages/admin/AdminMegaMenu';
import AdminPages from './pages/admin/AdminPages';
import CustomUrlResolver from './components/CustomUrlResolver';
import FloatingActions from './components/FloatingActions';

// Redirect legacy /tours/:slug to clean /:slug
const TourRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/${slug}`} replace />;
};

const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  React.useEffect(() => {
    if (location.hash) {
      const elemId = location.hash.replace('#', '');
      const elem = document.getElementById(elemId);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isAdminRoute && <Navbar />}
      
      <div style={{ flexGrow: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:slug" element={<TourRedirect />} />
          <Route path="/circuits" element={<Tours />} />
          <Route path="/circuits.html" element={<Tours />} />
          <Route path="/category/:category" element={<Tours />} />
          <Route path="/category/inde-du-nord" element={<Tours />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
          <Route path="/destination-rajasthan" element={<DestinationDetail />} />
          <Route path="/voyage-sur-mesure" element={<VoyageSurMesure />} />
          <Route path="/commentaires" element={<Commentaires />} />
          <Route path="/commentaire/:slug" element={<CommentaireDetail />} />
          <Route path="/commentaires/:slug" element={<CommentaireDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/blog_category/:category" element={<Blog />} />
          <Route path="/blog_category/:category/page/:page" element={<Blog />} />
          <Route path="/qui-sommes-nous" element={<QuiNousSommes />} />
          <Route path="/qui-sommes-nous.html" element={<QuiNousSommes />} />
          <Route path="/qui-nous-sommes" element={<QuiNousSommes />} />
          <Route path="/qui-nous-sommes.html" element={<QuiNousSommes />} />
          <Route path="/notre-valeur-ajoutee" element={<Navigate to="/qui-sommes-nous#notre-philosophie" replace />} />
          <Route path="/notre-valeur-ajoutee.html" element={<Navigate to="/qui-sommes-nous#notre-philosophie" replace />} />
          <Route path="/notre-engagement-responsable" element={<Navigate to="/qui-sommes-nous#notre-engagement-responsable" replace />} />
          <Route path="/notre-engagement-responsable.html" element={<Navigate to="/qui-sommes-nous#notre-engagement-responsable" replace />} />
          <Route path="/notre-equipe" element={<NotreEquipe />} />
          <Route path="/notre-equipe.html" element={<NotreEquipe />} />
          <Route path="/circuit-accompagne" element={<CircuitAccompagne />} />
          <Route path="/circuit-accompagne.html" element={<CircuitAccompagne />} />
          <Route path="/culture-et-safari" element={<DynamicPage defaultPageKey="culture-et-safari" />} />
          <Route path="/culture-et-safari.html" element={<DynamicPage defaultPageKey="culture-et-safari" />} />
          <Route path="/plus-de-10-personnes" element={<DynamicPage defaultPageKey="plus-de-10-personnes" />} />
          <Route path="/plus-de-10-personnes.html" element={<DynamicPage defaultPageKey="plus-de-10-personnes" />} />
          <Route path="/inspirations" element={<DynamicPage defaultPageKey="inspirations" />} />
          <Route path="/inspirations.html" element={<DynamicPage defaultPageKey="inspirations" />} />

          {/* Dedicated Individual Infos Pratiques Routes -> Smooth scroll to section */}
          <Route path="/visa-inde-nepal" element={<Navigate to="/infos-pratiques#visas-formalites" replace />} />
          <Route path="/visa-inde-nepal.html" element={<Navigate to="/infos-pratiques#visas-formalites" replace />} />
          <Route path="/visa-inde" element={<Navigate to="/infos-pratiques#visas-formalites" replace />} />
          <Route path="/visa-inde.html" element={<Navigate to="/infos-pratiques#visas-formalites" replace />} />
          <Route path="/quand-partir" element={<Navigate to="/infos-pratiques#climat-geographie" replace />} />
          <Route path="/quand-partir.html" element={<Navigate to="/infos-pratiques#climat-geographie" replace />} />
          <Route path="/climat-meteo" element={<Navigate to="/infos-pratiques#climat-geographie" replace />} />
          <Route path="/climat-meteo.html" element={<Navigate to="/infos-pratiques#climat-geographie" replace />} />
          <Route path="/climat" element={<Navigate to="/infos-pratiques#climat-geographie" replace />} />
          <Route path="/climat.html" element={<Navigate to="/infos-pratiques#climat-geographie" replace />} />
          <Route path="/sante-vaccins" element={<Navigate to="/infos-pratiques#sante-vaccins" replace />} />
          <Route path="/sante-vaccins.html" element={<Navigate to="/infos-pratiques#sante-vaccins" replace />} />
          <Route path="/sante" element={<Navigate to="/infos-pratiques#sante-vaccins" replace />} />
          <Route path="/sante.html" element={<Navigate to="/infos-pratiques#sante-vaccins" replace />} />
          <Route path="/monnaie-change" element={<Navigate to="/infos-pratiques#monnaie-change" replace />} />
          <Route path="/monnaie-change.html" element={<Navigate to="/infos-pratiques#monnaie-change" replace />} />
          <Route path="/monnaie" element={<Navigate to="/infos-pratiques#monnaie-change" replace />} />
          <Route path="/monnaie.html" element={<Navigate to="/infos-pratiques#monnaie-change" replace />} />
          <Route path="/transports-chauffeur" element={<Navigate to="/infos-pratiques#transports-chauffeur" replace />} />
          <Route path="/transports-chauffeur.html" element={<Navigate to="/infos-pratiques#transports-chauffeur" replace />} />
          <Route path="/transports" element={<Navigate to="/infos-pratiques#transports-chauffeur" replace />} />
          <Route path="/transports.html" element={<Navigate to="/infos-pratiques#transports-chauffeur" replace />} />
          <Route path="/conseils-pratiques" element={<Navigate to="/infos-pratiques#patrimoine-unesco" replace />} />
          <Route path="/conseils-pratiques.html" element={<Navigate to="/infos-pratiques#patrimoine-unesco" replace />} />
          <Route path="/conseils" element={<Navigate to="/infos-pratiques#patrimoine-unesco" replace />} />
          <Route path="/conseils.html" element={<Navigate to="/infos-pratiques#patrimoine-unesco" replace />} />
          <Route path="/faq" element={<Navigate to="/infos-pratiques#patrimoine-unesco" replace />} />
          <Route path="/faq.html" element={<Navigate to="/infos-pratiques#patrimoine-unesco" replace />} />
          <Route path="/questions-frequentes" element={<Navigate to="/infos-pratiques#patrimoine-unesco" replace />} />
          <Route path="/questions-frequentes.html" element={<Navigate to="/infos-pratiques#patrimoine-unesco" replace />} />

          <Route path="/page/:slug" element={<DynamicPage />} />
          <Route path="/pages/:slug" element={<DynamicPage />} />
          <Route path="/infos-pratiques" element={<InfosPratiques />} />
          <Route path="/infos-pratiques.html" element={<InfosPratiques />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/contactus" element={<Contact />} />
          <Route path="/contact.html" element={<Contact />} />
          <Route path="/contact-us.html" element={<Contact />} />
          <Route path="/contactus.html" element={<Contact />} />
          <Route path="/voyage-sur-mesure.html" element={<VoyageSurMesure />} />
          <Route path="/destinations.html" element={<Destinations />} />
          <Route path="/destination-rajasthan.html" element={<DestinationDetail />} />
          <Route path="/commentaires.html" element={<Commentaires />} />
          <Route path="/tours.html" element={<Tours />} />
          <Route path="/blog.html" element={<Blog />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/tours" element={<AdminTours />} />
          <Route path="/admin/destinations" element={<AdminDestinations />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/blogs" element={<AdminBlogs />} />
          <Route path="/admin/inquiries" element={<AdminInquiries />} />
          <Route path="/admin/seo" element={<AdminSEO />} />
          <Route path="/admin/custom-urls" element={<AdminCustomUrls />} />
          <Route path="/admin/mega-menu" element={<AdminMegaMenu />} />
          <Route path="/admin/pages" element={<AdminPages />} />

          {/* Fallback & Custom URL Dynamic Resolver */}
          <Route path="*" element={<CustomUrlResolver />} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingActions />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
