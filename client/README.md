# Ikman Marketplace Client

This is the client-side application for the Ikman Marketplace, built using the MERN stack (MongoDB, Express, React, Node.js). The application allows users to post their properties such as vehicles, lands, electrical items, and other goods to a marketplace. Other users can view these listings and contact the sellers for purchase.

## Features

- User authentication (login and registration)
- Create, edit, and delete listings
- View detailed information about each listing
- User profiles and dashboards
- Responsive design using Tailwind CSS
- Loading indicators for data fetching

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB database (local or cloud).

### Installation

1. Clone the repository:

   git clone https://github.com/yourusername/ikman-marketplace.git

2. Navigate to the client directory:

   cd ikman-marketplace/client

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