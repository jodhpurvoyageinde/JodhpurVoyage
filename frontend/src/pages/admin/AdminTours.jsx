import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import AdminImageUpload from '../../components/AdminImageUpload';
import { 
  fetchAdminTours, 
  fetchAdminDestinations, 
  fetchDestinationCategories, 
  createTour, 
  updateTour, 
  deleteTour, 
  unfeatureAllTours 
} from '../../services/api';

const DEFAULT_DESTINATIONS_PRESETS = [
  { name: 'Rajasthan', region: 'rajasthan', slug: 'rajasthan' },
  { name: 'Jodhpur', region: 'rajasthan', slug: 'jodhpur' },
  { name: 'Jaipur', region: 'rajasthan', slug: 'jaipur' },
  { name: 'Udaipur', region: 'rajasthan', slug: 'udaipur' },
  { name: 'Jaisalmer', region: 'rajasthan', slug: 'jaisalmer' },
  { name: 'Delhi', region: 'inde-du-nord', slug: 'delhi' },
  { name: 'Agra (Taj Mahal)', region: 'inde-du-nord', slug: 'agra' },
  { name: 'Varanasi (Bénarès)', region: 'inde-du-nord', slug: 'varanasi' },
  { name: 'Amritsar', region: 'inde-du-nord', slug: 'amritsar' },
  { name: 'Dharamsala', region: 'inde-du-nord', slug: 'dharamsala' },
  { name: 'Rishikesh', region: 'inde-du-nord', slug: 'rishikesh' },
  { name: 'Ladakh', region: 'ladakh', slug: 'ladakh' },
  { name: 'Kerala', region: 'inde-du-sud', slug: 'kerala' },
  { name: 'Tamil Nadu', region: 'inde-du-sud', slug: 'tamil-nadu' },
  { name: 'Karnataka', region: 'inde-du-sud', slug: 'karnataka' },
  { name: 'Gujarat', region: 'gujarat', slug: 'gujarat' },
  { name: 'Goa', region: 'inde-du-sud', slug: 'goa' },
  { name: 'Orissa', region: 'inde-du-sud', slug: 'orissa' },
  { name: 'Kathmandu (Nepal)', region: 'nepal', slug: 'kathmandu' },
  { name: 'Pokhara (Nepal)', region: 'nepal', slug: 'pokhara' },
  { name: 'Punakha (Bhutan)', region: 'bhoutan', slug: 'punakha' },
  { name: 'Thimphu (Bhutan)', region: 'bhoutan', slug: 'thimphu' }
];

