const CACHE_NAME = 'betganji-cache-v1';
const API_ENDPOINTS = ['/api/matches', '/api/predictions', '/api/odds'];

// Circuit breaker configuration
const circuitBreaker = {
  failureThreshold: 5,
  resetTimeout: 60000, // 1 minute
  endpoints: new Map()
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/dashboard',
        '/predictions',
        '/matches'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      handleRequest(event.request)
    );
  }
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Check if this is an API request
  if (API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint))) {
    return handleAPIRequest(request);
  }
  
  // For non-API requests, use cache-first strategy
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return new Response('Offline content not available', { status: 503 });
  }
}

async function handleAPIRequest(request) {
  const url = new URL(request.url);
  const endpoint = url.pathname;
  
  // Check circuit breaker
  if (isCircuitOpen(endpoint)) {
    return new Response('Service temporarily unavailable', { status: 503 });
  }
  
  try {
    const response = await fetchWithRetry(request);
    resetCircuitBreaker(endpoint);
    return response;
  } catch (error) {
    incrementFailureCount(endpoint);
    throw error;
  }
}

async function fetchWithRetry(request, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(request);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}

function isCircuitOpen(endpoint) {
  const circuit = circuitBreaker.endpoints.get(endpoint);
  if (!circuit) return false;
  
  if (circuit.failures >= circuitBreaker.failureThreshold) {
    if (Date.now() - circuit.lastFailure < circuitBreaker.resetTimeout) {
      return true;
    }
    // Reset after timeout
    circuitBreaker.endpoints.delete(endpoint);
  }
  return false;
}

function incrementFailureCount(endpoint) {
  const circuit = circuitBreaker.endpoints.get(endpoint) || { failures: 0 };
  circuit.failures++;
  circuit.lastFailure = Date.now();
  circuitBreaker.endpoints.set(endpoint, circuit);
}

function resetCircuitBreaker(endpoint) {
  circuitBreaker.endpoints.delete(endpoint);
}