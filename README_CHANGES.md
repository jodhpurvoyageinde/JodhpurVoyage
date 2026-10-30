# Jodhpur Voyage — Master Architecture & Project Changes Registry

> **Purpose:** This document tracks all architectural changes, backend API modifications, frontend React changes, URL structures, database schemas, and migration steps. 
> **Important Rule:** Whenever any backend API route or frontend React component is modified in the project, this registry must be updated to keep full traceability.

---

## 1. Clean URL Architecture (Direct Root Slugs)

### Requirement & Rule
- **Previous / Wrong URL format:** `https://jodhpurvoyage.jeeteducation.com/tours/ladakh-traverse-du-petit-tibet-et-des-cols-mythiques`
- **Correct / Right URL format:** `https://jodhpurvoyage.jeeteducation.com/ladakh-traverse-du-petit-tibet-et-des-cols-mythiques` (`/tours/` removed)
- **Automatic Fallback / Legacy Redirect:** Any visitor or search engine hitting `/tours/:slug` is seamlessly redirected (replace/301) to `/:slug`.

### Files Modified for Clean URLs

| Area | File | Description of Changes |
| :--- | :--- | :--- |
| **React Router** | `frontend/src/App.jsx` | 1. Added `useParams` and `TourRedirect` component.<br>2. Route `/tours/:slug` now redirects directly to `/:slug`.<br>3. Route `*` resolves `/:slug` via `CustomUrlResolver`. |
| **React Component** | `frontend/src/components/CustomUrlResolver.jsx` | 1. Added `resolvedData` state caching to prevent duplicate API calls.<br>2. Resolves slug directly to tour data and mounts `<TourDetail overrideSlug={resolvedSlug} initialTour={resolvedData} />`.<br>3. Removed duplicate empty `<SEO />` tags. |
| **React Page** | `frontend/src/pages/TourDetail.jsx` | 1. Accepts `initialTour` prop.<br>2. If initial data is provided, skips duplicate loading spinner and renders instantly.<br>3. Handles both direct slug and override slug. |
| **React Page** | `frontend/src/pages/Tours.jsx` | 1. Updated tour card image link from `/tours/${tour.slug}` to `/${tour.slug}`.<br>2. Updated title link to `/${tour.slug}`.<br>3. Updated "Détails" button link to `/${tour.slug}`. |
| **React Page** | `frontend/src/pages/Home.jsx` | 1. Featured tours section: updated cards to link to `/${tourSlug}`.<br>2. Recent tours section: updated cards to link to `/${itemSlug}`. |
| **React Page** | `frontend/src/pages/DestinationDetail.jsx` | Updated all tour package card links to `/${pkg.slug}`. |
| **React Admin** | `frontend/src/pages/admin/AdminCustomUrls.jsx` | Updated tour target options to `/${t.slug}|tour` and label to `(/{t.slug})`. |

---

## 2. Package Destination & Connected Cities (Tags) Architecture

### Business Requirement
Establishes a **Many-to-Many Relationship** between **Packages (Tours)** and **Cities (Destinations)** under each **Package Destination / Category**:

```text
 ┌─────────────────────────────────────────────────────────┐
 │               Package Destination / Category            │
 │           (e.g., Rajasthan, North India, South India)   │
 └────────────────────────────┬────────────────────────────┘
                              │
                              ▼ (1 Category has Multiple Packages)
 ┌─────────────────────────────────────────────────────────┐
 │                         PACKAGES                        │
 │  • Package 1 ("Grand Tour of Rajasthan & Varanasi")     │
 │  • Package 2 ("Desert & Heritage Circuit")              │
 │  • Package 3 ("Royal Palaces & Havelis")                │
 └────────────────────────────┬────────────────────────────┘
                              │
                              ▼▲  (Many-to-Many via City Tags)
 ┌─────────────────────────────────────────────────────────┐
 │                     CONNECTED CITIES                    │
 │   [Jodhpur]   [Jaipur]   [Udaipur]   [Agra]   [Delhi]   │
 └─────────────────────────────────────────────────────────┘
```

1. **Multiple Cities per Package:** Packages have a dynamic `cities` tags array (e.g. `[Delhi]`, `[Agra]`, `[Jaipur]`, `[Jodhpur]`).
2. **City Linking Across Packages:** Cities (like Jodhpur) are linked across any number of packages.
3. **Filterable on Public Pages:** Visitors can filter circuits by any connected city tag.

