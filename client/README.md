# TradeSphere Marketplace Client

This is the client-side application for the TradeSphere Marketplace, built using the MERN stack (MongoDB, Express, React, Node.js). The application allows users to post their properties such as vehicles, lands, electrical items, and other goods to a marketplace. Other users can view these listings and contact the sellers for purchase.

## Features

- **User Authentication**
  - Secure login and registration
  - JWT-based authentication
  - Password recovery
  - Email verification
  - Social media login integration

- **Listings Management**
  - Create, edit, and delete listings
  - Add multiple images with drag and drop functionality
  - Categorize listings by type (vehicles, electronics, real estate, etc.)
  - Set pricing and negotiation preferences
  - Mark listings as sold or available

- **Search and Discovery**
  - Advanced search with filters
  - Location-based search
  - Price range filtering
  - Category-specific attribute filtering
  - Saved searches and alerts

- **User Profiles and Dashboard**
  - Customizable user profiles
  - Activity history and statistics
  - Favorite/wishlist functionality
  - Message center for buyer-seller communication
  - Purchase and selling history

- **User Experience**
  - Responsive design using Tailwind CSS
  - Dark/light mode toggle
  - Loading indicators for seamless data fetching
  - Infinite scrolling for listing pages
  - Real-time notifications

- **Security Features**
  - Data encryption
  - Protection against common web vulnerabilities
  - Rate limiting to prevent abuse
  - GDPR compliance for user data

## Technologies Used

- **Frontend**: React.js, Redux, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT, OAuth
- **Image Storage**: AWS S3/Cloudinary
- **Deployment**: Docker, Netlify/Vercel (frontend), Heroku/AWS (backend)

## Getting Started

### Prerequisites

- Node.js (v14.0 or later) and npm installed on your machine
- MongoDB database (local or cloud-based instance)
- Git for version control

### Environment Variables

Create a `.env` file in the client directory with the following variables:
```
REACT_APP_API_URL=<your_api_url>
REACT_APP_CLOUDINARY_NAME=<your_cloudinary_name>
REACT_APP_CLOUDINARY_API_KEY=<your_cloudinary_api_key>
REACT_APP_CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```

### Installation

1. Clone the repository:

   git clone https://github.com/yourusername/tradesphere-marketplace.git

2. Navigate to the client directory:

   cd tradesphere-marketplace/client

3. Install the dependencies:

   npm install

### Running the Application

1. Start the development server:

   npm start

2. Open your browser and go to `http://localhost:3000` to view the application.

### Folder Structure

- **public/**: Contains static files like `index.html` and `favicon.ico`.
- **src/**: Contains the main application code.
  - **assets/**: Static assets such as images.
  - **components/**: Reusable components for the application.
    - **common/**: Common components like Header, Footer, Navbar, and Loader.
    - **auth/**: Components for authentication (Login and Register).
    - **listings/**: Components for managing listings (ListingCard, ListingDetails, CreateListing, EditListing).
    - **user/**: Components for user-related views (Profile and Dashboard).
  - **pages/**: Components representing different pages of the application.
  - **context/**: Context providers for managing global state (Auth and Listing contexts).
  - **utils/**: Utility functions for API calls and other helpers.
  - **App.jsx**: Main application component.
  - **index.jsx**: Entry point for the React application.
  - **index.css**: Global styles.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

### License

This project is licensed under the MIT License. See the LICENSE file for details.