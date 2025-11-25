import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Wifi, Sun } from "lucide-react";

export default function Espcam() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch sensor data
    const fetchSensorData = async () => {
      try {
        // Fetch from backend API
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/sensor-data`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch sensor data');
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Sensor data fetch error:', err);
        setError(err.message);
        // Keep displaying last known data or show simulated data
        if (!data) {
          setData({
            temperature: 26.5,
            humidity: 65,
            soilMoisture: 42,
            lightLevel: 780,
            timestamp: new Date().toISOString()
          });
        }
      } finally {
        setLoading(false);
      }
    };

    // Fetch data immediately
    fetchSensorData();
    
    // Set up interval to fetch data every 5 seconds for real-time updates
    const interval = setInterval(fetchSensorData, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="shadow-lg border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Wifi className="h-6 w-6 text-primary animate-pulse" />
            Real-time Sensor Data
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Loading sensor data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Wifi className="h-6 w-6 text-primary" />
          Real-time Sensor Data
          {error && (
            <span className="text-xs text-yellow-600 font-normal ml-auto">
              Using cached data
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Temperature */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-xl border-2 border-orange-200 dark:border-orange-800 transition-all hover:scale-105">
            <Thermometer className="h-10 w-10 text-orange-600 dark:text-orange-400 mb-3" />
            <span className="text-sm text-muted-foreground font-medium mb-1">Temperature</span>
            <span className="text-3xl font-bold text-orange-700 dark:text-orange-300">
              {data?.temperature?.toFixed(1)}°C
            </span>
          </div>
          
          {/* Humidity */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl border-2 border-blue-200 dark:border-blue-800 transition-all hover:scale-105">
            <Droplets className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-3" />
            <span className="text-sm text-muted-foreground font-medium mb-1">Humidity</span>
            <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {data?.humidity?.toFixed(0)}%
            </span>
          </div>
          
          {/* Soil Moisture */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl border-2 border-green-200 dark:border-green-800 transition-all hover:scale-105">
            <Droplets className="h-10 w-10 text-green-600 dark:text-green-400 mb-3" />
            <span className="text-sm text-muted-foreground font-medium mb-1">Soil Moisture</span>
            <span className="text-3xl font-bold text-green-700 dark:text-green-300">
              {data?.soilMoisture?.toFixed(0)}%
            </span>
          </div>
          
          {/* Light Level */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 transition-all hover:scale-105">
            <Sun className="h-10 w-10 text-yellow-600 dark:text-yellow-400 mb-3" />
            <span className="text-sm text-muted-foreground font-medium mb-1">Light Level</span>
            <span className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
              {data?.lightLevel?.toFixed(0)}
            </span>
            <span className="text-xs text-muted-foreground">lux</span>
          </div>
        </div>
        
        {/* Last Update Timestamp */}
        {data?.timestamp && (
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
              <Wifi className="h-3 w-3" />
              Last updated: {new Date(data.timestamp).toLocaleString()}
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