---

## 3. Comprehensive Master File Registry

### A. Backend API & Database

#### 1. Models
- **`backend/models/Tour.js`**
  - Added `category` (String) and `categoryId` (String) fields.
  - Added `cities: [{ cityId, name, slug }]` array schema.
  - Removed restrictive `region` enum to support custom destination categories.
- **`backend/models/BlogPost.js`**
  - Added `cities: [{ cityId, name, slug }]` array schema.
  - Added `categoryId` (String) field.
- **`backend/models/DestinationCategory.js`**
  - Added schema for categories: `name`, `slug`, `tagline`, `description`, `coverImage`, `order`, `status`.
- **`backend/models/CustomUrl.js`**
  - Schema for SEO friendly custom URLs, rewrites, and 301/302 redirects.

#### 2. Routes & Controllers
- **`backend/routes/destinationRoutes.js`**
  - Added `GET /api/destinations/categories`: Fetches all active destination categories from the `destinationcategories` MongoDB collection.
- **`backend/routes/tourRoutes.js`**
  - `normalizeBlogToTour`: Formats and normalizes `cities` tags array and `category` from document data or legacy comma-separated location strings.
  - `GET /api/tours`: Enhanced city filter logic to search `cities.name` and `cities.slug` regex patterns in addition to location/title.
  - `GET /api/tours/:identifier`: Finds tour by ObjectId, slug, or customUrl and returns normalized object with `cities` tags.
  - `POST /api/tours`: Formats and persists `cities: [{ name, slug, cityId }]` and `category` upon package creation.
  - `PUT /api/tours/:id`: Handles updating connected `cities` tags and `category`.
  - Removed `.slice(0, 160)` and `.slice(0, 300)` limits on excerpt, subtitle, and description to ensure full text delivery without truncation.
- **`backend/routes/customUrlRoutes.js`**
  - `GET /api/custom-urls/resolve`: Checks incoming path against `custom_urls` collection for 301/302 redirects or direct entity rewrites.

#### 3. Migration Scripts
- **`backend/scripts/migrate_cities_tags.js`**
  - Automated migration script that connects to MongoDB and populates the `cities` array for all existing documents in `tours` and `blogs` collections.
  - Executed on database:
    - `tours` collection: 35 / 35 documents updated.
    - `blogs` collection: 270 / 270 documents updated.

---

### B. Frontend React

#### 1. Services & Networking
- **`frontend/src/services/api.js`**
  - `fetchDestinationCategories()` calling `/destinations/categories`.
  - `fetchTourBySlug(slug)` calling `/tours/${slug}`.
  - `resolveCustomUrl(path)` calling `/custom-urls/resolve?path=${path}`.

#### 2. Routing & Architecture
- **`frontend/src/App.jsx`**
  - `/tours/:slug` -> `TourRedirect` (redirects automatically to `/:slug`).
  - `*` -> `CustomUrlResolver` handles all dynamic clean URLs (`/:slug`).
- **`frontend/src/components/CustomUrlResolver.jsx`**
  - Resolves any slug against custom URL rules, tours, destinations, and blog posts.
  - Passes cached data directly to destination/tour detail components without double-fetching.

#### 3. Public Website Pages
- **`frontend/src/pages/Tours.jsx`**
  - Updated card links to `/${tour.slug}`.
  - Displays connected city tag pills (`📍 Jodhpur`, `📍 Jaipur`, etc.).
  - City filter checks `tour.cities` tags array.
- **`frontend/src/components/TourImageSlider.jsx`**
  - Interactive multiple image slider with autoplay (4.5s), swipe/touch support, navigation arrows, photo counter, clickable thumbnails strip, and full-screen lightbox modal (clean image view without city overlay).
  - Pulls images from `tour.gallery` and supplements with high-definition destination photos from the website library.
