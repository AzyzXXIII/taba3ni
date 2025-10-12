import { useState, useEffect } from "react";
import styled from "styled-components";
import { HiOutlineMapPin, HiOutlineArrowPath } from "react-icons/hi2";

const WeatherContainer = styled.div`
  background: linear-gradient(
    135deg,
    var(--color-blue-600) 0%,
    var(--color-blue-700) 100%
  );
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
  color: white;
  position: relative;
  overflow: hidden;
`;

const WeatherBackground = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  opacity: 0.1;
  font-size: 12rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherContent = styled.div`
  position: relative;
  z-index: 1;
`;

const LocationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.6rem;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.4rem;
  opacity: 0.9;

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const RefreshButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: var(--border-radius-sm);
  padding: 0.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  & svg {
    width: 1.8rem;
    height: 1.8rem;
    color: white;
  }

  &:active svg {
    animation: spin 0.5s linear;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const MainWeather = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const WeatherIcon = styled.div`
  font-size: 6rem;
  line-height: 1;
`;

const Temperature = styled.div`
  & h2 {
    font-size: 5rem;
    font-weight: 700;
    margin: 0;
    line-height: 1;
  }

  & p {
    font-size: 1.6rem;
    margin: 0.4rem 0 0 0;
    opacity: 0.9;
  }
`;

const WeatherDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.6rem;
  padding-top: 1.6rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const DetailItem = styled.div`
  text-align: center;

  & p {
    font-size: 1.2rem;
    opacity: 0.8;
    margin: 0 0 0.4rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  & h4 {
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0;
  }
`;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.8rem;
  margin-top: 1.6rem;
  padding-top: 1.6rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const ForecastDay = styled.div`
  text-align: center;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);

  & p {
    font-size: 1.1rem;
    opacity: 0.8;
    margin: 0 0 0.4rem 0;
    text-transform: uppercase;
  }

  & div {
    font-size: 2rem;
    margin: 0.4rem 0;
  }

  & span {
    font-size: 1.3rem;
    font-weight: 600;
  }
`;

const AlertBanner = styled.div<{ $type: "warning" | "info" }>`
  background: ${(props) =>
    props.$type === "warning"
      ? "rgba(245, 158, 11, 0.2)"
      : "rgba(59, 130, 246, 0.2)"};
  border-left: 3px solid
    ${(props) => (props.$type === "warning" ? "#f59e0b" : "#3b82f6")};
  padding: 1.2rem;
  border-radius: var(--border-radius-sm);
  margin-top: 1.6rem;
  font-size: 1.3rem;

  & strong {
    display: block;
    margin-bottom: 0.4rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  font-size: 1.6rem;
`;

type WeatherData = {
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  icon: string;
  forecast: Array<{
    day: string;
    temp: number;
    icon: string;
  }>;
  alert?: {
    type: "warning" | "info";
    title: string;
    message: string;
  };
};

type WeatherWidgetProps = {
  city?: string;
  country?: string;
};

function WeatherWidget({ city = "Tunis", country = "TN" }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Get weather icon emoji
  const getWeatherIcon = (condition: string): string => {
    const icons: { [key: string]: string } = {
      clear: "☀️",
      sunny: "☀️",
      clouds: "☁️",
      cloudy: "☁️",
      rain: "🌧️",
      drizzle: "🌦️",
      thunderstorm: "⛈️",
      snow: "🌨️",
      mist: "🌫️",
      fog: "🌫️",
    };

    const key = condition.toLowerCase();
    for (const [weatherType, icon] of Object.entries(icons)) {
      if (key.includes(weatherType)) return icon;
    }
    return "🌤️";
  };

  const fetchWeather = async () => {
    setLoading(true);

    try {
      // OpenWeatherMap API with your key
      const API_KEY = "e29cb1a05278e66d8a1390b6576d0eb9";

      // Fetch current weather
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather");
      }

      const data = await response.json();

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&units=metric&appid=${API_KEY}`
      );

      const forecastData = await forecastResponse.json();

      // Process forecast data (get one forecast per day)
      const dailyForecasts = [];
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const processedDates = new Set();

      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toDateString();

        if (!processedDates.has(dateStr) && dailyForecasts.length < 5) {
          processedDates.add(dateStr);
          dailyForecasts.push({
            day: days[date.getDay()],
            temp: item.main.temp,
            icon: getWeatherIcon(item.weather[0].main),
          });
        }
      });

      // Determine if weather is good for deliveries
      let alert = null;
      const condition = data.weather[0].main.toLowerCase();
      const temp = data.main.temp;

      if (condition.includes("rain") || condition.includes("thunderstorm")) {
        alert = {
          type: "warning" as const,
          title: "Rain Expected",
          message: "Prepare delivery vehicles for wet conditions",
        };
      } else if (temp > 35) {
        alert = {
          type: "warning" as const,
          title: "Extreme Heat",
          message: "Ensure refrigeration is functioning properly",
        };
      } else if (temp < 5) {
        alert = {
          type: "info" as const,
          title: "Cold Weather",
          message: "Monitor temperature-sensitive products",
        };
      } else {
        alert = {
          type: "info" as const,
          title: "Perfect Delivery Weather",
          message: "Clear conditions expected",
        };
      }

      const weatherData: WeatherData = {
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        pressure: data.main.pressure,
        icon: getWeatherIcon(data.weather[0].main),
        forecast: dailyForecasts,
        alert: alert,
      };

      setWeather(weatherData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather:", error);

      // mock data if API fails
      const mockWeather: WeatherData = {
        temp: 25,
        feelsLike: 26,
        condition: "Sunny",
        humidity: 65,
        windSpeed: 12,
        pressure: 1013,
        icon: "☀️",
        forecast: [
          { day: "Mon", temp: 25, icon: "☀️" },
          { day: "Tue", temp: 23, icon: "🌤️" },
          { day: "Wed", temp: 22, icon: "☁️" },
          { day: "Thu", temp: 21, icon: "🌧️" },
          { day: "Fri", temp: 24, icon: "☀️" },
        ],
        alert: {
          type: "info",
          title: "Using Demo Data",
          message:
            "Unable to fetch live weather. Check API key or internet connection.",
        },
      };

      setWeather(mockWeather);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [city, country]);

  if (loading) {
    return (
      <WeatherContainer>
        <LoadingSpinner>Loading weather data...</LoadingSpinner>
      </WeatherContainer>
    );
  }

  if (!weather) {
    return (
      <WeatherContainer>
        <WeatherContent>
          <p>Unable to load weather data</p>
        </WeatherContent>
      </WeatherContainer>
    );
  }

  return (
    <WeatherContainer>
      <WeatherBackground>{weather.icon}</WeatherBackground>

      <WeatherContent>
        <LocationHeader>
          <Location>
            <HiOutlineMapPin />
            {city}, {country}
          </Location>
          <RefreshButton onClick={fetchWeather} title="Refresh weather">
            <HiOutlineArrowPath />
          </RefreshButton>
        </LocationHeader>

        <MainWeather>
          <WeatherIcon>{weather.icon}</WeatherIcon>
          <Temperature>
            <h2>{Math.round(weather.temp)}°</h2>
            <p>{weather.condition}</p>
            <p style={{ fontSize: "1.3rem", opacity: 0.7 }}>
              Feels like {Math.round(weather.feelsLike)}°
            </p>
          </Temperature>
        </MainWeather>

        <WeatherDetails>
          <DetailItem>
            <p>Humidity</p>
            <h4>{weather.humidity}%</h4>
          </DetailItem>
          <DetailItem>
            <p>Wind</p>
            <h4>{weather.windSpeed} km/h</h4>
          </DetailItem>
          <DetailItem>
            <p>Pressure</p>
            <h4>{weather.pressure} mb</h4>
          </DetailItem>
        </WeatherDetails>

        <ForecastGrid>
          {weather.forecast.map((day, index) => (
            <ForecastDay key={index}>
              <p>{day.day}</p>
              <div>{day.icon}</div>
              <span>{Math.round(day.temp)}°</span>
            </ForecastDay>
          ))}
        </ForecastGrid>

        {weather.alert && (
          <AlertBanner $type={weather.alert.type}>
            <strong>{weather.alert.title}</strong>
            {weather.alert.message}
          </AlertBanner>
        )}
      </WeatherContent>
    </WeatherContainer>
  );
}

export default WeatherWidget;
