class RateLimiter {
  constructor(maxRequests = 10, timeWindowMs = 1000) {
    this.maxRequests = maxRequests;
    this.timeWindowMs = timeWindowMs;
    this.requestTimestamps = [];
  }
  
  async throttle() {
    // Nettoyer les anciennes entrées
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => now - timestamp < this.timeWindowMs
    );
    
    // Si nous avons atteint la limite, attendre
    if (this.requestTimestamps.length >= this.maxRequests) {
      const oldestTimestamp = this.requestTimestamps[0];
      const waitTime = this.timeWindowMs - (now - oldestTimestamp);
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    // Ajouter une nouvelle entrée et continuer
    this.requestTimestamps.push(Date.now());
  }
}

// Exemple d'utilisation
const gmailRateLimiter = new RateLimiter(50, 10000); // 50 requêtes par 10 secondes

// Enveloppe pour les fonctions d'API
const rateLimitedApiCall = async (apiFunction, ...args) => {
  await gmailRateLimiter.throttle();
  return apiFunction(...args);
};

module.exports = {
  RateLimiter,
  gmailRateLimiter,
  rateLimitedApiCall
};