- **`frontend/src/pages/TourDetail.jsx`**
  - Integrated `TourImageSlider` directly above "Aperçu du Circuit".
  - Configured sticky right sidebar (`position: sticky; top: 95px; alignSelf: 'start'`) so the booking inquiry box smoothly tracks the scroll alongside the itinerary and package content.
  - Displays "Villes & Étapes de ce Circuit" with static non-clickable city badges.
  - Accepts `initialTour` prop for instant hydration.
  - Removed top hero category badge box (`.badge-gold`) and repositioned location indicator directly under the main title.
  - Removed the subtitle from the top Hero banner and placed it directly under **"Aperçu du Circuit"** without any text or character limit.
  - Clean SEO metadata generation.
- **`frontend/src/assets/style.css`**
  - Updated `html` and `body` rules from `overflow-x: hidden` to `overflow-x: clip` to ensure `position: sticky` is never broken by browser scroll container clipping.
- **`frontend/src/pages/DestinationDetail.jsx`**
  - Updated tour card links to `/${pkg.slug}`.
  - Filters packages connected to the destination city.
- **`frontend/src/pages/Home.jsx`**
  - Updated all featured and recent tour links to clean root URLs (`/${tourSlug}`).
- **`frontend/src/pages/NotreEquipe.jsx`**
  - Converted team cards layout to a responsive **4-column grid** (`.team-4col-grid`) on desktop with balanced card proportions, adjusted photo heights, and adaptive container width.

#### 4. Admin Management Panel
- **`frontend/src/pages/admin/AdminTours.jsx`**
  - Package Destination Categories dropdown.
  - Interactive Connected Cities Multi-Selector (badges, popular chips, custom add).
  - Admin table columns for Destination Category and Connected Cities tags.
- **`frontend/src/pages/admin/AdminCustomUrls.jsx`**
  - Management of clean root URLs and 301 redirects.

---

## 4. How to Run & Verify

### 1. Backend Server
```bash
cd c:\laragon\www\react\jodhpur_voyage\backend
npm run dev
```

### 2. Frontend Development Server
```bash
cd c:\laragon\www\react\jodhpur_voyage\frontend
npm run dev
```

### 3. Production Build Validation
```bash
cd c:\laragon\www\react\jodhpur_voyage\frontend
npm run build
```
*(Verified: Vite build succeeds with 0 errors.)*

### 4. Verifying URL Redirection
1. Visit `http://localhost:5173/tours/ladakh-traverse-du-petit-tibet-et-des-cols-mythiques`
2. Browser automatically redirects and displays: `http://localhost:5173/ladakh-traverse-du-petit-tibet-et-des-cols-mythiques`
3. Click any tour card on `/circuits`, `/tours`, or `/` -> opens directly as `/:slug`.

---

## 5. Developer Guidelines for Future Changes
1. **Always Update This README:** Whenever adding or altering an API route, MongoDB schema, or React component/page, add an entry to this file.
2. **Never Hardcode `/tours/:slug`:** Always generate tour links as `/${tour.slug}`.
3. **Maintain Fallbacks:** Keep `TourRedirect` in `App.jsx` so external links pointing to legacy `/tours/...` URLs never break.

---

## 6. Tour Highlights ("Les Points Forts du Voyage") Reference

