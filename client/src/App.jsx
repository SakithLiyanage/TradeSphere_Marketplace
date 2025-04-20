import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ListingProvider } from './context/ListingContext';
import Favorites from './components/favorites/Favorites';

// Layouts
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import CategoryPage from './pages/CategoryPage';
import NotFoundPage from './pages/NotFoundPage';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Listings Components
import ListingDetails from './components/listings/ListingDetails';
import CreateListing from './components/listings/CreateListing';
import EditListing from './components/listings/EditListing';

// User Components
import Dashboard from './components/user/Dashboard';
import Profile from './components/user/Profile';

// Utils
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ListingProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Toaster position="top-center" />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/listings/:id" element={<ListingDetails />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/categories/:category" element={<CategoryPage />} />
                
                {/* Protected routes */}
                <Route path="/create-listing" element={
                  <PrivateRoute>
                    <CreateListing />
                  </PrivateRoute>
                } />
                <Route path="/edit-listing/:id" element={
                  <PrivateRoute>
                    <EditListing />
                  </PrivateRoute>
                } />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/favorites" element={
                  <PrivateRoute>
                    <Favorites />
                  </PrivateRoute>
                } />
                {/* 404 route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              
              
            </main>
            <Footer />
          </div>
        </ListingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;