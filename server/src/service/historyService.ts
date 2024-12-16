import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// Define the City class
class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

class HistoryService {
  private filePath = './server/data/searchHistory.json';

  // Read the JSON file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error) {
      console.error('Error reading search history file:', error);
      return [];
    }
  }

  // Write to the JSON file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing to search history file:', error);
    }
  }

  // Get all cities from the JSON file
  public async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Add a new city to the search history
  public async addCity(name: string): Promise<City> {
    const cities = await this.read();
    const newCity = new City(uuidv4(), name);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  // Remove a city from the search history
  public async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter((city) => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();
