import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import AdminImageUpload from '../../components/AdminImageUpload';
import { fetchAdminDestinations, createDestination, updateDestination, deleteDestination } from '../../services/api';

const PRESET_DESTINATIONS = [
  // Rajasthan
  { name: 'Rajasthan', region: 'rajasthan', image: '/images/dest-rajasthan.jpg', tagline: 'Terre des Maharajas et désert du Thar' },
  { name: 'Jodhpur', region: 'rajasthan', image: '/images/dest-jodhpur.jpg', tagline: 'La Cité Bleue et la forteresse de Mehrangarh' },
  { name: 'Jaipur', region: 'rajasthan', image: '/images/jaipur-travel.jpg', tagline: 'La Cité Rose et les palais d\'Ambre' },
  { name: 'Udaipur', region: 'rajasthan', image: '/images/dest-rajasthan.jpg', tagline: 'La Cité des Lacs et la Venise de l\'Orient' },
  { name: 'Jaisalmer', region: 'rajasthan', image: '/images/Voyage-Jaisalmer.jpg', tagline: 'La Cité Dorée aux portes du désert' },
  { name: 'Pushkar', region: 'rajasthan', image: '/images/dest-rajasthan.jpg', tagline: 'Le lac sacré et la foire aux chameaux' },
  { name: 'Bikaner', region: 'rajasthan', image: '/images/dest-rajasthan.jpg', tagline: 'Forteresse de Junagarh et havelis sculptées' },

  // North India
  { name: 'Delhi', region: 'inde-du-nord', image: '/images/dest-tajmahal.jpg', tagline: 'Capitale historique et cœur culturel' },
  { name: 'Agra (Taj Mahal)', region: 'inde-du-nord', image: '/images/dest-tajmahal.jpg', tagline: 'Le Taj Mahal et le Fort Rouge impérial' },
  { name: 'Varanasi', region: 'inde-du-nord', image: '/images/dest-varanasi.jpg', tagline: 'Ville sainte sur les rives du Gange' },
  { name: 'Amritsar', region: 'inde-du-nord', image: '/images/dest-jodhpur.jpg', tagline: 'Le Temple d\'Or et la spiritualité Sikh' },
  { name: 'Dharamsala', region: 'inde-du-nord', image: '/images/dest-himachal.jpg', tagline: 'Résidence du Dalaï-Lama au pied de l\'Himalaya' },
  { name: 'Rishikesh', region: 'inde-du-nord', image: '/images/image-12.jpg', tagline: 'Capitale mondiale du Yoga et du Gange' },

  // Ladakh & Himalaya
  { name: 'Ladakh', region: 'ladakh', image: '/images/dest-ladakh.jpg', tagline: 'Monastères perchés et cols d\'altitude' },
  { name: 'Spiti Valley', region: 'ladakh', image: '/images/dest-himachal.jpg', tagline: 'Vallées secrètes et monastères millénaires' },

  // South India
  { name: 'Kerala', region: 'inde-du-sud', image: '/images/dest-kerala.jpg', tagline: 'Lagunes des Backwaters et collines de thé' },
  { name: 'Tamil Nadu', region: 'inde-du-sud', image: '/images/dest-karnataka.jpg', tagline: 'Temples dravidiens et Pondichéry' },
  { name: 'Karnataka', region: 'inde-du-sud', image: '/images/image-6.jpg', tagline: 'Ruines de Hampi et Palais de Mysore' },
  { name: 'Goa', region: 'inde-du-sud', image: '/images/dest-goa.jpg', tagline: 'Plages sous les cocotiers et églises portugaises' },
  { name: 'Orissa', region: 'inde-du-sud', image: '/images/dest-orissa.jpg', tagline: 'Temple du Soleil de Konark et sanctuaires' },

  // Gujarat & West India (Inde de l'Ouest)
  { name: 'Gujarat', region: 'inde-de-louest', image: '/images/dest-gujarat.jpg', tagline: 'Désert de sel de Kutch et lions d\'Asie' },
  { name: 'Désert du Rann de Kutch', region: 'inde-de-louest', image: '/images/dest-gujarat.jpg', tagline: 'Immense étendue de sel et traditions artisanales' },
  { name: 'Palitana', region: 'inde-de-louest', image: '/images/dest-gujarat.jpg', tagline: 'Cité sainte jaïn aux 900 temples sur la colline de Shatrunjaya' },

  // Nepal
  { name: 'Kathmandu', region: 'nepal', image: '/images/dest-nepal.jpg', tagline: 'Cités médiévales et stupas sacrées' },
  { name: 'Pokhara', region: 'nepal', image: '/images/dest-nepal.jpg', tagline: 'Lacs tranquilles au pied des Annapurnas' },
  { name: 'Chitwan', region: 'nepal', image: '/images/slide8-300x176.jpg', tagline: 'Jungle et safaris rhinocéros' },

  // Bhutan
  { name: 'Thimphu', region: 'bhoutan', image: '/images/jaipur-travel.jpg', tagline: 'Capitale préservée et forteresses Dzong' },
  { name: 'Paro', region: 'bhoutan', image: '/images/image-9.jpg', tagline: 'Le monastère du Nid du Tigre' },
  { name: 'Punakha', region: 'bhoutan', image: '/images/Voyage-Jaisalmer.jpg', tagline: 'Majestueux Dzong de Punakha' }
];

