import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import AdminImageUpload from '../../components/AdminImageUpload';
import RichTextEditor from '../../components/RichTextEditor';
import { fetchAdminBlogs, createBlog, updateBlog, deleteBlog } from '../../services/api';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const initialForm = {
    title: '',
    slug: '',
    category: 'Travel Advice',
    excerpt: '',
    content: '',
    coverImage: '/images/dest-rajasthan.jpg',
    readTime: '6 min read',
    tags: ['Rajasthan', 'Advice'],
    published: true,
    seoTitle: '',
    seoKeywords: '',
    seoDescription: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const loadBlogs = () => {
    setLoading(true);
    fetchAdminBlogs()
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleOpenCreate = () => {
    setEditingBlog(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      ...initialForm,
      ...blog,
      slug: blog.slug || '',
      seoTitle: blog.seoTitle || '',
      seoKeywords: blog.seoKeywords || '',
      seoDescription: blog.seoDescription || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (blog) => {
    const id = typeof blog === 'object' ? (blog._id || blog.id || blog.slug) : blog;
    if (!window.confirm('Are you sure you want to permanently delete this blog article?')) return;
    try {
      await deleteBlog(id);
      loadBlogs();
    } catch (err) {
      alert('Error deleting article.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content || !formData.content.trim() || formData.content === '<p><br></p>') {
      alert('Veuillez rédiger le contenu complet de votre article.');
      return;
    }
    setSaving(true);
    try {
      if (editingBlog) {
        const targetId = editingBlog._id || editingBlog.id || editingBlog.slug;
        await updateBlog(targetId, formData);
      } else {
        await createBlog(formData);
      }
      setIsModalOpen(false);
      loadBlogs();
    } catch (err) {
      console.error('Save blog error:', err);
      alert(err.response?.data?.message || err.message || 'Error saving article.');
    } finally {
      setSaving(false);
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      b.title?.toLowerCase().includes(term) ||
      b.category?.toLowerCase().includes(term)
    );
  });

  return (
    <AdminLayout 
      title="Blog Articles & Travel Advice" 
      subtitle="Write and publish travel guides, inspiration stories, and practical tips for your travelers."
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }}></i>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search article..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '34px', fontSize: '0.88rem', height: '38px', borderRadius: '8px' }}
          />
        </div>

        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <i className="fas fa-pen-nib"></i> Write an Article
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: 'var(--admin-primary)' }}></i>
          <p style={{ marginTop: '16px', color: 'var(--admin-text-muted)' }}>Loading articles...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="admin-table-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <i className="fas fa-newspaper" style={{ fontSize: '3rem', color: '#CBD5E1', marginBottom: '16px', display: 'block' }}></i>
          <h3 style={{ color: 'var(--admin-text-main)', margin: '0 0 8px' }}>No articles published</h3>
          <p style={{ color: 'var(--admin-text-muted)', margin: '0 0 16px' }}>Share your local India expertise and travel guides with your visitors.</p>
          <button className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
            <i className="fas fa-plus"></i> New Story
          </button>
        </div>
      ) : (
        <div className="admin-table-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Article Title</th>
                  <th>Category</th>
                  <th>Published Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img 
                          src={b.coverImage || '/images/dest-rajasthan.jpg'} 
                          alt={b.title} 
                          onError={(e) => { e.currentTarget.src = "/images/dest-rajasthan.jpg"; }}
                          style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E2E8F0' }} 
                        />
                        <div>
                          <strong style={{ color: 'var(--admin-text-main)' }}>{b.title}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                            <i className="fas fa-clock"></i> {b.readTime || '5 min read'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-status-badge status-en-attente">
                        {b.category}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                      {new Date(b.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <span className={`admin-status-badge ${b.published !== false ? 'status-confirme' : 'status-annule'}`}>
                        {b.published !== false ? 'Published Online' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-sm btn-outline" onClick={() => handleOpenEdit(b)} title="Edit article">
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button className="btn btn-sm" style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' }} onClick={() => handleDelete(b)} title="Delete article">
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

      {/* Modal Edit / Create */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '960px', width: '96%' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: 0, overflow: 'hidden' }}>
              <div className="modal-header">
                <h3 className="modal-title">
                  <i className="fas fa-newspaper" style={{ color: 'var(--admin-primary)' }}></i>
                  <span>{editingBlog ? 'Edit Article' : 'Write New Blog Article'}</span>
                </h3>
                <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)} title="Close dialog">
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Article Title *</label>
                    <input type="text" required className="form-control" placeholder="e.g. 10 Essential Tips for Your First Trip to Rajasthan" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>URL Permalink / Slug</label>
                    <input type="text" className="form-control" placeholder="e.g. 10-essential-tips-rajasthan (auto-generated if empty)" value={formData.slug || ''} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Editorial Category</label>
                    <input
                      type="text"
                      className="form-control"
                      list="category-suggestions"
                      placeholder="e.g. Conseils Voyage, Infos Pratiques..."
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                    <datalist id="category-suggestions">
                      <option value="Conseils Voyage" />
                      <option value="Culture & Patrimoine" />
                      <option value="Infos Pratiques" />
                      <option value="Inde" />
                      <option value="Népal" />
                      <option value="Travel Advice" />
                      <option value="Practical Info" />
                      <option value="Heritage & History" />
                      <option value="Culture & Festivals" />
                    </datalist>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Estimated Reading Time</label>
                    <input type="text" className="form-control" placeholder="e.g. 6 min read" value={formData.readTime || ''} onChange={(e) => setFormData({ ...formData, readTime: e.target.value })} />
                  </div>
                </div>

                <AdminImageUpload
                  label="Cover Image (Local Upload / Cloudinary)"
                  value={formData.coverImage}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  placeholder="https://... or click 'Upload from Device'"
                />

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: '600' }}>Introduction Excerpt *</label>
                  <textarea rows="2" required className="form-control" placeholder="Short introductory summary..." value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: '22px' }}>
                  <RichTextEditor
                    label="Contenu Complet de l'Article (Éditeur Enrichi avec Photos) *"
                    value={formData.content}
                    onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                    placeholder="Rédigez l'article ici... Utilisez 'Photo Directe' ou 'Image Options' pour intégrer des photos au sein du texte."
                    minHeight="380px"
                  />
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
                      placeholder="e.g. 10 Essential Rajasthan Travel Tips | Complete Travel Guide" 
                      value={formData.seoTitle || ''} 
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} 
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>SEO Meta Keywords (Comma separated)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. rajasthan travel guide, india travel tips, jodhpur blogs" 
                      value={formData.seoKeywords || ''} 
                      onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })} 
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>SEO Meta Description</label>
                    <textarea 
                      rows="2" 
                      className="form-control" 
                      placeholder="e.g. Read our expert guide with 10 essential tips for your first trip to Rajasthan, India." 
                      value={formData.seoDescription || ''} 
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} 
                    ></textarea>
                  </div>
                </div>

                <div style={{ marginBottom: 0, padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} />
                    <span>Publish article immediately on website</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Article</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBlogs;
