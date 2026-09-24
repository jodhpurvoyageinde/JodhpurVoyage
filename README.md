# Jodhpur Voyage - Backend API

RESTful API backend for **Jodhpur Voyage** Travel Agency & Tour Operator.

## 🚀 Features

- **Tours Management**: Itineraries, regions, custom filters, highlights, inclusions/exclusions.
- **Destinations Guide**: Multi-region destinations (Rajasthan, North India, South India, Nepal, Bhutan, etc.).
- **Bookings & Tailor-made Trips**: Inquiry pipeline with status management.
- **Contact & Inquiries**: Message capture and management.
- **Verified Customer Reviews**: Testimonials and ratings.
- **Blog / Travel Guides**: Content management with full article formatting.
- **Image Uploads**: Cloudinary integration and local fallback.
- **Authentication**: JWT authentication with bcrypt password hashing for admin portal.
- **Dual Store Architecture**: MongoDB Atlas support with instant In-Memory fallback.

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jodhpurvoyageinde/JodhpurVoyage.git
   cd JodhpurVoyage/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Start Production Server**:
   ```bash
   npm start
   ```

## 📡 Key Endpoints

- `GET /api/health` - API health check & MongoDB connection status
- `GET /api/tours` - List all published tours
- `GET /api/destinations` - List destinations
- `POST /api/bookings` - Submit tailor-made trip inquiry
- `POST /api/contacts` - Send contact message
- `GET /api/reviews` - List approved reviews
- `GET /api/blogs` - List published blog posts
- `POST /api/auth/login` - Admin authentication
