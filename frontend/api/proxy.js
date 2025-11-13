export default async function handler(req, res) {
  const { method, url, headers, body } = req;
  
  // Extract the actual API path from the request
  const apiPath = url.replace('/api/proxy', '');
  const backendUrl = `http://localhost:3000/api/v1${apiPath}`;
  
  try {
    const response = await fetch(backendUrl, {
      method,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        // Remove host header that might cause issues
        host: undefined,
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });
    
    const data = await response.text();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Backend unreachable', message: error.message });
  }
}