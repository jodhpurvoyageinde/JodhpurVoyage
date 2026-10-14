import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogBySlug } from '../services/api';
import SEO from '../components/SEO';

const cleanHtml = (rawStr) => {
  if (!rawStr || typeof rawStr !== 'string') return '';
  return rawStr
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/\[\/?vc_[^\]]*\]/gi, '')
    .trim();
};

const BlogDetail = ({ overrideSlug }) => {
  const { slug: paramSlug } = useParams();
  const slug = overrideSlug || paramSlug;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchBlogBySlug(slug)
      .then((res) => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Article non trouvé</h2>
        <Link to="/blog" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Retour au blog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <SEO
        pageKey="blog"
        title={blog.seoTitle || `${blog.title} | Blog Jodhpur Voyage`}
        description={blog.seoDescription || blog.excerpt || blog.summary || blog.content?.substring(0, 160) || 'Article de blog Jodhpur Voyage'}
        keywords={blog.seoKeywords || (blog.tags ? blog.tags.join(', ') : 'blog jodhpur, voyage inde')}
        ogImage={blog.coverImage || blog.image}
        structuredData={JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': blog.title,
          'image': blog.coverImage || blog.image,
          'author': {
            '@type': 'Organization',
            'name': 'Jodhpur Voyage'
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Jodhpur Voyage',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://jodhpurvoyage.com/images/logo-transprent.png'
            }
          }
        })}
      />
      {/* Blog Hero */}
      <section style={{ position: 'relative', background: 'var(--secondary-color)', padding: '80px 0', color: '#fff' }}>
        <img
          src={blog.coverImage || '/images/dest-rajasthan.jpg'}
          alt={blog.title}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
          <span className="badge-gold" style={{ marginBottom: '14px', display: 'inline-block' }}>{blog.category || 'Conseils Voyage'}</span>
          <h1 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '16px', lineHeight: '1.3' }}>{blog.title}</h1>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
            <span><i className="far fa-user"></i> {blog.author?.name || 'Jodhpur Voyage'}</span>
            <span><i className="far fa-clock"></i> {blog.readTime || '5 min de lecture'}</span>
            <span><i className="far fa-calendar-alt"></i> {new Date(blog.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="section-padding bg-cream">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '40px', boxShadow: 'var(--shadow-sm)', lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-main)' }}>
            <p style={{ fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--secondary-color)', marginBottom: '24px', borderLeft: '4px solid var(--primary-color)', paddingLeft: '16px' }}>
              {blog.excerpt}
            </p>

            {blog.content && blog.content.includes('<') ? (
              <div
                className="blog-detail-content"
                style={{ lineHeight: '1.8' }}
                dangerouslySetInnerHTML={{ __html: cleanHtml(blog.content) }}
              />
            ) : (
              <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                {cleanHtml(blog.content)}
              </div>
            )}

          </div>

          {/* CTA Box */}
          <div style={{ background: 'var(--secondary-color)', color: '#fff', borderRadius: '16px', padding: '36px', textAlign: 'center', marginTop: '40px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '12px' }}>Envie de vivre cette expérience en Inde ?</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '20px' }}>
              Nos experts concevront votre itinéraire sur mesure selon vos dates et vos envies.
            </p>
            <Link to="/voyage-sur-mesure" className="btn btn-gold btn-lg">
              <i className="fas fa-paper-plane"></i> Demander mon devis gratuit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
