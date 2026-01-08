import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, CloudLightning, Sun, Wind, CloudSnow } from 'lucide-react';
import { f1Api as api } from '../services/api';

interface WeatherData {
    latitude: number;
    longitude: number;
    current_weather: {
        temperature: number;
        windspeed: number;
        winddirection: number;
        weathercode: number;
        is_day: number;
        time: string;
    };
}

interface WeatherCardProps {
    raceId?: string;
    lat?: number;
    lon?: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ raceId, lat, lon }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                let data: WeatherData | undefined;
                if (raceId) {
                    // Ideally we would have an endpoint for raceId
                    // But for now let's assume we use coordinates if passed, or maybe fetch by ID if implemented
                    // Based on backend, we implemented /weather/{raceId}
                    data = await api.get<WeatherData>(`/weather/${raceId}`);
                } else if (lat && lon) {
                    data = await api.get<WeatherData>(`/weather/coordinates?lat=${lat}&lon=${lon}`);
                }
                setWeather(data || null); // Ensure data is WeatherData or null
                setError(null);
            } catch (err) {
                console.error("Failed to fetch weather", err);
                setError("Weather data unavailable");
            } finally {
                setLoading(false);
            }
        };

        if (raceId || (lat && lon)) {
            fetchWeather();
        }
    }, [raceId, lat, lon]);

    if (loading) return <div className="animate-pulse h-24 bg-white/5 rounded-lg w-full"></div>;
    if (error || !weather) return null;

    const { current_weather } = weather;

    const getWeatherIcon = (code: number) => {
        // WMO Weather interpretation codes (WW)
        if (code === 0) return <Sun className="text-yellow-400" />;
        if (code >= 1 && code <= 3) return <Cloud className="text-gray-400" />;
        if (code >= 45 && code <= 48) return <Cloud className="text-gray-500" />;
        if (code >= 51 && code <= 67) return <CloudRain className="text-blue-400" />;
        if (code >= 71 && code <= 77) return <CloudSnow className="text-white" />;
        if (code >= 80 && code <= 82) return <CloudRain className="text-blue-500" />;
        if (code >= 85 && code <= 86) return <CloudSnow className="text-white" />;
        if (code >= 95 && code <= 99) return <CloudLightning className="text-yellow-500" />;
        return <Sun className="text-yellow-400" />;
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                    {getWeatherIcon(current_weather.weathercode)}
                </div>
                <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Current Weather</div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-white">{current_weather.temperature}</span>
                        <span className="text-sm text-gray-400">°C</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 items-end">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Wind className="w-4 h-4 text-gray-500" />
                    <span>{current_weather.windspeed} km/h</span>
                </div>
                {/* Open-Meteo doesn't give humidity in current_weather by default simple calls, 
                     but we could add it if we requested hourly. For now, let's stick to wind. 
                 */}
            </div>
        </div>
    );
};

export default WeatherCard;
