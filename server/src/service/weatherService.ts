import dotenv from 'dotenv';
import fetch from 'node-fetch';
import dayjs from 'dayjs';

dotenv.config();

// Define the Coordinates interface
interface Coordinates {
  lat: number;
  lon: number;
}

// Define the Weather class
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

class WeatherService {
  private baseURL = process.env.API_BASE_URL || '';
  private apiKey = process.env.API_KEY || '';

  // Fetch location data based on city name
  private async fetchLocationData(city: string): Promise<Coordinates> {
    const response = await fetch(
      `${this.baseURL}/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`
    );
    const data = await response.json();

    if (!data.length) {
      throw new Error('City not found');
    }

    const { lat, lon } = data[0];
    return { lat, lon };
  }

  // Fetch weather data based on coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const { lat, lon } = coordinates;
    const response = await fetch(
      `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`
    );
    return await response.json();
  }

  // Parse current weather data
  private parseCurrentWeather(data: any): Weather {
    const { name: city } = data.city;
    const { dt, weather, main, wind } = data.list[0];
    const date = dayjs.unix(dt).format('MM/DD/YYYY');
    const icon = weather[0].icon;
    const iconDescription = weather[0].description;
    const tempF = main.temp;
    const windSpeed = wind.speed;
    const humidity = main.humidity;

    return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
  }

  // Parse forecast data
  private buildForecastArray(data: any): Weather[] {
    const forecast = data.list.filter((entry: any, index: number) =>
      index % 8 === 0 && index > 0
    );

    return forecast.map((entry: any) => {
      const { dt, weather, main, wind } = entry;
      const date = dayjs.unix(dt).format('MM/DD/YYYY');
      const icon = weather[0].icon;
      const iconDescription = weather[0].description;
      const tempF = main.temp;
      const windSpeed = wind.speed;
      const humidity = main.humidity;

      return new Weather('', date, icon, iconDescription, tempF, windSpeed, humidity);
    });
  }

  // Get weather for a city
  public async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchLocationData(city);
    const data = await this.fetchWeatherData(coordinates);

    const currentWeather = this.parseCurrentWeather(data);
    const forecast = this.buildForecastArray(data);

    return [currentWeather, ...forecast];
  }
}

export default new WeatherService();