const AdminTours = () => {
  const [tours, setTours] = useState([]);
  const [destinationsList, setDestinationsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTour, setEditingTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customCityInput, setCustomCityInput] = useState('');

  const initialForm = {
    title: '',
    slug: '',
    subtitle: '',
    duration: '14 Days / 13 Nights',
    category: 'Rajasthan',
    categoryId: '',
    cities: [],
    location: 'Rajasthan',
    region: 'rajasthan',
    theme: 'Culture & Heritage',
    badge: 'Popular',
    rating: 4.9,
    reviewCount: 30,
    image: '/images/dest-rajasthan.jpg',
    overview: '',
    highlights: ['Visit Taj Mahal', 'Jaipur Royal Palaces', 'Mehrangarh Fort of Jodhpur'],
    itinerary: [
      { day: 1, title: 'Arrival in Delhi', description: 'Warm welcome by your private English/French speaking chauffeur at the airport and transfer to hotel.', meals: 'Free dinner', accommodation: '4* Boutique Hotel' },
      { day: 2, title: 'Delhi - Jaipur', description: 'Drive to the Pink City of Rajasthan. Explore bustling colorful bazaars and the Hawa Mahal.', meals: 'Breakfast included', accommodation: 'Heritage Haveli' }
    ],
    inclusions: ['Private air-conditioned vehicle with chauffeur', 'Charming heritage hotels with daily breakfast', '24/7 dedicated assistance'],
    exclusions: ['International flights', 'Indian visa fees', 'Personal expenses and gratuities'],
    seoTitle: '',
    seoKeywords: '',
    seoDescription: '',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    featured: false,
    published: true
  };

  const [formData, setFormData] = useState(initialForm);

  const loadTours = () => {
    setLoading(true);
    fetchAdminTours()
      .then((res) => {
        setTours(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const loadDestinations = () => {
    fetchAdminDestinations()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDestinationsList(res.data);
        }
      })
      .catch((err) => console.error('Erreur chargement destinations admin:', err));
  };

  const loadCategories = () => {
    fetchDestinationCategories()
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCategoriesList(res.data);
        }
      })
      .catch((err) => console.error('Erreur chargement catégories admin:', err));
  };

  useEffect(() => {
    loadTours();
    loadDestinations();
    loadCategories();
  }, []);

  // Build combined list of all destinations added in system for tagging
  const allDestinationsMap = [...DEFAULT_DESTINATIONS_PRESETS];
  destinationsList.forEach((d) => {
    if (d.name && !allDestinationsMap.some(item => item.name.toLowerCase() === d.name.toLowerCase())) {
      allDestinationsMap.push({
        _id: d._id,
        name: d.name,
        slug: d.slug || d.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
        region: d.region || 'inde-du-nord'
      });
    }
  });

  // Build unified, de-duplicated list of all destination categories & created destinations for dropdown
  const combinedCategories = [];
  const seenCatNames = new Set();

  // 1. Add all destinations created by admin in Destinations & Regions
  (destinationsList || []).forEach((d) => {
    const rawName = (d.name || '').trim();
    const key = rawName.toLowerCase();
    if (key && !seenCatNames.has(key)) {
      seenCatNames.add(key);
      combinedCategories.push({
        _id: d._id,
        name: rawName,
        slug: d.slug || key.replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
        region: d.region
      });
    }
  });

  // 2. Add categories from categoriesList
  (categoriesList || []).forEach((cat) => {
    const rawName = (cat.name || '').trim();
    const key = rawName.toLowerCase();
    if (key && !seenCatNames.has(key)) {
      seenCatNames.add(key);
      combinedCategories.push({
        _id: cat._id,
        name: rawName,
        slug: cat.slug || key.replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
        region: cat.region
      });
    }
  });

  // 3. Add default presets
  DEFAULT_DESTINATIONS_PRESETS.forEach((preset) => {
    const key = preset.name.toLowerCase();
    if (!seenCatNames.has(key)) {
      seenCatNames.add(key);
      combinedCategories.push({
        _id: preset.slug,
        name: preset.name,
        slug: preset.slug,
        region: preset.region
      });
    }
  });

  // Sort alphabetically so admin can easily find any destination
  combinedCategories.sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));

  const handleOpenCreate = () => {
    setEditingTour(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tour) => {
    setEditingTour(tour);
    const title = tour.title || 'Circuit';
    const loc = tour.location || tour.region || 'Inde';
    const dur = tour.duration || 'Plusieurs Jours';

    let initialCities = [];
    if (Array.isArray(tour.cities) && tour.cities.length > 0) {
      initialCities = tour.cities;
    } else if (tour.cityName) {
      initialCities = [{ name: tour.cityName, slug: (tour.cityName || '').toLowerCase() }];
    } else if (tour.location) {
      const parts = tour.location.split(',').map(s => s.trim()).filter(Boolean);
      if (parts.length > 0) {
        initialCities = parts.map(p => ({
          name: p,
          slug: p.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
        }));
      }
    }

    setFormData({
      ...initialForm,
      ...tour,
      category: tour.category || tour.region || 'Rajasthan',
      categoryId: tour.categoryId || '',
      subtitle: tour.subtitle || tour.excerpt || '',
      cities: initialCities,
      featured: Boolean(tour.featured === true),
      published: tour.published !== false,
      seoTitle: tour.seoTitle || tour.metaTitle || '',
      metaTitle: tour.seoTitle || tour.metaTitle || '',
      seoKeywords: tour.seoKeywords || tour.metaKeywords || '',
      metaKeywords: tour.seoKeywords || tour.metaKeywords || '',
      seoDescription: tour.seoDescription || tour.metaDescription || '',
      metaDescription: tour.seoDescription || tour.metaDescription || '',
      highlights: tour.highlights || [],
      itinerary: tour.itinerary || [],
      inclusions: tour.inclusions || [],
      exclusions: tour.exclusions || []
    });
    setIsModalOpen(true);
  };

  const handleToggleCityTag = (cityItem) => {
    const cityName = typeof cityItem === 'string' ? cityItem.trim() : (cityItem.name?.trim() || '');
    if (!cityName) return;

    const currentCities = Array.isArray(formData.cities) ? [...formData.cities] : [];
    const existingIndex = currentCities.findIndex(c => (c.name || '').toLowerCase() === cityName.toLowerCase());

    if (existingIndex >= 0) {
      // Remove
      currentCities.splice(existingIndex, 1);
    } else {
      // Add tag
      const matched = allDestinationsMap.find(d => d.name.toLowerCase() === cityName.toLowerCase());
      const slug = matched?.slug || cityName.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      const cityId = matched?._id || '';
      currentCities.push({ name: cityName, slug, cityId });
    }

    setFormData({
      ...formData,
      cities: currentCities,
      location: currentCities.map(c => c.name).join(', ')
    });
  };

  const handleAddCustomCity = () => {
    if (!customCityInput.trim()) return;
    handleToggleCityTag(customCityInput.trim());
    setCustomCityInput('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this tour?')) return;
    try {
      await deleteTour(id);
      loadTours();
    } catch (err) {
      alert('Error deleting tour.');
    }
  };

  const handleAddItineraryDay = () => {
    const nextDay = (formData.itinerary?.length || 0) + 1;
    setFormData({
      ...formData,
      itinerary: [
        ...formData.itinerary,
        { day: nextDay, title: `Day ${nextDay} - Destination`, description: 'Daily visits, sightseeing, and cultural experiences...', meals: 'Breakfast included', accommodation: 'Heritage Hotel' }
      ]
    });
  };

  const handleRemoveItineraryDay = (index) => {
    const list = formData.itinerary.filter((_, i) => i !== index);
    setFormData({ ...formData, itinerary: list });
  };

  const handleItineraryChange = (index, field, value) => {
    const list = [...formData.itinerary];
    list[index][field] = value;
    setFormData({ ...formData, itinerary: list });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const sTitle = (formData.seoTitle || formData.metaTitle || '').trim();
      const sKeywords = (formData.seoKeywords || formData.metaKeywords || '').trim();
      const sDesc = (formData.seoDescription || formData.metaDescription || '').trim();

      const payload = {
        ...formData,
        seoTitle: sTitle,
        metaTitle: sTitle,
        seoKeywords: sKeywords,
        metaKeywords: sKeywords,
        seoDescription: sDesc,
        metaDescription: sDesc,
        subtitle: formData.subtitle || '',
        content: formData.overview || formData.content || formData.subtitle || formData.title || 'Tour Details',
        excerpt: formData.subtitle || formData.excerpt || formData.overview || formData.title || 'Tour Excerpt'
      };
      if (editingTour) {
        await updateTour(editingTour._id, payload);
      } else {
        await createTour(payload);
      }
      setIsModalOpen(false);
      loadTours();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving tour.');
    } finally {
      setSaving(false);
    }
  };

  const handleUnfeatureAll = async () => {
    if (!window.confirm('Voulez-vous vraiment décocher "Feature on Homepage" pour TOUS les circuits ? Aucun circuit ne sera affiché sur la page d\'accueil.')) return;
    try {
      await unfeatureAllTours();
      alert('Tous les circuits ont été retirés de la page d\'accueil avec succès !');
      loadTours();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors du retrait des circuits.');
    }
  };

  const handleSelectDestination = (destObj) => {
    setFormData({
      ...formData,
      location: destObj.name,
      region: destObj.region || formData.region
    });
  };

  const filteredTours = tours.filter((t) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const matchCities = Array.isArray(t.cities) && t.cities.some(c => (c.name || '').toLowerCase().includes(term));
    return (
      t.title?.toLowerCase().includes(term) ||
      t.category?.toLowerCase().includes(term) ||
      t.region?.toLowerCase().includes(term) ||
      t.location?.toLowerCase().includes(term) ||
      matchCities
    );
  });

  return (
    <AdminLayout 
      title="Tours & Travel Itineraries" 
      subtitle="Manage published tour packages, linked destination categories, and connected city tags."
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }}></i>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search tour, category, city..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '34px', fontSize: '0.88rem', height: '38px', borderRadius: '8px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button" 
            className="btn" 
            onClick={handleUnfeatureAll}
            style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5' }}
            title="Décocher tous les circuits de la page d'accueil"
          >
            <i className="fas fa-eye-slash"></i> Retirer Tous de l'Accueil
          </button>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <i className="fas fa-plus"></i> Create New Tour
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: 'var(--admin-primary)' }}></i>
          <p style={{ marginTop: '16px', color: 'var(--admin-text-muted)' }}>Loading tours...</p>
        </div>
      ) : filteredTours.length === 0 ? (
        <div className="admin-table-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <i className="fas fa-route" style={{ fontSize: '3rem', color: '#CBD5E1', marginBottom: '16px', display: 'block' }}></i>
          <h3 style={{ color: 'var(--admin-text-main)', margin: '0 0 8px' }}>No tours found</h3>
          <p style={{ color: 'var(--admin-text-muted)', margin: '0 0 16px' }}>Start by creating your first travel itinerary for the website.</p>
          <button className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
            <i className="fas fa-plus"></i> New Tour
          </button>
        </div>
      ) : (
        <div className="admin-table-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tour Package</th>
                  <th>Destination / Category</th>
                  <th>Connected Cities (Tags)</th>
                  <th>Duration</th>
                  <th>Visibility</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTours.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img 
                          src={t.image || '/images/dest-rajasthan.jpg'} 
                          alt={t.title} 
                          onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
                          style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E2E8F0' }} 
                        />
                        <div>
                          <strong style={{ color: 'var(--admin-text-main)' }}>{t.title}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                            {t.subtitle ? t.subtitle.slice(0, 48) + '...' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-status-badge status-en-attente" style={{ fontWeight: '600' }}>
                        📁 {t.category || t.region?.toUpperCase() || 'RAJASTHAN'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '240px' }}>
                        {Array.isArray(t.cities) && t.cities.length > 0 ? (
                          t.cities.map((c, i) => (
                            <span key={i} style={{ fontSize: '0.72rem', background: '#EEF2FF', color: '#3730A3', border: '1px solid #C7D2FE', padding: '2px 7px', borderRadius: '10px', fontWeight: '500' }}>
                              📍 {c.name}
                            </span>
                          ))
                        ) : t.location ? (
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>📍 {t.location}</span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>No cities tagged</span>
                        )}
                      </div>
                    </td>
                    <td>{t.duration}</td>
                    <td>
                      <span className={`admin-status-badge ${t.published !== false ? 'status-confirme' : 'status-annule'}`}>
                        {t.published !== false ? 'Published' : 'Draft'}
                      </span>
                      {t.featured && (
                        <span className="admin-status-badge status-contacte" style={{ marginLeft: '4px' }}>
                          <i className="fas fa-star"></i> Featured
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-sm btn-outline" onClick={() => handleOpenEdit(t)} title="Edit">
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button className="btn btn-sm" style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' }} onClick={() => handleDelete(t._id)} title="Delete">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: 0, overflow: 'hidden' }}>
              <div className="modal-header">
                <h3 className="modal-title">
                  <i className="fas fa-route" style={{ color: 'var(--admin-primary)' }}></i>
                  <span>{editingTour ? `Edit Tour: ${editingTour.title}` : 'Create New Tour'}</span>
                </h3>
                <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)} title="Close dialog">
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontWeight: '600' }}>Tour Title *</label>
                  <input type="text" required className="form-control" placeholder="e.g. Treasures of Rajasthan & Ganges Valley" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Duration (e.g. 14 Days / 13 Nights) *</label>
                    <input type="text" required className="form-control" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600', color: 'var(--admin-primary)' }}>
                      <i className="fas fa-folder-open"></i> Package Destination / Category *
                    </label>
                    <select 
                      className="form-control" 
                      value={formData.category || formData.region} 
                      onChange={(e) => {
                        const selectedVal = e.target.value;
                        const matched = combinedCategories.find(c => 
                          c.name.toLowerCase() === selectedVal.toLowerCase() || 
                          c.slug?.toLowerCase() === selectedVal.toLowerCase()
                        );
                        setFormData({
                          ...formData,
                          category: selectedVal,
                          categoryId: matched ? matched._id : formData.categoryId,
                          region: matched?.region || matched?.slug || selectedVal.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
                        });
                      }}
                    >
                      {formData.category && !combinedCategories.some(c => c.name.toLowerCase() === formData.category.toLowerCase()) && (
                        <option value={formData.category}>
                          📁 {formData.category} (Actuel)
                        </option>
                      )}
                      {combinedCategories.map((cat, i) => (
                        <option key={cat._id || i} value={cat.name}>
                          📁 {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Connected Cities Multi-Tag Selector (Many-to-Many Connection) */}
                <div style={{ background: '#F8FAFC', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '16px', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label" style={{ fontWeight: '700', color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fas fa-tags" style={{ color: 'var(--admin-primary)' }}></i>
                      Connected Cities (Tags) *
                    </label>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--admin-primary)', background: '#E0F2FE', padding: '2px 8px', borderRadius: '12px' }}>
                      {formData.cities?.length || 0} cities linked
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 10px 0' }}>
                    Har package ke saath multiple cities connect hoti hain. Same city (e.g. <strong>Jodhpur</strong>) kai saare packages me tag ki ja sakti hai.
                  </p>

                  {/* Active City Tags Box */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '44px', padding: '10px 12px', background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '8px', marginBottom: '12px', alignItems: 'center' }}>
                    {(!formData.cities || formData.cities.length === 0) ? (
                      <span style={{ color: '#94A3B8', fontSize: '0.84rem', fontStyle: 'italic' }}>
                        No cities tagged yet. Click any city below or select from list to link cities.
                      </span>
                    ) : (
                      formData.cities.map((city, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#EEF2FF',
                            color: '#3730A3',
                            border: '1px solid #C7D2FE',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '0.84rem',
                            fontWeight: '600',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}
                        >
                          <i className="fas fa-map-marker-alt" style={{ fontSize: '0.75rem', color: '#4F46E5' }}></i>
                          {city.name}
                          <button
                            type="button"
                            onClick={() => handleToggleCityTag(city.name)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#4F46E5',
                              cursor: 'pointer',
                              padding: '0 0 0 4px',
                              fontSize: '1rem',
                              lineHeight: 1,
                              fontWeight: 'bold'
                            }}
                            title={`Remove ${city.name}`}
                          >
                            &times;
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Select from all existing cities or Add custom */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    <select
                      className="form-control"
                      style={{ fontSize: '0.85rem' }}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleToggleCityTag(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="">-- Choose city from database to tag --</option>
                      {allDestinationsMap.map((d, i) => {
                        const isTagged = (formData.cities || []).some(c => (c.name || '').toLowerCase() === (d.name || '').toLowerCase());
                        return (
                          <option key={i} value={d.name}>
                            {isTagged ? '✓ ' : '+ '} {d.name} ({d.region?.toUpperCase()})
                          </option>
                        );
                      })}
                    </select>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Custom city..."
                        style={{ fontSize: '0.85rem' }}
                        value={customCityInput}
                        onChange={(e) => setCustomCityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomCity();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={handleAddCustomCity}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <i className="fas fa-plus"></i> Add
                      </button>
                    </div>
                  </div>

                  {/* Quick Pick Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569' }}>Popular Cities :</span>
                    {allDestinationsMap.slice(0, 15).map((d, idx) => {
                      const isTagged = (formData.cities || []).some(c => (c.name || '').toLowerCase() === (d.name || '').toLowerCase());
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleCityTag(d.name)}
                          style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.76rem',
                            fontWeight: '600',
                            border: isTagged ? '1.5px solid var(--admin-primary)' : '1px solid #CBD5E1',
                            background: isTagged ? 'var(--admin-primary)' : '#FFFFFF',
                            color: isTagged ? '#FFFFFF' : '#334155',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isTagged ? '✓ ' : '+ '} {d.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <AdminImageUpload
                  label="Tour Main Banner / Image (Local Upload / Cloudinary)"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  placeholder="https://... or click 'Upload from Device'"
                />

                {/* Subtitle / Tagline (Aperçu du Circuit Intro) */}
                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label" style={{ fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fas fa-quote-left" style={{ color: 'var(--admin-primary)' }}></i>
                      Subtitle / Tagline (Aperçu du Circuit)
                    </label>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: '6px' }}>
                      {formData.subtitle?.length || 0} caractères (aucune limite)
                    </span>
                  </div>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="e.g. Partez au Rajasthan, Voyage au Rajasthan hors des sentiers battus sur mesure, avec une agence locale francophone... (aucune limite de caractères)"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  ></textarea>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                    Ce texte s'affiche en accroche d'introduction sous le titre "Aperçu du Circuit" sur la page de détail du voyage. Aucune limite de longueur.
                  </span>
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label" style={{ fontWeight: '600' }}>Overview & Presentation *</label>
                  <textarea rows="4" required className="form-control" placeholder="Compelling description of the tour..." value={formData.overview} onChange={(e) => setFormData({ ...formData, overview: e.target.value })}></textarea>
                </div>

                {/* Day by Day Itinerary Builder */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <strong style={{ color: 'var(--admin-text-main)' }}>Day by Day Program ({formData.itinerary?.length || 0} days)</strong>
                    <button type="button" className="btn btn-sm btn-outline" onClick={handleAddItineraryDay}>
                      <i className="fas fa-plus"></i> Add Day
                    </button>
                  </div>

                  {formData.itinerary?.map((it, idx) => (
                    <div key={idx} style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--admin-primary)', fontSize: '0.9rem' }}>Day {it.day || idx + 1}</span>
                        <button type="button" style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }} onClick={() => handleRemoveItineraryDay(idx)} title="Delete day">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Day title (e.g. Delhi - Jaipur)"
                        className="form-control"
                        style={{ marginBottom: '8px' }}
                        value={it.title}
                        onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)}
                      />
                      <textarea
                        rows="2"
                        placeholder="Sightseeing, monuments, travel details..."
                        className="form-control"
                        value={it.description}
                        onChange={(e) => handleItineraryChange(idx, 'description', e.target.value)}
                      ></textarea>
                    </div>
                  ))}
                </div>

                {/* SEO Meta Tag Settings */}
                <div style={{ background: '#F0F9FF', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #BAE6FD' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <i className="fas fa-search" style={{ color: '#0284C7', fontSize: '1.1rem' }}></i>
                    <strong style={{ color: '#0369A1', fontSize: '0.95rem' }}>SEO Settings (Meta Title, Keywords & Description)</strong>
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>SEO Meta Title (Title Tag)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Best Jodhpur Tour Package | 5 Days Rajasthan Itinerary" 
                      value={formData.seoTitle || formData.metaTitle || ''} 
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value, metaTitle: e.target.value })} 
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>SEO Meta Keywords (Comma separated)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. jodhpur tour, rajasthan itinerary, jodhpur travel package" 
                      value={formData.seoKeywords || formData.metaKeywords || ''} 
                      onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value, metaKeywords: e.target.value })} 
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>SEO Meta Description</label>
                    <textarea 
                      rows="2" 
                      className="form-control" 
                      placeholder="e.g. Book our top-rated Jodhpur tour package with private driver, luxury hotel stays, and authentic heritage sightseeing." 
                      value={formData.seoDescription || formData.metaDescription || ''} 
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value, metaDescription: e.target.value })} 
                    ></textarea>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} />
                    <span>Published (Visible on website)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
                    <span>Feature on Homepage</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : (editingTour ? <><i className="fas fa-save"></i> Update Tour</> : <><i className="fas fa-plus"></i> Create Tour</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTours;
