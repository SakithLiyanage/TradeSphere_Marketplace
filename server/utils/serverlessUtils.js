/**
 * Utility functions for serverless environment
 */

// Wrap database operations with timeout and retry logic
const withDbRetry = async (operation, maxRetries = 3, timeout = 5000) => {
  let retries = 0;
  let lastError;
  
  while (retries < maxRetries) {
    try {
      // Create a promise that rejects after timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Operation timed out after ${timeout}ms`)), timeout);
      });
      
      // Race the operation against the timeout
      return await Promise.race([operation(), timeoutPromise]);
    } catch (error) {
      lastError = error;
      retries++;
      console.log(`Operation failed (attempt ${retries}/${maxRetries}):`, error.message);
      
      if (retries < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
      }
    }
  }
  
  throw lastError;
};

module.exports = {
  withDbRetry
};
