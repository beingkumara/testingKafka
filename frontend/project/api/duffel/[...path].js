export default async function handler(req, res) {
  const { path } = req.query;
  const targetPath = Array.isArray(path) ? path.join('/') : path;
  const DUFFEL_API_KEY = process.env.DUFFEL_API_KEY;

  if (!DUFFEL_API_KEY) {
    return res.status(500).json({ error: 'DUFFEL_API_KEY is not configured on the server.' });
  }

  try {
    // Reconstruct the full URL with query parameters
    const urlObj = new URL(`https://api.duffel.com/${targetPath}`);
    
    // Copy over query string parameters (except the 'path' injected by Vercel)
    for (const [key, value] of Object.entries(req.query)) {
      if (key !== 'path') {
        urlObj.searchParams.append(key, value);
      }
    }

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
