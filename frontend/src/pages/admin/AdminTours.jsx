import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import AdminImageUpload from '../../components/AdminImageUpload';
import RichTextEditor from '../../components/RichTextEditor';
import { 
  fetchAdminTours, 
  fetchAdminDestinations, 
  createTour, 
  updateTour, 
  deleteTour, 
  unfeatureAllTours,
  uploadMultipleImages
} from '../../services/api';

const DEFAULT_DESTINATIONS_PRESETS = [
  { name: 'Agra', region: 'inde-du-nord', slug: 'agra' },
  { name: 'Amritsar', region: 'inde-du-nord', slug: 'amritsar' },
  { name: 'Bénarès', region: 'inde-du-nord', slug: 'varanasi' },
  { name: 'Bhoutan', region: 'bhoutan', slug: 'bhoutan' },
  { name: 'Bombay', region: 'inde-du-sud', slug: 'bombay' },
  { name: 'Chennai', region: 'inde-du-sud', slug: 'chennai' },
  { name: 'Darjeeling & Sikkim', region: 'inde-de-louest', slug: 'darjeeling-sikkim' },
  { name: 'Delhi', region: 'inde-du-nord', slug: 'delhi' },
  { name: 'Goa', region: 'inde-du-sud', slug: 'goa' },
  { name: 'Gujarat', region: 'gujarat', slug: 'gujarat' },
  { name: 'Himachal Pradesh', region: 'inde-du-nord', slug: 'himachal-pradesh' },
  { name: 'Karnataka', region: 'inde-du-sud', slug: 'karnataka' },
  { name: 'Kerala', region: 'inde-du-sud', slug: 'kerala' },
  { name: 'Ladakh', region: 'ladakh', slug: 'ladakh' },
  { name: 'Madhya Pradesh', region: 'centre-est', slug: 'madhya-pradesh' },
  { name: 'Madras', region: 'inde-du-sud', slug: 'madras' },
  { name: 'Népal', region: 'nepal', slug: 'nepal' },
  { name: 'Orissa', region: 'inde-du-sud', slug: 'orissa' },
  { name: 'Rajasthan', region: 'rajasthan', slug: 'rajasthan' },
  { name: 'Rishikesh', region: 'inde-du-nord', slug: 'rishikesh' },
  { name: 'Tamil Nadu', region: 'inde-du-sud', slug: 'tamil-nadu' }
];