### Files & Data Flow
1. **Frontend Rendering:** [`frontend/src/pages/TourDetail.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/pages/TourDetail.jsx#L201)
   - Section heading: `<i className="fas fa-star"></i> Les Points Forts du Voyage`
   - Iterates over `validHighlights = tour.highlights`
2. **Admin Default Data Source:** [`frontend/src/pages/admin/AdminTours.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/pages/admin/AdminTours.jsx#L66)
   - Initial state default values: `['Visit Taj Mahal', 'Jaipur Royal Palaces', 'Mehrangarh Fort of Jodhpur']`
   - Persisted into MongoDB under `highlights` array upon tour creation.
3. **Backend Normalization:** [`backend/routes/tourRoutes.js`](file:///c:/laragon/www/react/jodhpur_voyage/backend/routes/tourRoutes.js#L78)
   - Validates `doc.highlights` or falls back to standard customizable bullet points.

---

## 7. Destination Mega-Menu: 5-Column Navigation & "Inde de l'Ouest" Section

### Business Requirement
- In the navigation bar **Destination** dropdown (Mega Menu):
  1. **Removed the right-side visual card** (`Le Rajasthan Doré` / `Incontournable` featured card) to maximize space for destination regions.
  2. **Added a 5th regional column:** **"Inde de l'Ouest"** (`inde du ouest`) alongside `Inde du Nord`, `Inde du Sud`, `Népal`, and `Bhoutan`.
  3. **Admin Destination Region Selector:** Added `inde-de-louest` ("West India / Inde de l'Ouest") into the Admin panel destination creation/edit dropdown and filter tabs, allowing easy assignment of destinations into this 5th section.
  4. **Immediate Visibility:** Configured default western destinations (`Gujarat`, `Désert du Rann de Kutch`, `Palitana`) as fallback items so the 5th column renders immediately even before new destinations are entered.

### Files Modified

| Component / Layer | File | Description of Changes |
| :--- | :--- | :--- |
| **React Component** | [`frontend/src/components/Navbar.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/components/Navbar.jsx) | 1. Added `ouest` group (`Inde de l'Ouest`) to `DEFAULT_DESTINATION_GROUPS`.<br>2. Updated `fetchDestinations` dynamic grouping to map `inde-de-louest`, `inde-du-ouest`, `ouest`, and `gujarat` to `ouest`.<br>3. Added fallback subcategories so the column is immediately visible.<br>4. Removed `{destinationsMenu?.featuredCard && ...}` from mega menu. |
| **CSS Styling** | [`frontend/src/assets/components.css`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/assets/components.css) | Updated `.mega-grid-destinations` from 4 columns + 240px card to `grid-template-columns: repeat(5, minmax(0, 1fr));` with `1.4rem` gap. |
| **React Admin** | [`frontend/src/pages/admin/AdminDestinations.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/pages/admin/AdminDestinations.jsx) | 1. Added `inde-de-louest` option to the Mega-Menu Column (Region) `<select>`.<br>2. Added West India tab to `REGION_TABS`.<br>3. Updated `getRegionBadge` and filter matching for West India.<br>4. Added West India presets for Gujarat, Rann de Kutch, and Palitana. |
| **React Page** | [`frontend/src/pages/Destinations.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/pages/Destinations.jsx) | Added `ouest` category mapping, filter button, and tab for "Inde de l'Ouest". |
| **Backend Model** | [`backend/models/Destination.js`](file:///c:/laragon/www/react/jodhpur_voyage/backend/models/Destination.js) | Added `inde-de-louest`, `inde-du-ouest`, `ouest` to the Mongoose `region` enum. |
| **Backend Route** | [`backend/routes/tourRoutes.js`](file:///c:/laragon/www/react/jodhpur_voyage/backend/routes/tourRoutes.js) | Added regex pattern matching for `inde-de-louest`, `inde-du-ouest`, and `ouest` in the `/api/tours` region filter. |

---

## 8. Real Blog Architecture, Data Source & Navigation Links

### Background & Discovery
1. **Real Data Storage Location:**
   - Real blog articles imported from the original WordPress platform (`jodhpurvoyage.com`) are stored in the MongoDB **`blogs`** collection (total **271 articles**).
   - The Mongoose model [`backend/models/BlogPost.js`](file:///c:/laragon/www/react/jodhpur_voyage/backend/models/BlogPost.js) is configured with `collection: 'blogs'`.
2. **Breakdown of Real Articles:**
   - **Inde (`/blog_category/inde/`):** **266 articles** (e.g. *Voyage à Jaisalmer*, *Voyage au Rajasthan : le fort et le palais de Jodhpur*, *Monastère de Lamayuru*, *Delhi la capitale de l'Inde*, *Séjour en Inde : Taj Mahal Agra*, etc.)
   - **Népal (`/blog_category/nepal-2/`):** **5 articles** (*Voyage au Népal – Les bazars de l'Himalaya*, *Voyage au Népal : Bhaktapur*, *Voyage au Népal : Kathmandu*, *Voyage au Népal*, *Guide complet pour réussir son trek dans l'Himalaya*).
3. **Problem Identified & Resolved:**
   - Previously, [`backend/routes/blogRoutes.js`](file:///c:/laragon/www/react/jodhpur_voyage/backend/routes/blogRoutes.js) was querying the `Tour` collection instead of `BlogPost`, which caused the actual 271 real blog articles to be bypassed.
   - The top navigation bar in [`Navbar.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/components/Navbar.jsx) was missing the "Blog" dropdown that exists on the live WordPress site.

### Files Modified

| Component / Layer | File | Description of Changes |
| :--- | :--- | :--- |
| **Backend Route** | [`backend/routes/blogRoutes.js`](file:///c:/laragon/www/react/jodhpur_voyage/backend/routes/blogRoutes.js) | 1. Switched data source from `Tour` to `BlogPost` (`blogs` collection).<br>2. Added category filters for `inde` (266 articles) and `nepal`/`nepal-2` (5 articles).<br>3. Supports search by title, excerpt, and content.<br>4. Supports single article lookup by slug, customUrl, or originalUrl with `cleanHtml` formatting. |
| **Top Navigation** | [`frontend/src/components/Navbar.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/components/Navbar.jsx) | Added **Blog** dropdown matching the live website:<br>• **Inde** $\to$ `/blog_category/inde`<br>• **Nepal** $\to$ `/blog_category/nepal-2`<br>• **Tous les articles** $\to$ `/blog` |
| **React Router** | [`frontend/src/App.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/App.jsx) | Added routes:<br>• `/blog_category/:category`<br>• `/blog_category/:category/page/:page` |
| **React Page** | [`frontend/src/pages/Blog.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/pages/Blog.jsx) | 1. Added `useParams` & `useSearchParams` to read `routeCategory` (`inde`, `nepal`, `nepal-2`).<br>2. Added interactive filter chips for **Inde** and **Népal**.<br>3. Dynamic page titles and counts matching the category. |
| **CSS Styling** | [`frontend/src/assets/components.css`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/assets/components.css) | Added `.nav-item.has-dropdown`, `.nav-dropdown-menu`, `.nav-dropdown-item` styles for desktop hover and mobile drawer. |

---

## 9. Admin Tour Add/Edit: Subtitle Field Repositioning & Limitless Textarea

### Business Requirement
- In the Admin Panel **Tour Package Add & Edit Dialog** ([`AdminTours.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/pages/admin/AdminTours.jsx)):
  1. **Field Repositioning:** Moved **Subtitle / Tagline** down from the top (was previously cramped between Tour Title and Duration) down to right above `Overview & Presentation *` and below `Tour Main Banner / Image`.
  2. **Expanded Limitless Textarea:** Transformed the single-line `<input type="text" />` into a comfortable multi-line `<textarea rows="4" />` with no length limit.
  3. **Live Character Indicator:** Added real-time character count tracking: `"{N} caractères (aucune limite)"`.
  4. **Backend Fidelity:** Ensured [`tourRoutes.js`](file:///c:/laragon/www/react/jodhpur_voyage/backend/routes/tourRoutes.js) directly preserves and returns `doc.subtitle` without any truncation or fallback slicing.

### Files Modified

| Component / Layer | File | Description of Changes |
| :--- | :--- | :--- |
| **React Admin** | [`frontend/src/pages/admin/AdminTours.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/pages/admin/AdminTours.jsx) | 1. Removed `Subtitle / Tagline` from above Duration.<br>2. Added `Subtitle / Tagline (Aperçu du Circuit)` as a multi-line `<textarea rows="4">` right above Overview.<br>3. Added live character counter badge.<br>4. Updated `handleEdit` and `handleSubmit` to pass `subtitle` with full fidelity. |
| **Backend Route** | [`backend/routes/tourRoutes.js`](file:///c:/laragon/www/react/jodhpur_voyage/backend/routes/tourRoutes.js) | Updated `normalizeBlogToTour`, `POST /api/tours`, and `PUT /api/tours/:id` to explicitly preserve `subtitle` without slicing. |

---

## 10. Admin Blog Rich Text WYSIWYG Editor with In-Content Picture Uploading

### Business Requirement
- In the Admin Panel **Blog Articles Management** ([`AdminBlogs.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/pages/admin/AdminBlogs.jsx)):
  1. **Replace Plain Textarea with Rich Text Editor:** Previously, the article content field was a plain HTML `<textarea rows="8">` which did not allow formatted typography, headings, or inserting pictures directly inside the text.
  2. **In-Content Pictures / Photos Insertion:** Enable administrators to insert pictures anywhere inside the article body with:
     - **Quick 1-Click Upload ("Photo Directe"):** Select an image file from the computer $\to$ uploads to Cloudinary via existing `/upload` API $\to$ embeds directly into the article at the cursor position.
     - **Image Options Modal:** Upload a local image or paste a web URL, set an optional caption / alt text, and choose image alignment (**Centré 85%**, **Pleine Largeur 100%**, **Flottant Gauche 45%**, or **Flottant Droite 45%**).
  3. **Rich Typography & Formatting:**
     - Headings dropdown (Paragraphe, Titre H2, Titre H3, Titre H4, Citation Blockquote).
     - Bold, Italic, Underline, Strikethrough, Brand Gold text color.
     - Bullet lists, Numbered lists, Horizontal divider.
     - Hyperlink insertion with custom text and new-tab toggle.
     - Undo / Redo and Clear Formatting.
     - **Dual Mode:** Visual WYSIWYG mode and raw HTML Code (`</>`) mode to inspect or fine-tune raw HTML tags.
     - Live word and character counters.
  4. **Frontend Article Rendering:** Updated styling in `components.css` for `.blog-content-figure`, `.blog-detail-content h2/h3/h4/blockquote`, ensuring in-content images and captions render with responsive layout and elegant shadows on [`BlogDetail.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/pages/BlogDetail.jsx).

### Files Modified & Created

| Component / Layer | File | Description of Changes |
| :--- | :--- | :--- |
| **New Component** | [`frontend/src/components/RichTextEditor.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/components/RichTextEditor.jsx) | Created comprehensive WYSIWYG editor component with formatting toolbar, direct 1-click photo upload, image options modal with captions & alignment, link modal, and HTML source mode. |
| **React Admin** | [`frontend/src/pages/admin/AdminBlogs.jsx`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/pages/admin/AdminBlogs.jsx) | 1. Imported `RichTextEditor`.<br>2. Replaced `<textarea rows="8">` with `<RichTextEditor>`.<br>3. Widened modal dialog to `maxWidth: '960px'` for spacious editing.<br>4. Added validation in `handleSubmit` to ensure non-empty article content. |
| **CSS Styling** | [`frontend/src/assets/components.css`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/assets/components.css) | Added `.rich-btn`, `.rich-editor-content`, `.blog-content-figure`, figure alignments (`.align-center`, `.align-full`, `.align-left`, `.align-right`), captions, and responsive mobile overrides. |

## 11. Itinerary Page – Backend Slider Image Management

### Overview
Administrators can now fully manage, upload, reorder, and delete slider images displayed in the Itinerary page directly from the Admin Panel without needing code changes.

### Key Capabilities
1. **Multi-Image Upload & Batch Adding:**
   - Admin can upload multiple photos at once from their device (Cloudinary with local server fallback) or paste direct image URLs.
   - Batch upload endpoint `POST /api/upload/multiple` supports up to 30 files in a single request with client-side fallback.
2. **Dedicated Itinerary Sliders Management Dashboard (`/admin/itinerary-slider`):**
   - New dedicated navigation item in Admin Sidebar: **Catalog & Content $\to$ Itinerary Sliders**.
   - Tour selector with search filter and current photo count badges.
   - Interactive reordering (move left/right), set as cover/first slide, delete, replace image, and reset changes.
   - Live interactive slider preview with **Desktop View** vs **Mobile (375px)** simulation.
3. **Integrated in Tours & Itineraries Management (`/admin/tours`):**
   - Quick action link on every tour row: **`🖼️ Slider (X)`** linking directly to the itinerary slider manager.
   - In-modal "Itinerary Slider Photos" section for managing slider gallery photos directly while editing tour packages.
4. **Dynamic Frontend Rendering & Mobile Responsiveness (`TourImageSlider.jsx`):**
   - Slider dynamically prioritizes admin-uploaded `tour.gallery` photos without injecting unwanted library images into custom galleries.
   - Viewport height adapts smoothly across mobile and desktop (`clamp(260px, 45vw, 440px)`).
   - Thumbnails row uses a smooth scrollable flex track with snap alignment that never squishes thumbnails regardless of photo count.
   - Full keyboard navigation (arrow keys, Escape to close lightbox) and touch swipe gestures.

## 12. Itinerary Page – Sticky “Sur Devis Gratuit” Section (Desktop & Mobile)

### Business Requirement
Make the **“Sur Devis Gratuit”** section sticky while scrolling through the itinerary on both desktop and mobile devices so that it remains easily accessible without obstructing readability or compromising responsiveness.

### Implementation Details
1. **Desktop Sticky Sidebar (`.tour-detail-sidebar`):**
   - Fixed `position: sticky; top: 92px; align-self: start; z-index: 20;`.
   - Resolved CSS clipping issue in [`frontend/src/assets/style.css`](file:///c:/laragon/www/react/jodhpur_voyage/frontend/src/assets/style.css) by transitioning `html`, `body`, and `#root` from `overflow-x: hidden` to `overflow-x: clip`, allowing standard CSS sticky context to execute smoothly along the entire day-by-day itinerary.
2. **Mobile Sticky Action Bar (`.tour-mobile-sticky-bar`):**
   - On screens under 992px, once the user scrolls past the top hero banner, a sleek bottom sticky action bar slides into view (`position: fixed; bottom: 0; left: 0; right: 0; z-index: 998;`).
   - Features:
     - Badge: **"Devis 100% Personnalisé"**
     - Price: **"Sur Devis Gratuit"** with duration and response time indication.
     - Direct WhatsApp quick chat button with encoded tour context.
     - Primary **"Demander un Devis"** button opening the inquiry modal.
   - Designed with safe-area insets (`env(safe-area-inset-bottom)`), frosted-glass blur backdrop, gold accent border, and adjusted offset for floating WhatsApp / scroll-to-top buttons to avoid overlap.


## 13. Mega-Menu Destination Standardization & Consistency

### Business Requirement
Fix destination mega-menu inconsistency where two conflicting menu versions were appearing (initial default placeholder vs dynamic database menu). Retained the second verified menu layout and standardized both fallback and dynamic states.

### Standard Destination Structure (23 destinations across 5 regional columns):
1. **Inde du Nord (8):** Agra, Amritsar, Bénarès, Delhi, Himachal Pradesh, Ladakh, Rajasthan, Rishikesh
2. **Inde du Sud (8):** Chennai, Goa, Karnataka, Kerala, Tamil Nadu, Bombay, Madras, Orissa
3. **Inde de l'Est & de l'Ouest (3):** Gujarat, Madhya Pradesh, Darjeeling & Sikkim
4. **Népal (1):** Népal
5. **Bhoutan (3):** Punakha, Paro, Thimphu

### Implementation Details
- **`frontend/src/components/Navbar.jsx`**:
  - Updated `DEFAULT_DESTINATION_GROUPS` to exactly match the canonical 23-item menu list.
  - Added `NAME_NORMALIZATION` mapping to ensure legacy or compound names from any data source are cleanly mapped to standardized titles.
  - Added `SUBMENU_ORDER` sorting to guarantee consistent, alphabetical & regional column ordering across initial load, API fetch, and page transitions.
  - Rebuilt production bundle (`frontend/dist`).


## 14. Seed Files Removal for Production Readiness

### Business Requirement
Remove all development/mock seed files (`backend/seed/` directory) and decouple all backend routes from mock seed data dependencies for clean production readiness.

### Implementation Details:
1. **Removed Seed Directory & Scripts:**
   - Deleted entire `backend/seed/` folder (`seedData.js`, `seed.js`, `seedReviews.js`, `megaMenuData.js`, `pagesSeedData.js`, `reviewsSeedData.js`, `heroSliderSeedData.js`, `seoData.js`).
   - Removed `backend/scripts/syncTeamData.js`.
   - Cleaned `seed` and `seed:reviews` scripts from [`backend/package.json`](file:///c:/laragon/www/react/jodhpur_voyage_live/backend/package.json).
2. **Decoupled Backend Routes from Seed Dependencies:**
   - [`backend/store.js`](file:///c:/laragon/www/react/jodhpur_voyage_live/backend/store.js): Removed all seed data imports, initializing empty in-memory collections.
   - [`backend/routes/megaMenuRoutes.js`](file:///c:/laragon/www/react/jodhpur_voyage_live/backend/routes/megaMenuRoutes.js): Removed `defaultMegaMenuData` import; all operations strictly query MongoDB.
   - [`backend/routes/pageRoutes.js`](file:///c:/laragon/www/react/jodhpur_voyage_live/backend/routes/pageRoutes.js): Removed `defaultPagesData` import; pages are served dynamically from MongoDB `pagecontents`.
   - [`backend/routes/seoRoutes.js`](file:///c:/laragon/www/react/jodhpur_voyage_live/backend/routes/seoRoutes.js): Removed `defaultSeoData` import; SEO metadata is served dynamically from MongoDB `seos`.
   - [`backend/routes/heroSliderRoutes.js`](file:///c:/laragon/www/react/jodhpur_voyage_live/backend/routes/heroSliderRoutes.js): Removed `defaultHeroSlidesData` import and auto-seeding logic.
   - [`backend/routes/reviewRoutes.js`](file:///c:/laragon/www/react/jodhpur_voyage_live/backend/routes/reviewRoutes.js): Removed `defaultReviewsData` import and auto-seeding logic.
3. **Verification:**
   - Verified that all backend modules, routes, and stores load cleanly with 0 errors.
   - Verified frontend production build compiles cleanly (`npm run build`).


## 15. Removal of Non-Existent Hardcoded Tour Slugs

### Business Requirement
Remove non-existent legacy hardcoded dummy package slugs (`joyaux-du-kerala-backwaters`, `sejour-au-rajasthan-et-benares`, `trek-voyage-ladakh-petit-tibet`, `circuit-vallee-de-spiti-et-kinnaur`) across all frontend pages and rely directly on live database tours.

### Changes Made:
1. **[`frontend/src/pages/DestinationDetail.jsx`](file:///c:/laragon/www/react/jodhpur_voyage_live/frontend/src/pages/DestinationDetail.jsx)**:
   - Cleared `defaultPackages` dummy fallback array (`const defaultPackages = [];`).
   - Conditioned tour packages section to render purely when matching database tours are retrieved (`packages && packages.length > 0`).
2. **[`frontend/src/pages/Home.jsx`](file:///c:/laragon/www/react/jodhpur_voyage_live/frontend/src/pages/Home.jsx)**:
   - Removed `sejour-au-rajasthan-et-benares` and `circuit-vallee-de-spiti-et-kinnaur` from `popularToursData`.
   - Ensured fallback slugs strictly map to verified existing tours in the database.
3. **Build & Verification:**
   - Production Vite build ran cleanly (`dist/assets/index-UZyaS0Ty.js`).
   - Verified 0 remaining occurrences of the 4 removed slugs in `frontend/src`.


## 16. Culture & Safari Checkbox in Tour Management

### Business Requirement
Add a dedicated checkbox **"Culture & Safari"** in the Admin Tour Add/Edit dialog next to "Published" and "Feature on Homepage", enabling administrators to selectively showcase tours on the **Culture & Safari** page (`/culture-et-safari`).

### Implementation Details:
1. **Database Schema ([`backend/models/Tour.js`](file:///c:/laragon/www/react/jodhpur_voyage_live/backend/models/Tour.js)):**
   - Added `cultureSafari: { type: Boolean, default: false }`.
2. **Backend API ([`backend/routes/tourRoutes.js`](file:///c:/laragon/www/react/jodhpur_voyage_live/backend/routes/tourRoutes.js)):**
   - Added support for query filter `GET /api/tours?cultureSafari=true`.
   - Included `cultureSafari` in normalized tour objects, creation (`POST`), and updates (`PUT`).
3. **Admin Management Panel ([`frontend/src/pages/admin/AdminTours.jsx`](file:///c:/laragon/www/react/jodhpur_voyage_live/frontend/src/pages/admin/AdminTours.jsx)):**
   - Added **`☑ Culture & Safari (Show on Culture & Safari page)`** checkbox in the options bar alongside "Published" and "Feature on Homepage".
   - Added status badge indicator `[🐾 Culture & Safari]` in the admin tours table for quick visibility.
4. **Public Culture & Safari Page ([`frontend/src/pages/DynamicPage.jsx`](file:///c:/laragon/www/react/jodhpur_voyage_live/frontend/src/pages/DynamicPage.jsx)):**
   - Automatically loads and displays a packages grid of all tours checked as `cultureSafari: true`.
   - Linked Inspiration Mega Menu item `Culture & Safari` directly to `/culture-et-safari`.
5. **No Code Pushed to Git:** Changes remain strictly local for user review as requested.
