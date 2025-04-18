// src/components/common/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md m-4">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-4">An error occurred in the application.</p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
          <details className="mt-4">
            <summary className="cursor-pointer">View error details</summary>
            <pre className="mt-2 p-2 bg-red-100 overflow-auto text-sm">
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;