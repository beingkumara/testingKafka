export default async function handler(req, res) {
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

    res.status(200).json({ 
      food: foodCost, 
      hotel: 650, 
      tickets: 320,
      source: 'Numbeo API Scraper'
    });
  } catch (err) {
    res.status(200).json({ food: 250, hotel: 600, tickets: 300, error: err.message });
  }
}
