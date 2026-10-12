import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { fetchAdminTours, updateTourGallery, uploadImage, uploadMultipleImages } from '../../services/api';

const AdminItinerarySlider = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tourParam = searchParams.get('tour');

  const [tours, setTours] = useState([]);
  const [selectedTourId, setSelectedTourId] = useState('');
  const [currentTour, setCurrentTour] = useState(null);
  const [sliderImages, setSliderImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);
  
  const [loadingTours, setLoadingTours] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  
  const [urlInput, setUrlInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' or 'mobile'
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isReplacingIndex, setIsReplacingIndex] = useState(null);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const fileInputRef = useRef(null);
  const replaceFileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Load all tours for selection
  useEffect(() => {
    setLoadingTours(true);
    fetchAdminTours()
      .then((res) => {
        const tourList = Array.isArray(res.data) ? res.data : [];
        setTours(tourList);
        
        // Auto select by query param or pick first tour
        if (tourList.length > 0) {
          const matched = tourParam 
            ? tourList.find(t => String(t._id) === tourParam || t.slug === tourParam) 
            : null;
          const target = matched || tourList[0];
          setSelectedTourId(String(target._id));
        }
        setLoadingTours(false);
      })
      .catch((err) => {
        console.error('Error fetching tours:', err);
        showToast('Failed to load tours catalog', 'error');
        setLoadingTours(false);
      });
  }, [tourParam]);

  // When selected tour changes, populate slider images
  useEffect(() => {
    if (!selectedTourId || !tours.length) return;
    const tour = tours.find(t => String(t._id) === selectedTourId || t.slug === selectedTourId);
    if (tour) {
      setCurrentTour(tour);
      // Determine existing slider images
      let initialImages = [];
      if (Array.isArray(tour.gallery) && tour.gallery.length > 0) {
        initialImages = [...tour.gallery];
      } else if (tour.image) {
        initialImages = [tour.image];
      }
      setSliderImages(initialImages);
      setOriginalImages(initialImages);
      setPreviewIndex(0);
    }
  }, [selectedTourId, tours]);

  const handleSelectTour = (id) => {
    setSelectedTourId(id);
    setSearchParams({ tour: id });
  };

  // Move image left (earlier in slider)
  const handleMoveLeft = (index) => {
    if (index === 0) return;
    const updated = [...sliderImages];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setSliderImages(updated);
  };

  // Move image right (later in slider)
  const handleMoveRight = (index) => {
    if (index === sliderImages.length - 1) return;
    const updated = [...sliderImages];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setSliderImages(updated);
  };

  // Set image as cover / #1
  const handleSetAsFirst = (index) => {
    if (index === 0) return;
    const target = sliderImages[index];
    const filtered = sliderImages.filter((_, i) => i !== index);
    setSliderImages([target, ...filtered]);
    setPreviewIndex(0);
    showToast(`Set as first slide`, 'info');
  };

  // Delete image from slider
  const handleDeleteImage = (index) => {
    const updated = sliderImages.filter((_, i) => i !== index);
    setSliderImages(updated);
    if (previewIndex >= updated.length) {
      setPreviewIndex(Math.max(0, updated.length - 1));
    }
    showToast('Image removed from slider', 'info');
  };

  // Add image by direct URL
  const handleAddByUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const cleanUrl = urlInput.trim();
    setSliderImages([...sliderImages, cleanUrl]);
    setUrlInput('');
    showToast('Image added to slider', 'success');
  };

  // Batch file upload
  const handleFilesUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(`Uploading ${files.length} image(s)...`);

    try {
      const res = await uploadMultipleImages(files);
      if (res.data && res.data.urls && res.data.urls.length > 0) {
        setSliderImages(prev => [...prev, ...res.data.urls]);
        showToast(`${res.data.urls.length} image(s) uploaded successfully!`, 'success');
      } else {
        showToast('Upload completed, but no image URLs returned.', 'error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast(err.response?.data?.message || 'Error uploading images', 'error');
    } finally {
      setUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Replace single image with file upload
  const handleReplaceFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || isReplacingIndex === null) return;

    setUploading(true);
    try {
      const res = await uploadImage(file);
      if (res.data?.url) {
        const updated = [...sliderImages];
        updated[isReplacingIndex] = res.data.url;
        setSliderImages(updated);
        showToast('Image replaced successfully', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Error replacing image', 'error');
    } finally {
      setUploading(false);
      setIsReplacingIndex(null);
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
    }
  };

  // Save changes to backend
  const handleSaveChanges = async () => {
    if (!currentTour) return;
    setSaving(true);

    try {
      const tourId = currentTour._id || currentTour.slug;
      const res = await updateTourGallery(tourId, sliderImages);
      
      // Update local tour list state
      setTours(prev => prev.map(t => {
        if (String(t._id) === String(currentTour._id)) {
          return { ...t, gallery: sliderImages };
        }
        return t;
      }));
      setOriginalImages([...sliderImages]);
      showToast('Itinerary slider images saved successfully!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast(err.response?.data?.message || 'Error saving slider images', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Discard changes
  const handleDiscardChanges = () => {
    setSliderImages([...originalImages]);
    showToast('Changes discarded', 'info');
  };

  // Has unsaved changes
  const hasChanges = JSON.stringify(sliderImages) !== JSON.stringify(originalImages);

  const filteredTours = tours.filter(t => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      (t.title || '').toLowerCase().includes(q) ||
      (t.location || '').toLowerCase().includes(q) ||
      (t.category || '').toLowerCase().includes(q) ||
      (t.slug || '').toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout
      title="Itinerary Slider Images Management"
      subtitle="Manage, upload, and organize slider photos dynamically for each itinerary"
    >
      {/* Toast Alert */}
      {toast.show && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            padding: '14px 22px',
            borderRadius: '10px',
            background: toast.type === 'error' ? '#EF4444' : toast.type === 'info' ? '#3B82F6' : '#10B981',
            color: '#FFFFFF',
            fontWeight: '600',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <i className={`fas ${toast.type === 'error' ? 'fa-exclamation-circle' : toast.type === 'info' ? 'fa-info-circle' : 'fa-check-circle'}`}></i>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hidden file input for replacement */}
      <input
        type="file"
        ref={replaceFileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleReplaceFile}
      />

      {/* Main Grid Layout: Tour Selection & Slider Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Itinerary Selector */}
        <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-route" style={{ color: '#0D9488' }}></i>
              Select Itinerary
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>
              {tours.length} total
            </span>
          </div>

          {/* Quick Search */}
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.85rem' }}></i>
            <input
              type="text"
              placeholder="Filter itineraries..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '34px', fontSize: '0.86rem', height: '38px' }}
            />
          </div>

          {/* List of Itineraries */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '680px', overflowY: 'auto', paddingRight: '4px' }}>
            {loadingTours ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748B' }}>
                <i className="fas fa-spinner fa-spin" style={{ color: '#0D9488', fontSize: '1.5rem', marginBottom: '8px' }}></i>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Loading itineraries...</p>
              </div>
            ) : filteredTours.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#94A3B8', fontSize: '0.85rem' }}>
                No matching itineraries found
              </div>
            ) : (
              filteredTours.map((t) => {
                const isSelected = String(t._id) === selectedTourId || t.slug === selectedTourId;
                const imgCount = Array.isArray(t.gallery) && t.gallery.length > 0 ? t.gallery.length : (t.image ? 1 : 0);
                return (
                  <div
                    key={t._id}
                    onClick={() => handleSelectTour(String(t._id))}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #0D9488' : '1px solid #E2E8F0',
                      background: isSelected ? '#F0FDFA' : '#FFFFFF',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center'
                    }}
                  >
                    <img
                      src={t.image || '/images/dest-rajasthan.jpg'}
                      alt={t.title}
                      onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.88rem', color: isSelected ? '#0D9488' : '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.74rem', color: '#64748B' }}>
                        <span><i className="fas fa-clock"></i> {t.duration || '10 Days'}</span>
                        <span style={{
                          background: imgCount > 0 ? '#E0F2FE' : '#F1F5F9',
                          color: imgCount > 0 ? '#0369A1' : '#64748B',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          fontWeight: '600'
                        }}>
                          <i className="fas fa-images"></i> {imgCount} {imgCount === 1 ? 'photo' : 'photos'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Slider Management Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header Card for Selected Tour */}
          {currentTour ? (
            <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '22px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ background: '#CCFBF1', color: '#0F766E', fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                      {currentTour.category || 'Itinerary'}
                    </span>
                    <span style={{ color: '#64748B', fontSize: '0.82rem' }}>
                      <i className="fas fa-map-marker-alt" style={{ color: '#F59E0B' }}></i> {currentTour.location || 'India'}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1E293B', margin: '0 0 6px' }}>
                    {currentTour.title}
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748B' }}>
                    Slug: <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', color: '#0F172A' }}>{currentTour.slug}</code>
                  </p>
                </div>

                {/* Actions: View Public Page & Save */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a
                    href={`/${currentTour.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className="fas fa-external-link-alt"></i> View Itinerary Page
                  </a>
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: hasChanges ? '#0D9488' : '#0D9488',
                      boxShadow: hasChanges ? '0 4px 14px rgba(13,148,136,0.4)' : 'none'
                    }}
                  >
                    {saving ? (
                      <><i className="fas fa-spinner fa-spin"></i> Saving Slider...</>
                    ) : (
                      <><i className="fas fa-save"></i> Save Slider Changes {hasChanges && '●'}</>
                    )}
                  </button>
                </div>
              </div>

              {hasChanges && (
                <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '8px', background: '#FEF3C7', color: '#92400E', fontSize: '0.84rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><i className="fas fa-exclamation-triangle"></i> You have unsaved changes in this itinerary slider.</span>
                  <button
                    type="button"
                    onClick={handleDiscardChanges}
                    style={{ background: 'none', border: 'none', color: '#B45309', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Discard Changes
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '40px', textAlign: 'center', color: '#64748B' }}>
              <i className="fas fa-route" style={{ fontSize: '2rem', color: '#CBD5E1', marginBottom: '12px' }}></i>
              <p>Please select an itinerary from the left column to manage its slider photos.</p>
            </div>
          )}

          {/* Multi-Image Upload & Add Tools */}
          {currentTour && (
            <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '22px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E293B', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-cloud-upload-alt" style={{ color: '#0D9488' }}></i>
                Upload & Add Slider Photos
              </h3>

              {/* Upload Dropzone / Button */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '16px' }}>
                
                {/* Batch File Upload Button */}
                <div
                  style={{
                    border: '2px dashed #0D9488',
                    borderRadius: '12px',
                    padding: '24px 20px',
                    textAlign: 'center',
                    background: '#F0FDFA',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => {
                    if (!uploading && fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFilesUpload}
                    disabled={uploading}
                  />
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#CCFBF1', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.4rem' }}>
                    {uploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-images"></i>}
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.94rem', color: '#0F766E', marginBottom: '4px' }}>
                    {uploading ? uploadProgress : 'Click to Upload Multiple Photos'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Select 1 or more images (JPG, PNG, WEBP, AVIF). Up to 12MB each.
                  </div>
                </div>

                {/* Direct URL Input */}
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px 20px', background: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    <i className="fas fa-link" style={{ marginRight: '6px', color: '#0D9488' }}></i>
                    Add Image via Web URL
                  </label>
                  <form onSubmit={handleAddByUrl} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="form-control"
                      style={{ fontSize: '0.85rem' }}
                    />
                    <button type="submit" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }} disabled={!urlInput.trim()}>
                      <i className="fas fa-plus"></i> Add
                    </button>
                  </form>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '8px' }}>
                    Tip: You can paste direct links from Cloudinary, your CDN, or any secure host.
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Slider Gallery Grid & Reordering */}
          {currentTour && (
            <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '22px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E293B', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-layer-group" style={{ color: '#0D9488' }}></i>
                    Current Slider Photos ({sliderImages.length})
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>
                    Slide #1 will be the opening photo when travelers land on the Itinerary page.
                  </p>
                </div>

                {sliderImages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to remove all slider photos for this itinerary?')) {
                        setSliderImages([]);
                        showToast('All photos cleared from slider', 'info');
                      }
                    }}
                    className="btn btn-sm btn-outline"
                    style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                  >
                    <i className="fas fa-trash-alt"></i> Clear All Photos
                  </button>
                )}
              </div>

              {sliderImages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '45px 20px', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
                  <i className="fas fa-images" style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '12px' }}></i>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#334155', margin: '0 0 6px' }}>No Slider Photos Configured</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '460px', margin: '0 auto 16px' }}>
                    This itinerary currently uses the fallback photo. Upload multiple high-definition photos above to customize its slider!
                  </p>
                  {currentTour.image && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        setSliderImages([currentTour.image]);
                        showToast('Added tour cover image as first slide', 'success');
                      }}
                    >
                      <i className="fas fa-image"></i> Use Tour Main Image as First Slide
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '16px' }}>
                  {sliderImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: idx === 0 ? '2px solid #0D9488' : '1px solid #E2E8F0',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#FFFFFF',
                        boxShadow: idx === 0 ? '0 4px 12px rgba(13,148,136,0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative'
                      }}
                    >
                      {/* Image Thumbnail */}
                      <div style={{ position: 'relative', width: '100%', height: '140px', background: '#0F172A' }}>
                        <img
                          src={imgUrl}
                          alt={`Slide ${idx + 1}`}
                          onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />

                        {/* Order Badge */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            background: idx === 0 ? '#0D9488' : 'rgba(15, 23, 42, 0.8)',
                            color: '#FFFFFF',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          #{idx + 1} {idx === 0 && '★ COVER'}
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(idx)}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(239, 68, 68, 0.9)',
                            color: '#FFFFFF',
                            border: 'none',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                          title="Delete photo"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>

                      {/* Card Controls & Actions */}
                      <div style={{ padding: '10px 12px', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {/* URL string truncated */}
                        <div style={{ fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={imgUrl}>
                          {imgUrl}
                        </div>

                        {/* Order & Reorder Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => handleMoveLeft(idx)}
                              disabled={idx === 0}
                              className="btn btn-sm"
                              style={{
                                padding: '3px 8px',
                                fontSize: '0.75rem',
                                background: idx === 0 ? '#F1F5F9' : '#E2E8F0',
                                color: idx === 0 ? '#CBD5E1' : '#334155',
                                border: 'none',
                                cursor: idx === 0 ? 'not-allowed' : 'pointer'
                              }}
                              title="Move left (earlier in slider)"
                            >
                              <i className="fas fa-chevron-left"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveRight(idx)}
                              disabled={idx === sliderImages.length - 1}
                              className="btn btn-sm"
                              style={{
                                padding: '3px 8px',
                                fontSize: '0.75rem',
                                background: idx === sliderImages.length - 1 ? '#F1F5F9' : '#E2E8F0',
                                color: idx === sliderImages.length - 1 ? '#CBD5E1' : '#334155',
                                border: 'none',
                                cursor: idx === sliderImages.length - 1 ? 'not-allowed' : 'pointer'
                              }}
                              title="Move right (later in slider)"
                            >
                              <i className="fas fa-chevron-right"></i>
                            </button>
                          </div>

                          <div style={{ display: 'flex', gap: '4px' }}>
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetAsFirst(idx)}
                                className="btn btn-sm btn-outline"
                                style={{ padding: '3px 8px', fontSize: '0.72rem', color: '#D97706', borderColor: '#FDE68A' }}
                                title="Make this image the cover / first slide"
                              >
                                <i className="fas fa-star"></i> First
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setIsReplacingIndex(idx);
                                if (replaceFileInputRef.current) {
                                  replaceFileInputRef.current.click();
                                }
                              }}
                              className="btn btn-sm btn-outline"
                              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                              title="Replace photo"
                            >
                              <i className="fas fa-sync-alt"></i> Replace
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Live Responsiveness Preview */}
          {currentTour && sliderImages.length > 0 && (
            <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '22px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E293B', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-eye" style={{ color: '#0D9488' }}></i>
                    Live Slider Preview
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>
                    Test how the slider behaves on desktop and mobile devices.
                  </p>
                </div>

                {/* Device Switcher */}
                <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: previewDevice === 'desktop' ? '#FFFFFF' : 'transparent',
                      color: previewDevice === 'desktop' ? '#0F172A' : '#64748B',
                      boxShadow: previewDevice === 'desktop' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fas fa-desktop"></i> Desktop View
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: previewDevice === 'mobile' ? '#FFFFFF' : 'transparent',
                      color: previewDevice === 'mobile' ? '#0F172A' : '#64748B',
                      boxShadow: previewDevice === 'mobile' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fas fa-mobile-alt"></i> Mobile (375px)
                  </button>
                </div>
              </div>

              {/* Preview Container Frame */}
              <div
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: previewDevice === 'mobile' ? '20px 0' : '20px',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{
                    width: previewDevice === 'mobile' ? '375px' : '100%',
                    maxWidth: '100%',
                    background: '#FFFFFF',
                    borderRadius: previewDevice === 'mobile' ? '24px' : '12px',
                    boxShadow: previewDevice === 'mobile' ? '0 8px 30px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
                    padding: '16px',
                    border: previewDevice === 'mobile' ? '8px solid #1E293B' : '1px solid #E2E8F0',
                    transition: 'width 0.3s ease'
                  }}
                >
                  {/* Slider Main Viewport */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: previewDevice === 'mobile' ? '240px' : '380px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      backgroundColor: '#0F172A'
                    }}
                  >
                    <img
                      src={sliderImages[previewIndex] || sliderImages[0]}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />

                    {/* Counter Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(15, 23, 42, 0.78)',
                        backdropFilter: 'blur(4px)',
                        color: '#FFFFFF',
                        padding: '3px 9px',
                        borderRadius: '20px',
                        fontSize: '0.76rem',
                        fontWeight: '600'
                      }}
                    >
                      <i className="fas fa-camera"></i> {previewIndex + 1} / {sliderImages.length}
                    </div>

                    {/* Prev / Next Arrows */}
                    {sliderImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setPreviewIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)}
                          style={{
                            position: 'absolute',
                            left: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255,255,255,0.85)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <i className="fas fa-chevron-left" style={{ fontSize: '0.8rem' }}></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewIndex((prev) => (prev + 1) % sliderImages.length)}
                          style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255,255,255,0.85)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem' }}></i>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Row Preview */}
                  {sliderImages.length > 1 && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        marginTop: '10px',
                        overflowX: 'auto',
                        paddingBottom: '4px'
                      }}
                    >
                      {sliderImages.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setPreviewIndex(i)}
                          style={{
                            flex: '0 0 auto',
                            width: previewDevice === 'mobile' ? '54px' : '72px',
                            height: previewDevice === 'mobile' ? '42px' : '52px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: i === previewIndex ? '2px solid #0D9488' : '1px solid #CBD5E1',
                            opacity: i === previewIndex ? 1 : 0.6
                          }}
                        >
                          <img src={img} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminItinerarySlider;
