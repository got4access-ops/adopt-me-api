import { fetchPets } from '../../lib/scraper.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { name } = req.query;
  if (!name) return res.status(400).json({ success: false, error: 'Missing pet name' });

  try {
    const pets = await fetchPets();
    const q = decodeURIComponent(name).toLowerCase().trim();

    // Try exact match first, then fuzzy
    let pet = pets.find(p => p.name.toLowerCase() === q);
    if (!pet) pet = pets.find(p => p.name.toLowerCase().includes(q));

    if (!pet) {
      return res.status(404).json({ success: false, error: `Pet "${name}" not found` });
    }

    return res.status(200).json({ success: true, pet });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
