import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'https://jodhpurvoyage.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const API = axios.create({
  baseURL: API_BASE_URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const loginAdmin = (credentials) => API.post('/auth/login', credentials);
export const getAdminProfile = () => API.get('/auth/me');

// Tours API
export const fetchTours = (params) => API.get('/tours', { params });
export const fetchAdminTours = () => API.get('/tours/admin/all');
export const fetchTourBySlug = (slug) => API.get(`/tours/${slug}`);
export const createTour = (data) => API.post('/tours', data);
export const updateTour = (id, data) => API.put(`/tours/${id}`, data);
export const deleteTour = (id) => API.delete(`/tours/${id}`);
export const unfeatureAllTours = () => API.post('/tours/unfeature-all');

// Destinations & Categories API
export const fetchDestinations = (params) => API.get('/destinations', { params });
export const fetchDestinationCategories = () => API.get('/destinations/categories');
export const fetchAdminDestinations = () => API.get('/destinations/admin/all');
export const fetchDestinationBySlug = (slug) => API.get(`/destinations/${slug}`);
export const createDestination = (data) => API.post('/destinations', data);
export const updateDestination = (id, data) => API.put(`/destinations/${id}`, data);
export const deleteDestination = (id) => API.delete(`/destinations/${id}`);

// Bookings & Custom Trips API
export const submitCustomTrip = (data) => API.post('/bookings', data);
export const createBooking = (data) => API.post('/bookings', data);
export const fetchBookings = (params) => API.get('/bookings', { params });
export const updateBookingStatus = (id, data) => API.put(`/bookings/${id}/status`, data);
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);

// Contact API
export const sendContactMessage = (data) => API.post('/contacts', data);
export const fetchContacts = (params) => API.get('/contacts', { params });
export const updateContactStatus = (id, data) => API.put(`/contacts/${id}/status`, data);
export const deleteContact = (id) => API.delete(`/contacts/${id}`);

// Reviews API
export const fetchReviews = (params) => API.get('/reviews', { params });
export const fetchReviewBySlug = (slugOrId) => API.get(`/reviews/${slugOrId}`);
export const submitPublicReview = (data) => API.post('/reviews', data);
export const fetchAdminReviews = (params) => API.get('/reviews/admin/all', { params });
export const createAdminReview = (data) => API.post('/reviews/admin', data);
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// Blogs API
export const fetchBlogs = (params) => API.get('/blogs', { params });
export const fetchAdminBlogs = () => API.get('/blogs/admin/all');
export const fetchBlogBySlug = (slug) => API.get(`/blogs/${slug}`);
export const createBlog = (data) => API.post('/blogs', data);
export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

// Stats API
export const fetchDashboardStats = () => API.get('/stats/dashboard');

// SEO Management API
export const fetchSeoConfigs = () => API.get('/seo');
export const fetchSeoPageConfig = (pageKey) => API.get(`/seo/${pageKey}`);
export const fetchSeoConfigByPath = (path) => API.get('/seo/by-path', { params: { path } });
export const updateSeoPageConfig = (pageKey, data) => API.put(`/seo/${pageKey}`, data);
export const createSeoConfig = (data) => API.post('/seo', data);

// Upload API (Cloudinary & Local Storage)
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return API.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const getUploadStatus = () => API.get('/upload/status');

// Custom URLs API
export const fetchCustomUrls = () => API.get('/custom-urls');
export const fetchCustomUrlConfig = () => API.get('/custom-urls/config');
export const resolveCustomUrl = (path) => API.get('/custom-urls/resolve', { params: { path } });
export const createCustomUrl = (data) => API.post('/custom-urls', data);
export const updateCustomUrl = (id, data) => API.put(`/custom-urls/${id}`, data);
export const deleteCustomUrl = (id) => API.delete(`/custom-urls/${id}`);

// Mega Menu CMS API
export const fetchMegaMenuConfig = () => API.get('/mega-menu');
export const updateMegaMenuConfig = (data) => API.put('/mega-menu', data);
export const resetMegaMenuConfig = () => API.post('/mega-menu/reset');

// Pages Content CMS API
export const fetchPagesList = () => API.get('/pages');
export const fetchPageContent = (pageKey) => API.get(`/pages/${pageKey}`);
export const updatePageContent = (pageKey, data) => API.put(`/pages/${pageKey}`, data);
export const resetPageContent = (pageKey) => API.post(`/pages/${pageKey}/reset`);

export default API;

