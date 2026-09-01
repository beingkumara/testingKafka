export default async function handler(req, res) {
  // e.g. req.url might be /api/duffel/air/offer_requests?return_offers=true
  // We want to extract 'air/offer_requests?return_offers=true'
  const pathWithQuery = req.url.replace(/^\/api\/duffel\/?/, '');
  const DUFFEL_API_KEY = process.env.DUFFEL_API_KEY;

  if (!DUFFEL_API_KEY) {
    return res.status(500).json({ error: 'DUFFEL_API_KEY is not configured on the server.' });
  }

  try {
    const urlObj = new URL(`https://api.duffel.com/${pathWithQuery}`);

    const options = {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Duffel-Version': 'v2',
        'Content-Type': 'application/json'
      }
    };

    // If it's a POST/PUT request, forward the body
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(urlObj.toString(), options);
    
    // Forward the status code and content type
    res.status(response.status);
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    // Read and forward the response body
    const data = await response.text();
    res.send(data);

  } catch (error) {
    console.error('Duffel proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error fetching from Duffel' });
  }
}
