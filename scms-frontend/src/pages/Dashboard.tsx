import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Thermometer, Wind, Activity ,CloudRain,Waves} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { desmakai } from "../ai/desmak.js";
import Chatbot from "@/components/ui/chatbot.tsx";
import FieldDashboard from "@/components/ui/FieldDashboard.tsx";
import  Mantoauto  from "@/pages/mantoauto.tsx";
import Mobsms from "@/sms/mobsms.tsx";
import WeatherWidget from "@/pages/WeatherWidget.tsx";
import Espcam from "@/pages/espcam.jsx";



const sensorData = [
  { id: 1, lat: 28.6, lng: 77.2, moisture: 65, temp: 28, status: "good" },
  { id: 2, lat: 28.62, lng: 77.18, moisture: 45, temp: 30, status: "warning" },
  { id: 3, lat: 28.58, lng: 77.22, moisture: 75, temp: 26, status: "excellent" },
  { id: 4, lat: 28.61, lng: 77.21, moisture: 35, temp: 32, status: "critical" },

];



const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent":
      return "bg-growth/20 border-growth";
    case "good":
      return "bg-primary/20 border-primary";
    case "warning":
      return "bg-harvest/20 border-harvest";
    case "critical":
      return "bg-destructive/20 border-destructive";
    default:
      return "bg-muted";
  }
};



const Dashboard = () => {
  const [inputValue, setInputValue] = useState('');
  const { t } = useLanguage();
  const avgMoisture = Math.round(
    sensorData.reduce((acc, sensor) => acc + sensor.moisture, 0) / sensorData.length
  );
  const avgTemp = Math.round(
    sensorData.reduce((acc, sensor) => acc + sensor.temp, 0) / sensorData.length
  );
 const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    const res=await desmakai(inputValue);
    if(res){
    console.log(res); 
    }
    console.log("no res")
    // You can add your API call or logic here
    setInputValue(''); // clear input after submit
  };



  return (
    <div className="min-h-screen bg-gradient-hero pt-24">
      <Mantoauto mode={undefined} onChange={undefined} />
      <WeatherWidget />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t.farmDashboard}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t.farmDashboardDesc}
          </p>
          <p className="text-muted-foreground text-lg">
           
          </p>
        </div>
       
        {/* Espcam Component */}
        <div className="mb-8">
          <Espcam />
        </div>
        
        {/* Stats Overview */}
      {/* Sensor Stats - Single Row */}
<div className="flex flex-wrap md:flex-nowrap justify-between gap-6 mb-8 overflow-x-auto">
  <Card className="shadow-soft flex-1 min-w-[220px]">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{t.avgMoisture}</CardTitle>
      <Droplets className="h-4 w-4 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-primary">{avgMoisture}%</div>
      <p className="text-xs text-muted-foreground">{t.optimalRange}</p>
    </CardContent>
  </Card>

  <Card className="shadow-soft flex-1 min-w-[220px]">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{t.avgTemperature}</CardTitle>
      <Thermometer className="h-4 w-4 text-harvest" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-harvest">{avgTemp}°C</div>
      <p className="text-xs text-muted-foreground">{t.currentConditions}</p>
    </CardContent>
  </Card>

  
<Card className="shadow-soft flex-1 min-w-[220px]">
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">{t.rainDropSensor}</CardTitle>
    <CloudRain className="h-4 w-4 text-primary" />
  </CardHeader>

  <CardContent>
    <div className="text-2xl font-bold text-primary">
      {t.rainDropSensorno}
    </div>
    <p className="text-xs text-muted-foreground">{t.raincurrentconditions}</p>
  </CardContent>
</Card>


<Card className="shadow-soft flex-1 min-w-[220px]">
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">{t.waterLevelStatus}</CardTitle>
    <Waves className="h-5 w-5 text-harvest" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-harvest">70%</div>
    <p className="text-xs text-muted-foreground">{t.currentWaterLevel}</p>
  </CardContent>
</Card>

  <Card className="shadow-soft flex-1 min-w-[220px]">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{t.alerts}</CardTitle>
      <Wind className="h-4 w-4 text-destructive" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-destructive">
    3
      </div>
      <p className="text-xs text-muted-foreground">{t.needsAttention}</p>
    </CardContent>
  </Card>
  
</div>

{/* Field Dashboard Below */}
<div className="mt-8">
  <FieldDashboard />
</div>

       
</div>
      
    <Chatbot />
    </div>
  );
};

export default Dashboard;
