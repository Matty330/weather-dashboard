import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST: Fetch weather data and save city to search history
router.post('/', async (req, res) => {
  try {
    const { cityName } = req.body;

    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Fetch weather data
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // Save city to search history
    await HistoryService.addCity(cityName);

    return res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// GET: Retrieve search history
router.get('/history', async (_, res) => {
  try {
    const searchHistory = await HistoryService.getCities();
    return res.status(200).json(searchHistory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// DELETE: Remove city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'City ID is required' });
    }

    await HistoryService.removeCity(id);
    return res.status(200).json({ message: 'City removed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;