const slugify = (text) => {
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const AdminTours = () => {
  const [tours, setTours] = useState([]);
  const [destinationsList, setDestinationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTour, setEditingTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customCityInput, setCustomCityInput] = useState('');
  const [isSlugTouched, setIsSlugTouched] = useState(false);

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
    badge: 'Populaire',
    rating: 4.9,
    reviewCount: 30,
    image: '/images/dest-rajasthan.jpg',
    gallery: [],
    overview: '',
    highlights: ['Visite du Taj Mahal', 'Palais royaux de Jaipur', 'Fort de Mehrangarh à Jodhpur'],
    itinerary: [
      { day: 1, title: 'Arrivée à Delhi', description: 'Accueil chaleureux par votre chauffeur privé francophone à l\'aéroport et transfert à votre hôtel.', meals: 'Dîner libre', accommodation: 'Hôtel de charme 4*' },
      { day: 2, title: 'Delhi - Jaipur', description: 'Route vers la Ville Rose du Rajasthan. Découverte des bazars colorés et du Palais des Vents (Hawa Mahal).', meals: 'Petit-déjeuner inclus', accommodation: 'Haveli de patrimoine' }
    ],
    inclusions: ['Véhicule privé climatisé & chauffeur', 'Hébergements de charme & petits-déjeuners', 'Assistance francophone 24h/24'],
    exclusions: ['Vols internationaux', 'Frais de visa électronique pour l\'Inde', 'Pourboires et dépenses personnelles'],
    seoTitle: '',
    seoKeywords: '',
    seoDescription: '',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    featured: false,
    cultureSafari: false,
    published: true
  };

  const [formData, setFormData] = useState(initialForm);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const galleryFileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('all');
  const [selectedFilterStatus, setSelectedFilterStatus] = useState('all');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const categoryDropdownRef = useRef(null);
  const categorySearchInputRef = useRef(null);

  // Dynamic pagination: 10 items without filter, 9 items with active filter
  const getItemsPerPage = (cat = selectedFilterCategory, stat = selectedFilterStatus, srch = searchTerm) => {
    const hasFilter = (cat && cat !== 'all') || (stat && stat !== 'all') || Boolean(srch && srch.trim());
    return hasFilter ? 9 : 10;
  };

  const loadTours = (page = 1, search = searchTerm, category = selectedFilterCategory, status = selectedFilterStatus) => {
    setLoading(true);
    const limit = getItemsPerPage(category, status, search);
    const catObj = combinedCategories.find(c => 
      (c.name || '').toLowerCase() === (category || '').toLowerCase() ||
      (c.slug || '').toLowerCase() === (category || '').toLowerCase() ||
      String(c._id || '') === String(category)
    );
    const isObjectId = catObj?._id && /^[0-9a-fA-F]{24}$/.test(String(catObj._id));
    const categoryId = (category && category !== 'all' && isObjectId) ? String(catObj._id) : undefined;
    const categoryName = (category && category !== 'all') ? (catObj?.name || category) : undefined;

    fetchAdminTours({
      page,
      limit: limit,
      search: (search || '').trim() || undefined,
      category: categoryName,
      categoryId: categoryId,
      status: status !== 'all' ? status : undefined
    })
      .then((res) => {
        if (res.data && res.data.tours) {
          setTours(res.data.tours);
          setTotalRecords(res.data.total !== undefined ? res.data.total : res.data.tours.length);
          setTotalPages(res.data.totalPages || 1);
          setCurrentPage(res.data.page || page);
        } else {
          const list = Array.isArray(res.data) ? res.data : [];
          setTours(list);
          setTotalRecords(list.length);
          setTotalPages(Math.ceil(list.length / limit) || 1);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setTours([]);
        setTotalRecords(0);
        setTotalPages(1);
        setLoading(false);
      });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage !== currentPage) {
      setCurrentPage(newPage);
      loadTours(newPage, searchTerm, selectedFilterCategory, selectedFilterStatus);
    }
  };

  const getPageNumbers = (totPages, curPage) => {
    const pages = [];
    const totalP = Math.max(1, totPages || 1);
    const activeP = Math.min(Math.max(1, curPage || 1), totalP);
    if (totalP <= 7) {
      for (let i = 1; i <= totalP; i++) pages.push(i);
    } else {
      if (activeP <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalP);
      } else if (activeP >= totalP - 3) {
        pages.push(1, '...', totalP - 4, totalP - 3, totalP - 2, totalP - 1, totalP);
      } else {
        pages.push(1, '...', activeP - 1, activeP, activeP + 1, '...', totalP);
      }
    }
    return pages;
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

  useEffect(() => {
    loadTours();
    loadDestinations();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => {
        if (categorySearchInputRef.current) {
          categorySearchInputRef.current.focus();
        }
      }, 30);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCategoryDropdownOpen]);

  // Source destinations directly from the Destination Panel (/admin/destinations)
  const combinedCategories = [];
  const seenCatNames = new Set();

  if (Array.isArray(destinationsList) && destinationsList.length > 0) {
    destinationsList.forEach((d) => {
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
  }
  
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

  // Build combined list of all destinations for city tags (sourced from Destination Panel)
  const allDestinationsMap = (Array.isArray(destinationsList) && destinationsList.length > 0)
    ? destinationsList.map((d) => ({
        _id: d._id,
        name: d.name,
        slug: d.slug || d.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
        region: d.region || 'inde-du-nord'
      }))
    : DEFAULT_DESTINATIONS_PRESETS;

  const handleOpenCreate = () => {
    loadDestinations();
    setEditingTour(null);
    setIsSlugTouched(false);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tour) => {
    loadDestinations();
    setEditingTour(tour);
    setIsSlugTouched(true);
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
      cultureSafari: Boolean(tour.cultureSafari === true),
      published: tour.published !== false,
      seoTitle: tour.seoTitle || tour.metaTitle || '',
      metaTitle: tour.seoTitle || tour.metaTitle || '',
      seoKeywords: tour.seoKeywords || tour.metaKeywords || '',
      metaKeywords: tour.seoKeywords || tour.metaKeywords || '',
      seoDescription: tour.seoDescription || tour.metaDescription || '',
      highlights: (Array.isArray(tour.highlights) && tour.highlights.length > 0)
        ? tour.highlights
        : ['Visite du Taj Mahal', 'Palais royaux de Jaipur', 'Fort de Mehrangarh à Jodhpur'],
      gallery: Array.isArray(tour.gallery) && tour.gallery.length > 0 ? tour.gallery : (tour.image ? [tour.image] : []),
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

  const handleAddHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), '']
    }));
  };

  const handleHighlightChange = (index, value) => {
    const list = [...(formData.highlights || [])];
    list[index] = value;
    setFormData((prev) => ({ ...prev, highlights: list }));
  };

  const handleRemoveHighlight = (index) => {
    const list = [...(formData.highlights || [])];
    list.splice(index, 1);
    setFormData((prev) => ({ ...prev, highlights: list }));
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (!editingTour && !isSlugTouched) {
      setFormData(prev => ({
        ...prev,
        title: newTitle,
        slug: slugify(newTitle)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        title: newTitle
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const sTitle = (formData.seoTitle || formData.metaTitle || '').trim();
      const sKeywords = (formData.seoKeywords || formData.metaKeywords || '').trim();
      const sDesc = (formData.seoDescription || formData.metaDescription || '').trim();
      const finalSlug = (formData.slug || slugify(formData.title || '')).toLowerCase().trim().replace(/^-+|-+$/g, '');

      const payload = {
        ...formData,
        slug: finalSlug,
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

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setCurrentPage(1);
    loadTours(1, val, selectedFilterCategory, selectedFilterStatus);
  };

  const handleCategoryFilterChange = (e) => {
    const val = e.target.value;
    setSelectedFilterCategory(val);
    setCurrentPage(1);
    loadTours(1, searchTerm, val, selectedFilterStatus);
  };

  const handleSelectCategory = (catName) => {
    setSelectedFilterCategory(catName);
    setIsCategoryDropdownOpen(false);
    setCategorySearchQuery('');
    setCurrentPage(1);
    loadTours(1, searchTerm, catName, selectedFilterStatus);
  };

  const filteredCategoryList = combinedCategories.filter((c) =>
    (c.name || '').toLowerCase().includes(categorySearchQuery.trim().toLowerCase())
  );

  const handleStatusFilterChange = (e) => {
    const val = e.target.value;
    setSelectedFilterStatus(val);
    setCurrentPage(1);
    loadTours(1, searchTerm, selectedFilterCategory, val);
  };

  const isTourInCategory = (tour, targetCat) => {
    if (!targetCat || targetCat === 'all') return true;
    const catClean = targetCat.trim().toLowerCase();
    const tourCat = (tour.category || tour.destination || '').trim().toLowerCase();
    const tourCatId = String(tour.categoryId || '').trim().toLowerCase();

    if (catClean === 'rajasthan') {
      return tourCat === 'rajasthan' || (tourCat.includes('rajasthan') && !tourCat.includes('gujarat'));
    }
    if (catClean === 'delhi') {
      return tourCat === 'delhi' && !tourCat.includes('rajasthan');
    }
    if (catClean === 'agra') {
      return tourCat === 'agra' || tourCatId === 'agra';
    }
    if (catClean === 'amritsar') {
      return tourCat === 'amritsar' || tourCat === 'punjab' || tourCat.includes('amritsar');
    }
    if (catClean === 'varanasi' || catClean === 'benares' || catClean === 'bénarès') {
      return tourCat === 'varanasi' || tourCat === 'benares' || tourCat === 'bénarès' || tourCat.includes('varanasi') || tourCat.includes('bénarès') || tourCat.includes('benares');
    }
    if (catClean === 'himachal-pradesh' || catClean === 'himachal pradesh' || catClean === 'himachal') {
      return tourCat === 'himachal pradesh' || tourCat === 'himachal' || tourCat.includes('himachal') || tourCat.includes('dharamsala') || tourCat.includes('spiti') || tourCat.includes('kinnaur');
    }
    if (catClean === 'ladakh') {
      return tourCat === 'ladakh' || tourCat.includes('ladakh');
    }
    if (catClean === 'rishikesh' || catClean === 'uttarakhand') {
      return tourCat === 'rishikesh' || tourCat.includes('rishikesh') || tourCat === 'uttarakhand' || tourCat.includes('uttarakhand');
    }
    if (catClean === 'chennai') {
      return tourCat === 'chennai' || tourCatId === 'chennai';
    }
    if (catClean === 'madras') {
      return tourCat === 'madras';
    }
    if (catClean === 'bombay' || catClean === 'mumbai') {
      return tourCat === 'bombay' || tourCat === 'mumbai';
    }
    if (catClean === 'goa') {
      return tourCat === 'goa' || tourCatId === 'goa';
    }
    if (catClean === 'karnataka') {
      return tourCat === 'karnataka' || tourCat.includes('karnataka');
    }
    if (catClean === 'kerala') {
      return tourCat === 'kerala' || tourCat.includes('kerala');
    }
    if (catClean === 'tamil-nadu' || catClean === 'tamil nadu' || catClean === 'tamil') {
      return tourCat === 'tamil nadu' || tourCat === 'tamil' || tourCat.includes('tamil');
    }
    if (catClean === 'orissa' || catClean === 'odisha') {
      return tourCat === 'orissa' || tourCat === 'odisha';
    }
    if (catClean === 'gujarat') {
      return tourCat === 'gujarat' || tourCat.includes('gujarat');
    }
    if (catClean === 'madhya-pradesh' || catClean === 'madhya pradesh' || catClean === 'madhya') {
      return tourCat === 'madhya pradesh' || tourCat === 'madhya' || tourCat.includes('madhya');
    }
    if (catClean === 'darjeeling & sikkim' || catClean === 'darjeeling-sikkim' || catClean === 'darjeeling' || catClean === 'sikkim') {
      return tourCat.includes('darjeeling') || tourCat.includes('sikkim');
    }
    if (catClean === 'nepal' || catClean === 'népal') {
      return tourCat === 'nepal' || tourCat === 'népal';
    }
    if (catClean === 'bhoutan' || catClean === 'punakha' || catClean === 'paro' || catClean === 'thimphu') {
      return tourCat === 'bhoutan' || tourCat.includes('bhoutan') || tourCat === catClean;
    }

    return tourCat === catClean || tourCatId === catClean;
  };

  const displayTours = Array.isArray(tours) ? tours : [];
  const filteredTours = displayTours.filter(t => {
    // 1. Strict Category Guard: Must match the category column, NOT transit tags or cities
    if (selectedFilterCategory && selectedFilterCategory !== 'all') {
      if (!isTourInCategory(t, selectedFilterCategory)) {
        return false;
      }
    }
    // 2. Status filter guard
    if (selectedFilterStatus && selectedFilterStatus !== 'all') {
      if (selectedFilterStatus === 'published' && t.published === false) return false;
      if (selectedFilterStatus === 'draft' && t.published !== false) return false;
    }
    // 3. Search filter guard
    if (searchTerm && searchTerm.trim()) {
      const s = searchTerm.trim().toLowerCase();
      const title = (t.title || '').toLowerCase();
      const cat = (t.category || '').toLowerCase();
      const loc = (t.location || '').toLowerCase();
      const cities = Array.isArray(t.cities) 
        ? t.cities.map(c => typeof c === 'string' ? c : c.name || '').join(' ').toLowerCase() 
        : '';
      if (!title.includes(s) && !cat.includes(s) && !loc.includes(s) && !cities.includes(s)) {
        return false;
      }
    }
    return true;
  });

  const itemsPerPage = getItemsPerPage(selectedFilterCategory, selectedFilterStatus, searchTerm);
  const effectiveTotal = (selectedFilterCategory !== 'all' || selectedFilterStatus !== 'all' || Boolean(searchTerm && searchTerm.trim()))
    ? (totalRecords > 0 && totalRecords === displayTours.length ? filteredTours.length : (filteredTours.length === 0 ? 0 : (totalRecords || filteredTours.length)))
    : (totalRecords || filteredTours.length);

  const maxPages = Math.max(1, Math.ceil(effectiveTotal / itemsPerPage));
  const activePage = Math.min(Math.max(1, currentPage), maxPages);

  const startRecord = effectiveTotal === 0 ? 0 : (activePage - 1) * itemsPerPage + 1;
  const endRecord = effectiveTotal === 0 ? 0 : Math.min(startRecord + filteredTours.length - 1, effectiveTotal);

  return (
    <AdminLayout 
      title="Tours & Travel Itineraries" 
      subtitle="Manage published tour packages, linked destination categories, and connected city tags."
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: '1 1 520px' }}>
          <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 220px' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)', pointerEvents: 'none' }}></i>
            <input 
              type="text" 
              placeholder="Search tour, city..." 
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                paddingLeft: '34px',
                paddingRight: '12px',
                paddingTop: 0,
                paddingBottom: 0,
                fontSize: '0.88rem',
                height: '38px',
                lineHeight: '38px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          {/* Searchable Category Dropdown */}
          <div ref={categoryDropdownRef} style={{ position: 'relative', minWidth: '190px' }}>
            <button
              type="button"
              onClick={() => {
                setIsCategoryDropdownOpen(prev => !prev);
                setCategorySearchQuery('');
              }}
              style={{
                width: '100%',
                height: '38px',
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                fontSize: '0.88rem',
                fontWeight: '600',
                color: selectedFilterCategory === 'all' ? '#0f172a' : '#047857',
                backgroundColor: selectedFilterCategory === 'all' ? '#ffffff' : '#f0fdf4',
                border: selectedFilterCategory === 'all' ? '1.5px solid #cbd5e1' : '1.5px solid #10b981',
                borderRadius: '8px',
                outline: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box',
                transition: 'all 0.15s ease'
              }}
              title="Click to search and filter by Destination / Category"
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '7px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#f59e0b', fontSize: '0.95rem' }}>📁</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedFilterCategory === 'all' ? 'All Categories' : selectedFilterCategory}
                </span>
              </span>

              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {selectedFilterCategory !== 'all' && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory('all');
                    }}
                    title="Reset to All Categories"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#e2e8f0',
                      color: '#475569',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca'; e.currentTarget.style.color = '#dc2626'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
                  >
                    ✕
                  </span>
                )}
                <i 
                  className={`fas fa-chevron-${isCategoryDropdownOpen ? 'up' : 'down'}`} 
                  style={{ fontSize: '0.72rem', color: '#64748b' }}
                ></i>
              </span>
            </button>

            {/* Dropdown Menu with Search Field */}
            {isCategoryDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  minWidth: '240px',
                  width: 'max-content',
                  maxWidth: '320px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.15), 0 6px 12px -4px rgba(0, 0, 0, 0.08)',
                  zIndex: 9999,
                  overflow: 'hidden'
                }}
              >
                {/* Search input inside dropdown */}
                <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <div style={{ position: 'relative' }}>
                    <i 
                      className="fas fa-search" 
                      style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.78rem', color: '#94a3b8', pointerEvents: 'none' }}
                    ></i>
                    <input
                      ref={categorySearchInputRef}
                      type="text"
                      placeholder="Search category (e.g. Rajasthan, Agra)..."
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 26px 6px 30px',
                        fontSize: '0.82rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        outline: 'none',
                        background: '#ffffff',
                        color: '#0f172a',
                        boxSizing: 'border-box'
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') setIsCategoryDropdownOpen(false);
                        if (e.key === 'Enter') {
                          if (filteredCategoryList.length > 0) {
                            handleSelectCategory(filteredCategoryList[0].name);
                          }
                        }
                      }}
                    />
                    {categorySearchQuery && (
                      <span
                        onClick={() => setCategorySearchQuery('')}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '0.72rem',
                          color: '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        ✕
                      </span>
                    )}
                  </div>
                </div>

                {/* List of categories */}
                <div style={{ maxHeight: '250px', overflowY: 'auto', padding: '4px 0' }}>
                  {/* Option: All Categories */}
                  {!categorySearchQuery && (
                    <div
                      onClick={() => handleSelectCategory('all')}
                      style={{
                        padding: '8px 14px',
                        fontSize: '0.85rem',
                        fontWeight: selectedFilterCategory === 'all' ? '700' : '500',
                        color: selectedFilterCategory === 'all' ? '#0f766e' : '#334155',
                        background: selectedFilterCategory === 'all' ? '#f0fdfa' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                      onMouseEnter={(e) => { if (selectedFilterCategory !== 'all') e.currentTarget.style.background = '#f8fafc'; }}
                      onMouseLeave={(e) => { if (selectedFilterCategory !== 'all') e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>📁</span>
                        <span>All Categories</span>
                      </span>
                      {selectedFilterCategory === 'all' && (
                        <i className="fas fa-check" style={{ fontSize: '0.75rem', color: '#0f766e' }}></i>
                      )}
                    </div>
                  )}

                  {filteredCategoryList.length === 0 ? (
                    <div style={{ padding: '16px 12px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                      <i className="fas fa-filter" style={{ marginRight: '6px' }}></i> No matching category found
                    </div>
                  ) : (
                    filteredCategoryList.map((c) => {
                      const isSelected = selectedFilterCategory.toLowerCase() === c.name.toLowerCase();
                      return (
                        <div
                          key={c._id || c.name}
                          onClick={() => handleSelectCategory(c.name)}
                          style={{
                            padding: '8px 14px',
                            fontSize: '0.85rem',
                            fontWeight: isSelected ? '700' : '500',
                            color: isSelected ? '#047857' : '#1e293b',
                            background: isSelected ? '#f0fdf4' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'background 0.1s'
                          }}
                          onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#f8fafc'; }}
                          onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>📁</span>
                            <span>{c.name}</span>
                          </span>
                          {isSelected && (
                            <i className="fas fa-check" style={{ fontSize: '0.75rem', color: '#047857' }}></i>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <select
            value={selectedFilterStatus}
            onChange={handleStatusFilterChange}
            style={{
              height: '38px',
              padding: '0 28px 0 12px',
              fontSize: '0.88rem',
              fontWeight: '600',
              color: '#0f172a',
              backgroundColor: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '8px',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '130px',
              lineHeight: '38px',
              appearance: 'auto',
              WebkitAppearance: 'menulist',
              boxSizing: 'border-box'
            }}
          >
            <option value="all">🌐 All Status</option>
            <option value="published">🟢 Published</option>
            <option value="draft">⚪ Draft</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link 
            to="/admin/itinerary-slider" 
            className="btn btn-outline" 
            style={{ background: '#F0FDFA', color: '#0D9488', borderColor: '#99F6E4', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Manage Itinerary Sliders across all tours"
          >
            <i className="fas fa-images"></i> Itinerary Sliders
          </Link>
          <button 
            type="button" 
            className="btn" 
            onClick={handleUnfeatureAll}
            style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Décocher tous les circuits de la page d'accueil"
          >
            <i className="fas fa-eye-slash"></i> Retirer de l'Accueil
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
                          <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                            <code style={{ background: '#F1F5F9', padding: '1px 5px', borderRadius: '4px', fontSize: '0.74rem', color: '#475569', border: '1px solid #E2E8F0' }}>/{t.slug}</code>
                            {t.subtitle ? <span>• {t.subtitle.slice(0, 38)}...</span> : ''}
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
                      {t.cultureSafari && (
                        <span className="admin-status-badge" style={{ marginLeft: '4px', background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' }}>
                          <i className="fas fa-paw"></i> Culture & Safari
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <Link 
                          to={`/admin/itinerary-slider?tour=${t._id}`} 
                          className="btn btn-sm btn-outline" 
                          style={{ background: '#F0FDFA', color: '#0D9488', borderColor: '#99F6E4', padding: '4px 8px', fontSize: '0.78rem' }} 
                          title="Manage Slider Images"
                        >
                          <i className="fas fa-images"></i> Slider ({Array.isArray(t.gallery) && t.gallery.length > 0 ? t.gallery.length : (t.image ? 1 : 0)})
                        </Link>
                        <button className="btn btn-sm btn-outline" onClick={() => handleOpenEdit(t)} title="Edit">
                          <i className="fas fa-edit"></i>
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

          {/* Pagination Footer - only shown when more than 1 page exists */}
          {maxPages > 1 && (
            <div className="admin-pagination-container" style={{ justifyContent: 'flex-end' }}>
              <div className="admin-pagination-controls">
                <button
                  type="button"
                  className="admin-page-btn admin-page-nav"
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={activePage === 1}
                  title="Previous Page"
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>

                {getPageNumbers(maxPages, activePage).map((p, idx) => {
                  if (p === '...') {
                    return <span key={`ellipsis-${idx}`} className="admin-page-ellipsis">•••</span>;
                  }
                  return (
                    <button
                      key={`page-${p}`}
                      type="button"
                      className={`admin-page-btn ${activePage === p ? 'active' : ''}`}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="admin-page-btn admin-page-nav"
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={activePage === maxPages}
                  title="Next Page"
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '920px', width: '96%' }}>
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
                  <input 
                    type="text" 
                    required 
                    className="form-control" 
                    placeholder="e.g. Treasures of Rajasthan & Ganges Valley" 
                    value={formData.title} 
                    onChange={handleTitleChange} 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label" style={{ fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fas fa-link" style={{ color: 'var(--admin-primary)' }}></i>
                      Slug (URL Key) *
                    </label>
                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{ 
                        fontSize: '0.75rem', 
                        padding: '2px 8px', 
                        background: '#F1F5F9', 
                        border: '1px solid #CBD5E1', 
                        color: '#475569', 
                        borderRadius: '4px',
                        cursor: 'pointer' 
                      }}
                      onClick={() => {
                        setIsSlugTouched(true);
                        setFormData(prev => ({ ...prev, slug: slugify(prev.title) }));
                      }}
                      title="Generate slug automatically from Tour Title"
                    >
                      <i className="fas fa-magic" style={{ marginRight: '4px', color: 'var(--admin-primary)' }}></i>
                      Auto-generate from Title
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ 
                      background: '#F8FAFC', 
                      border: '1.5px solid #CBD5E1', 
                      borderRight: 'none', 
                      padding: '8px 12px', 
                      borderTopLeftRadius: '6px', 
                      borderBottomLeftRadius: '6px', 
                      color: '#64748B', 
                      fontSize: '0.88rem',
                      fontFamily: 'monospace',
                      userSelect: 'none'
                    }}>
                      /
                    </span>
                    <input 
                      type="text" 
                      required 
                      className="form-control" 
                      placeholder="treasures-of-rajasthan-ganges-valley" 
                      value={formData.slug || ''} 
                      onChange={(e) => {
                        setIsSlugTouched(true);
                        const cleanVal = e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, '-')
                          .replace(/[^a-z0-9-_]/g, '');
                        setFormData({ ...formData, slug: cleanVal });
                      }}
                      style={{ 
                        borderTopLeftRadius: 0, 
                        borderBottomLeftRadius: 0,
                        fontFamily: 'monospace',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <small style={{ color: '#64748B', fontSize: '0.78rem' }}>
                      Tour URL: <strong style={{ color: 'var(--admin-primary)', fontFamily: 'monospace' }}>/{formData.slug || 'circuit-slug'}</strong>
                    </small>
                    {editingTour && (
                      <small style={{ color: '#F59E0B', fontSize: '0.75rem', fontStyle: 'italic' }}>
                        <i className="fas fa-exclamation-triangle"></i> Changing slug will update public URL
                      </small>
                    )}
                  </div>
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

                {/* Itinerary Slider Images Management */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <label className="form-label" style={{ fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A' }}>
                      <i className="fas fa-images" style={{ color: '#0D9488' }}></i>
                      Itinerary Slider Photos ({formData.gallery?.length || 0})
                    </label>
                    {editingTour && (
                      <Link
                        to={`/admin/itinerary-slider?tour=${editingTour._id}`}
                        target="_blank"
                        style={{ fontSize: '0.78rem', color: '#0D9488', fontWeight: '600', textDecoration: 'underline' }}
                      >
                        Open Full Dedicated Slider Manager ↗
                      </Link>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 12px' }}>
                    These photos are dynamically rendered in the multiple-image slider on the Itinerary page.
                  </p>

                  {/* Add images controls */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      ref={galleryFileInputRef}
                      multiple
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || !files.length) return;
                        setUploadingGallery(true);
                        try {
                          const res = await uploadMultipleImages(files);
                          if (res.data?.urls?.length) {
                            setFormData(prev => ({
                              ...prev,
                              gallery: [...(prev.gallery || []), ...res.data.urls]
                            }));
                          }
                        } catch (err) {
                          console.error('Gallery upload error:', err);
                          const msg = err.response?.data?.message || err.message || 'Error uploading slider images';
                          alert(`Error uploading slider images: ${msg}`);
                        } finally {
                          setUploadingGallery(false);
                          if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      style={{ background: '#FFFFFF', borderColor: '#0D9488', color: '#0D9488' }}
                      disabled={uploadingGallery}
                      onClick={() => galleryFileInputRef.current?.click()}
                    >
                      {uploadingGallery ? (
                        <><i className="fas fa-spinner fa-spin"></i> Uploading...</>
                      ) : (
                        <><i className="fas fa-cloud-upload-alt"></i> Upload Multiple Photos</>
                      )}
                    </button>

                    <div style={{ display: 'flex', gap: '4px', flex: 1, minWidth: '220px' }}>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="Or paste photo URL..."
                        style={{ fontSize: '0.82rem' }}
                        value={galleryUrlInput}
                        onChange={(e) => setGalleryUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (galleryUrlInput.trim()) {
                              setFormData(prev => ({
                                ...prev,
                                gallery: [...(prev.gallery || []), galleryUrlInput.trim()]
                              }));
                              setGalleryUrlInput('');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => {
                          if (galleryUrlInput.trim()) {
                            setFormData(prev => ({
                              ...prev,
                              gallery: [...(prev.gallery || []), galleryUrlInput.trim()]
                            }));
                            setGalleryUrlInput('');
                          }
                        }}
                      >
                        <i className="fas fa-plus"></i> Add
                      </button>
                    </div>

                    {formData.image && (!formData.gallery || !formData.gallery.includes(formData.image)) && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.78rem' }}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            gallery: [prev.image, ...(prev.gallery || [])]
                          }));
                        }}
                        title="Include main banner in slider"
                      >
                        + Add Main Banner
                      </button>
                    )}
                  </div>

                  {/* Slider Thumbnails Strip */}
                  {formData.gallery && formData.gallery.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                      {formData.gallery.map((imgUrl, gIdx) => (
                        <div
                          key={gIdx}
                          style={{
                            border: gIdx === 0 ? '2px solid #0D9488' : '1px solid #CBD5E1',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: '#FFFFFF',
                            position: 'relative',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                          }}
                        >
                          <div style={{ position: 'relative', height: '80px', background: '#0F172A' }}>
                            <img
                              src={imgUrl}
                              alt={`Slide ${gIdx + 1}`}
                              onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                            <span style={{ position: 'absolute', top: '4px', left: '4px', background: 'rgba(0,0,0,0.7)', color: '#FFFFFF', fontSize: '0.68rem', padding: '1px 5px', borderRadius: '4px', fontWeight: 'bold' }}>
                              #{gIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const list = formData.gallery.filter((_, i) => i !== gIdx);
                                setFormData({ ...formData, gallery: list });
                              }}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: '#EF4444',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '0.65rem'
                              }}
                              title="Remove photo"
                            >
                              &times;
                            </button>
                          </div>
                          {/* Reorder arrows */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', background: '#F8FAFC' }}>
                            <button
                              type="button"
                              disabled={gIdx === 0}
                              onClick={() => {
                                const list = [...formData.gallery];
                                const temp = list[gIdx - 1];
                                list[gIdx - 1] = list[gIdx];
                                list[gIdx] = temp;
                                setFormData({ ...formData, gallery: list });
                              }}
                              style={{ border: 'none', background: 'transparent', cursor: gIdx === 0 ? 'not-allowed' : 'pointer', color: gIdx === 0 ? '#CBD5E1' : '#334155', padding: '2px 4px' }}
                              title="Move left"
                            >
                              <i className="fas fa-chevron-left" style={{ fontSize: '0.7rem' }}></i>
                            </button>
                            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{gIdx === 0 ? 'Cover' : ''}</span>
                            <button
                              type="button"
                              disabled={gIdx === formData.gallery.length - 1}
                              onClick={() => {
                                const list = [...formData.gallery];
                                const temp = list[gIdx + 1];
                                list[gIdx + 1] = list[gIdx];
                                list[gIdx] = temp;
                                setFormData({ ...formData, gallery: list });
                              }}
                              style={{ border: 'none', background: 'transparent', cursor: gIdx === formData.gallery.length - 1 ? 'not-allowed' : 'pointer', color: gIdx === formData.gallery.length - 1 ? '#CBD5E1' : '#334155', padding: '2px 4px' }}
                              title="Move right"
                            >
                              <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontStyle: 'italic', padding: '8px 0' }}>
                      No custom slider photos yet. Upload photos above to display them in this itinerary's slider.
                    </div>
                  )}
                </div>

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

                <div className="form-group" style={{ marginBottom: '22px' }}>
                  <RichTextEditor
                    label="Overview & Presentation (Éditeur Enrichi avec Images) *"
                    value={formData.overview || ''}
                    onChange={(content) => setFormData((prev) => ({ ...prev, overview: content }))}
                    placeholder="Compelling description of the tour... Vous pouvez insérer des titres, des paragraphes, des listes à puces, du texte en gras, des liens et des photos."
                    minHeight="320px"
                  />
                  <span style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '6px', display: 'block' }}>
                    Ce texte complet s'affiche dans la section "Aperçu du Circuit" sur la page de détail du voyage avec tout votre formatage (titres, listes, images).
                  </span>
                </div>

                {/* Highlights (Les Points Forts du Voyage) Section */}
                <div style={{ background: '#FFFBEB', padding: '18px', borderRadius: '12px', marginBottom: '22px', border: '1px solid #FDE68A' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <strong style={{ color: '#92400E', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-star" style={{ color: '#D97706' }}></i>
                        Les Points Forts du Voyage ({formData.highlights?.length || 0})
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: '#B45309', display: 'block', marginTop: '2px' }}>
                        Ces points forts s'affichent avec des coches vertes sur la page du circuit (ex: "Visite du Taj Mahal", "Palais royaux de Jaipur").
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{ background: '#D97706', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      onClick={handleAddHighlight}
                    >
                      <i className="fas fa-plus"></i> Ajouter un Point Fort
                    </button>
                  </div>

                  {(!formData.highlights || formData.highlights.length === 0) ? (
                    <div style={{ textAlign: 'center', padding: '20px', background: '#FFFFFF', borderRadius: '8px', border: '1px dashed #FCD34D' }}>
                      <p style={{ margin: 0, color: '#92400E', fontSize: '0.88rem' }}>
                        Aucun point fort personnalisé. Cliquez sur "Ajouter un Point Fort" pour en créer.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {formData.highlights.map((highlight, hIdx) => (
                        <div key={hIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                          <span style={{ color: '#059669', fontSize: '1rem' }}>
                            <i className="fas fa-check-circle"></i>
                          </span>
                          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#92400E', minWidth: '70px' }}>
                            Point #{hIdx + 1}
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            style={{ margin: 0, fontSize: '0.88rem' }}
                            placeholder="ex: Visite privée du Taj Mahal au lever du soleil"
                            value={highlight}
                            onChange={(e) => handleHighlightChange(hIdx, e.target.value)}
                          />
                          <button
                            type="button"
                            style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                            onClick={() => handleRemoveHighlight(hIdx)}
                            title="Supprimer ce point fort"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} />
                    <span>Published (Visible on website)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
                    <span>Feature on Homepage</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', color: '#B45309' }}>
                    <input type="checkbox" checked={formData.cultureSafari || false} onChange={(e) => setFormData({ ...formData, cultureSafari: e.target.checked })} />
                    <span>Culture & Safari (Show on Culture & Safari page)</span>
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
