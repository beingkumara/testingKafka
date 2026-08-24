import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const liveDataScraperPlugin = () => ({
  name: 'live-data-scraper',
  configureServer(server) {
    server.middlewares.use('/api/live-costs', async (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      try {
        const numbeoRes = await fetch('https://www.numbeo.com/cost-of-living/in/Abu-Dhabi', {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const numbeoHtml = await numbeoRes.text();
        
        const mealMatch = numbeoHtml.match(/Meal at an Inexpensive Restaurant.*?<td[^>]*>.*?<span[^>]*>([\d,.]+)/is) || numbeoHtml.match(/Meal at an Inexpensive Restaurant.*?<td[^>]*>([\d,.]+)/is);
        let foodCost = 250; 
        
        if (mealMatch) {
          const mealAED = parseFloat(mealMatch[1].replace(',', ''));
          foodCost = Math.round((mealAED / 3.67) * 5); 
        }

        res.end(JSON.stringify({ 
          food: foodCost, 
          hotel: 650, 
          tickets: 320,
          source: 'Numbeo API Scraper'
        }));
      } catch (err) {
        res.end(JSON.stringify({ food: 250, hotel: 600, tickets: 300, error: err.message }));
      }
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), liveDataScraperPlugin()],
  server: {
    proxy: {
      '/api/currency': { target: 'https://api.frankfurter.dev', changeOrigin: true, rewrite: (path) => path.replace(/^\/api\/currency/, '/v2/rates') },
      '/api/duffel': { target: 'https://api.duffel.com', changeOrigin: true, rewrite: (path) => path.replace(/^\/api\/duffel/, '') }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});