const REGION_TABS = [
  { key: 'all', label: 'All Regions', icon: 'fas fa-globe-asia' },
  { key: 'inde-du-nord', label: 'North India', icon: 'fas fa-gopuram' },
  { key: 'rajasthan', label: 'Rajasthan', icon: 'fas fa-chess-king' },
  { key: 'inde-du-sud', label: 'South India', icon: 'fas fa-tree' },
  { key: 'inde-de-louest', label: "West India (Inde de l'Ouest)", icon: 'fas fa-compass' },
  { key: 'ladakh', label: 'Ladakh & Himalaya', icon: 'fas fa-mountain' },
  { key: 'gujarat', label: 'Gujarat', icon: 'fas fa-sun' },
  { key: 'nepal', label: 'Nepal', icon: 'fas fa-hiking' },
  { key: 'bhoutan', label: 'Bhutan', icon: 'fas fa-place-of-worship' }
];

const AdminDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDest, setEditingDest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const initialForm = {
    name: '',
    slug: '',
    region: 'inde-du-nord',
    tagline: '',
    shortDescription: '',
    fullDescription: '',
    bestTimeToVisit: "From October to April",
    image: '/images/dest-rajasthan.jpg',
    highlights: ['Must-see highlight', 'Local culture & heritage', 'Dedicated private guide'],
    seoTitle: '',
    seoKeywords: '',
    seoDescription: '',
    featured: false,
    published: true
  };

  const [formData, setFormData] = useState(initialForm);

  const loadDestinations = () => {
    setLoading(true);
    fetchAdminDestinations()
      .then((res) => {
        setDestinations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const handleOpenCreate = () => {
    setEditingDest(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dest) => {
    setEditingDest(dest);
    setFormData({
      ...initialForm,
      ...dest,
      seoTitle: dest.seoTitle || `${dest.name} — Voyage & Circuit Sur Mesure | Jodhpur Voyage`,
      seoKeywords: dest.seoKeywords || `${(dest.name || '').toLowerCase()}, voyage ${(dest.name || '').toLowerCase()}, circuit inde`,
      seoDescription: dest.seoDescription || dest.shortDescription || `${dest.name} - découvrez nos offres et circuits sur mesure avec chauffeur privé.`,
      highlights: dest.highlights && dest.highlights.length > 0 ? dest.highlights : initialForm.highlights
    });
    setIsModalOpen(true);
  };

  const handleApplyPreset = (preset) => {
    setFormData({
      ...formData,
      name: preset.name,
      region: preset.region,
      image: preset.image,
      tagline: preset.tagline,
      shortDescription: formData.shortDescription || `Explore ${preset.name} with our private chauffeurs and expert travel advisors.`
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this destination?')) return;
    try {
      await deleteDestination(id);
      loadDestinations();
    } catch (err) {
      alert('Error deleting destination.');
    }
  };

  const handleTogglePublish = async (dest) => {
    try {
      await updateDestination(dest._id, { published: !dest.published });
      loadDestinations();
    } catch (err) {
      alert('Error updating status.');
    }
  };

  const handleToggleFeatured = async (dest) => {
    try {
      await updateDestination(dest._id, { featured: !dest.featured });
      loadDestinations();
    } catch (err) {
      alert('Error updating status.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingDest) {
        await updateDestination(editingDest._id, formData);
      } else {
        await createDestination(formData);
      }
      setIsModalOpen(false);
      loadDestinations();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving destination.');
    } finally {
      setSaving(false);
    }
  };

  const filteredDestinations = destinations.filter((dest) => {
    const matchesRegion =
      activeTab === 'all' ||
      dest.region === activeTab ||
      (activeTab === 'inde-du-nord' && (dest.region === 'inde-du-nord' || dest.region === 'ladakh')) ||
      (activeTab === 'inde-du-sud' && (dest.region === 'inde-du-sud')) ||
      (activeTab === 'inde-de-louest' && (dest.region === 'inde-de-louest' || dest.region === 'inde-du-ouest' || dest.region === 'ouest' || dest.region === 'gujarat')) ||
      (activeTab === 'nepal' && dest.region === 'nepal') ||
      (activeTab === 'bhoutan' && dest.region === 'bhoutan');

    const matchesSearch =
      !searchTerm ||
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dest.tagline && dest.tagline.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dest.region && dest.region.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesRegion && matchesSearch;
  });

  const getRegionBadge = (region) => {
    switch (region) {
      case 'inde-du-nord':
      case 'ladakh':
        return <span className="admin-status-badge status-en-attente"><i className="fas fa-gopuram"></i> North India</span>;
      case 'inde-du-sud':
        return <span className="admin-status-badge status-confirme"><i className="fas fa-tree"></i> South India</span>;
      case 'inde-de-louest':
      case 'inde-du-ouest':
      case 'ouest':
        return <span className="admin-status-badge" style={{ background: '#ECFDF5', color: '#065F46' }}><i className="fas fa-compass"></i> West India</span>;
      case 'gujarat':
        return <span className="admin-status-badge" style={{ background: '#FEF3C7', color: '#92400E' }}><i className="fas fa-compass"></i> Gujarat (West)</span>;
      case 'nepal':
        return <span className="admin-status-badge" style={{ background: '#E0E7FF', color: '#3730A3' }}><i className="fas fa-mountain"></i> Nepal</span>;
      case 'bhoutan':
        return <span className="admin-status-badge" style={{ background: '#FEF3C7', color: '#92400E' }}><i className="fas fa-place-of-worship"></i> Bhutan</span>;
      default:
        return <span className="admin-status-badge">{region}</span>;
    }
  };

  return (
    <AdminLayout 
      title="Destinations & Mega-Menu Columns" 
      subtitle="Organize destinations displayed in the 5 navigation mega-menu columns and destination landing pages."
    >
      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div className="admin-filter-bar" style={{ margin: 0 }}>
          {REGION_TABS.map((tab) => (
            <button 
              key={tab.key}
              className={`admin-filter-chip ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
              {activeTab === tab.key && (
                <span className="admin-filter-count">{filteredDestinations.length}</span>
              )}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }}></i>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search destination..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '34px', fontSize: '0.88rem', height: '38px', borderRadius: '8px' }}
            />
          </div>

          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <i className="fas fa-plus"></i> Add Destination
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: 'var(--admin-primary)' }}></i>
          <p style={{ marginTop: '16px', color: 'var(--admin-text-muted)' }}>Loading destinations...</p>
        </div>
      ) : filteredDestinations.length === 0 ? (
        <div className="admin-table-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <i className="fas fa-map-marked-alt" style={{ fontSize: '3rem', color: '#CBD5E1', marginBottom: '16px', display: 'block' }}></i>
          <h3 style={{ color: 'var(--admin-text-main)', margin: '0 0 8px' }}>No destinations found</h3>
          <p style={{ color: 'var(--admin-text-muted)', margin: '0 0 16px' }}>Add your destinations to populate the mega-menu navigation.</p>
          <button className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
            <i className="fas fa-plus"></i> New Destination
          </button>
        </div>
      ) : (
        <div className="admin-table-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Mega-Menu Column</th>
                  <th>Best Season</th>
                  <th>Featured (Highlight)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDestinations.map((d) => (
                  <tr key={d._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img 
                          src={d.image || '/images/dest-rajasthan.jpg'} 
                          onError={(e) => { e.currentTarget.src = "/images/dest-rajasthan.jpg"; }}
                          alt={d.name} 
                          style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E2E8F0' }} 
                        />
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: 'var(--admin-text-main)' }}>{d.name}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                            {d.tagline || d.shortDescription?.substring(0, 45) + '...'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {getRegionBadge(d.region)}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{d.bestTimeToVisit || "From October to April"}</td>
                    <td>
                      <button 
                        className={`admin-status-badge ${d.featured ? 'status-confirme' : 'status-annule'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={() => handleToggleFeatured(d)}
                        title="Click to toggle featured card in mega-menu"
                      >
                        <i className={`fas ${d.featured ? 'fa-star' : 'fa-star-half-alt'}`}></i> {d.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td>
                      <button 
                        className={`admin-status-badge ${d.published !== false ? 'status-confirme' : 'status-annule'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={() => handleTogglePublish(d)}
                        title="Click to toggle visibility"
                      >
                        <i className={`fas ${d.published !== false ? 'fa-check' : 'fa-eye-slash'}`}></i> {d.published !== false ? 'Online' : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-sm btn-outline" onClick={() => handleOpenEdit(d)} title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm" style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' }} onClick={() => handleDelete(d._id)} title="Delete">
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
      )}      {/* Modal Add / Edit Destination */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: 0, overflow: 'hidden' }}>
              <div className="modal-header">
                <h3 className="modal-title">
                  <i className="fas fa-map-marked-alt" style={{ color: 'var(--admin-primary)' }}></i>
                  <span>{editingDest ? `Edit: ${editingDest.name}` : 'Add New Destination'}</span>
                </h3>
                <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)} title="Close dialog">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body">
                {/* Quick City / Destination Preset Selector */}
                <div style={{ marginBottom: '16px', padding: '14px', background: '#F0F7F7', borderRadius: '10px', border: '1px solid #C4E3E5' }}>
                  <label className="form-label" style={{ fontWeight: '700', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <i className="fas fa-city"></i> Select City / Destination Preset
                    <span style={{ fontSize: '0.78rem', fontWeight: 'normal', color: '#64748B' }}>(Auto-fills city name, region, tagline & photo)</span>
                  </label>
                  
                  <select
                    className="form-control"
                    style={{ fontWeight: '600', marginBottom: '8px' }}
                    value=""
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      const foundPreset = PRESET_DESTINATIONS.find(p => p.name.toLowerCase() === selectedName.toLowerCase());
                      if (foundPreset) {
                        handleApplyPreset(foundPreset);
                      }
                    }}
                  >
                    <option value="">-- Choose City / Destination from preset list --</option>
                    {PRESET_DESTINATIONS.map((preset, idx) => (
                      <option key={idx} value={preset.name}>
                        📍 {preset.name} ({preset.region.toUpperCase()})
                      </option>
                    ))}
                  </select>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#475569' }}>Quick Pick:</span>
                    {PRESET_DESTINATIONS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.72rem', padding: '2px 8px', background: '#fff', borderRadius: '12px', border: '1px solid #CBD5E1' }}
                        onClick={() => handleApplyPreset(preset)}
                      >
                        + {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Destination / City Name *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control" 
                      placeholder="e.g. Rajasthan, Pokhara, Jodhpur..." 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Mega-Menu Column (Region) *</label>
                    <select 
                      className="form-control" 
                      value={formData.region} 
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    >
                      <option value="inde-du-nord">Inde du Nord (Delhi, Agra, Varanasi, Amritsar, Rishikesh...)</option>
                      <option value="rajasthan">Rajasthan (Jodhpur, Jaipur, Udaipur, Jaisalmer...)</option>
                      <option value="inde-du-sud">Inde du Sud (Kerala, Tamil Nadu, Karnataka, Goa...)</option>
                      <option value="inde-de-louest">Inde de l'Ouest / Inde du Ouest (Gujarat, Rann de Kutch, Palitana...)</option>
                      <option value="ladakh">Himalaya & Ladakh (Leh, Spiti, Dharamsala, Sikkim...)</option>
                      <option value="gujarat">Gujarat (Rann de Kutch, Ahmedabad, Palitana...)</option>
                      <option value="nepal">Népal (Katmandou, Chitwan, Pokhara...)</option>
                      <option value="bhoutan">Bhoutan (Thimphu, Paro, Punakha...)</option>
                      <option value="centre-est">Centre & Est (Madhya Pradesh, Orissa...)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Tagline / Catchphrase</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Royal Fortresses and Thar Desert" 
                      value={formData.tagline} 
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Best Time to Visit</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. From October to end of March" 
                      value={formData.bestTimeToVisit} 
                      onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })} 
                    />
                  </div>
                </div>

                <AdminImageUpload
                  label="Destination Photo / Banner (Local Upload / Cloudinary)"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  placeholder="https://... or click 'Upload from Device'"
                />

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontWeight: '600' }}>Short Overview (Cards & Mega-Menu) *</label>
                  <textarea 
                    rows="2" 
                    required 
                    className="form-control" 
                    placeholder="Brief description of the destination..." 
                    value={formData.shortDescription} 
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  ></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label" style={{ fontWeight: '600' }}>Detailed Travel Guide & Culture</label>
                  <textarea 
                    rows="4" 
                    className="form-control" 
                    placeholder="Comprehensive content for the dedicated destination page..." 
                    value={formData.fullDescription} 
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  ></textarea>
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
                      placeholder="e.g. Voyage Rajasthan sur mesure | Circuits & Hôtels | Jodhpur Voyage" 
                      value={formData.seoTitle || ''} 
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} 
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>SEO Meta Keywords (Comma separated)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. rajasthan voyage, circuit rajasthan, jodhpur voyage" 
                      value={formData.seoKeywords || ''} 
                      onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })} 
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>SEO Meta Description</label>
                    <textarea 
                      rows="2" 
                      className="form-control" 
                      placeholder="e.g. Partez à la découverte du Rajasthan avec chauffeur privé et hébergements de charme." 
                      value={formData.seoDescription || ''} 
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} 
                    ></textarea>
                  </div>
                </div>

                {/* Options Checkboxes */}
                <div style={{ display: 'flex', gap: '24px', padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.featured} 
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} 
                    />
                    <span>⭐ Highlighted Card in Mega-Menu</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.published} 
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })} 
                    />
                    <span>✅ Online (Visible on website)</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Destination</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDestinations;
