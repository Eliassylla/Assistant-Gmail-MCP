const retry = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    shouldRetry = (error) => true,
    onRetry = (error, retryCount) => {}
  } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt >= maxRetries || !shouldRetry(error)) {
        throw error;
      }
      
      onRetry(error, attempt + 1);
      
      // Attendre avec backoff exponentiel
      const delay = retryDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

module.exports = { retry };