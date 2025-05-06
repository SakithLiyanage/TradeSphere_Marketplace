# TradeSphere Marketplace Server

## Overview
The TradeSphere Marketplace server is built using Node.js and Express, providing a RESTful API for the client-side application. This server allows users to register, log in, and manage their listings for various items such as vehicles, lands, and electrical items.

## Features
- User authentication (registration and login)
- CRUD operations for listings
- Middleware for error handling and authentication
- Integration with Cloudinary for image uploads
- MongoDB for data storage

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account for image uploads

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/TradeSphere-marketplace.git
   ```
2. Navigate to the server directory:
   ```
   cd TradeSphere-marketplace/server
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Configuration
1. Create a `.env` file in the server directory and add the following environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   CLOUDINARY_URL=your_cloudinary_url
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

### Running the Server
To start the server, run:
```
npm start
```
The server will run on `http://localhost:5000`.

### API Endpoints
- **Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Log in an existing user

- **Listings**
  - `GET /api/listings` - Get all listings
  - `POST /api/listings` - Create a new listing
  - `GET /api/listings/:id` - Get a specific listing
  - `PUT /api/listings/:id` - Update a specific listing
  - `DELETE /api/listings/:id` - Delete a specific listing

### Middleware
- **Auth Middleware**: Protects routes that require authentication.
- **Error Middleware**: Handles errors and sends appropriate responses.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.