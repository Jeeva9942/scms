import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Droplet, 
  Thermometer, 
  Activity, 
  Calendar as CalendarIcon, 
  MapPin,
  Power,
  Clock,
  Trash2,
  Plus,
  Leaf,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import fieldACoriander from "@/assets/field-a-coriander.jpg";
import fieldBGreenGram from "@/assets/field-b-greengram.jpg";
import fieldCRice from "@/assets/field-c-rice.jpg";
import fieldDWheat from "@/assets/field-d-wheat.jpg";

interface ScheduledIrrigation {
  id: string;
  date: Date;
  time: string;
}

interface Suggestion {
  type: "warning" | "success" | "info";
  title: string;
  description: string;
}

const FieldDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();

  const [isPumpOn, setIsPumpOn] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("08:00");
  const [scheduledIrrigations, setScheduledIrrigations] = useState<ScheduledIrrigation[]>([]);

  const fieldData: Record<string, any> = {
    a: {
      name: "Field A",
      crop: "Coriander",
      moisture: 72,
      temperature: 26,
      lastIrrigated: "2 hours ago",
      healthStatus: "Healthy",
      irrigationStatus: "Irrigated",
      backgroundImage: fieldACoriander,
      location: "North Section",
      area: "2.5 hectares",
    },
    b: {
      name: "Field B",
      crop: "Green Gram",
      moisture: 68,
      temperature: 28,
      lastIrrigated: "4 hours ago",
      healthStatus: "Healthy",
      irrigationStatus: "Irrigated",
      backgroundImage: fieldBGreenGram,
      location: "East Section",
      area: "3.0 hectares",
    },
    c: {
      name: "Field C",
      crop: "Rice",
      moisture: 55,
      temperature: 25,
      lastIrrigated: "Yesterday",
      healthStatus: "Warning",
      irrigationStatus: "Optimal",
      backgroundImage: fieldCRice,
      location: "South Section",
      area: "4.5 hectares",
    },
    d: {
      name: "Field D",
      crop: "Wheat",
      moisture: 32,
      temperature: 24,
      lastIrrigated: "3 days ago",
      healthStatus: "Critical",
      irrigationStatus: "Dry",
      backgroundImage: fieldDWheat,
      location: "West Section",
      area: "3.5 hectares",
    },
  };

  const field = fieldData[id || "a"];

  const statusColor = {
    Irrigated: "bg-success text-success-foreground",
    Optimal: "bg-warning text-warning-foreground",
    Dry: "bg-destructive text-destructive-foreground",
  }[field.irrigationStatus];

  const healthColor = {
    Healthy: "text-success",
    Warning: "text-warning",
    Critical: "text-destructive",
  }[field.healthStatus];

  const handlePumpToggle = (checked: boolean) => {
    setIsPumpOn(checked);
    toast.success(checked ? `Pump turned ON for ${field.name}` : `Pump turned OFF for ${field.name}`);
  };

  const handleSchedule = () => {
    if (!selectedDate) return toast.error("Please select a date");

    const newSchedule: ScheduledIrrigation = {
      id: Date.now().toString(),
      date: selectedDate,
      time: selectedTime,
    };

    setScheduledIrrigations([...scheduledIrrigations, newSchedule]);
    toast.success(`Irrigation scheduled for ${format(selectedDate, "PPP")} at ${selectedTime}`);
    
    setOpen(false);
    setSelectedDate(undefined);
    setSelectedTime("08:00");
  };

  const handleDelete = (id: string) => {
    setScheduledIrrigations(scheduledIrrigations.filter(item => item.id !== id));
    toast.success("Schedule removed");
  };

  const fertilizers = [
    { name: "Nitrogen (N)", current: 65, optimal: 80, unit: "kg/ha", status: "low" },
    { name: "Phosphorus (P)", current: 85, optimal: 90, unit: "kg/ha", status: "good" },
    { name: "Potassium (K)", current: 45, optimal: 70, unit: "kg/ha", status: "low" },
  ];

  const getStatusColor = (status: string) => (status === "good" ? "bg-success" : "bg-warning");

  const getSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    if (field.moisture < 40) {
      suggestions.push({
        type: "warning",
        title: "Immediate Irrigation Required",
        description: `${field.crop} requires immediate watering. Low moisture levels can affect crop yield.`,
      });
    } else if (field.moisture < 60) {
      suggestions.push({
        type: "info",
        title: "Schedule Irrigation Soon",
        description: `Moisture levels are adequate but consider scheduling irrigation within 24 hours.`,
      });
    } else {
      suggestions.push({
        type: "success",
        title: "Optimal Moisture Level",
        description: `${field.crop} is receiving adequate water. Continue current irrigation schedule.`,
      });
    }

    suggestions.push(
      {
        type: "info",
        title: "Weather Forecast Integration",
        description: "Light rain expected in 2 days. Consider adjusting irrigation schedule accordingly.",
      },
      {
        type: "success",
        title: "Crop Health Monitoring",
        description: "All vital parameters are within optimal range. No immediate action required.",
      }
    );

    return suggestions;
  };

  const suggestions = getSuggestions();

  const getIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="w-5 h-5 text-warning" />;
      case "success": return <CheckCircle className="w-5 h-5 text-success" />;
      default: return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "warning": return "destructive";
      case "success": return "default";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* HERO */}
      <div className="relative h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${field.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-between py-8">
          <Link to="/dashboard">
            <Button variant="secondary" size="sm" className="w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t.backToDashboard}
            </Button>
          </Link>

          <div className="text-white">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-5xl font-bold drop-shadow-lg">{field.name}</h1>
              <Badge className={statusColor}>{field.irrigationStatus}</Badge>
            </div>
            <div className="flex items-center gap-6 text-lg">
              <span className="font-semibold">{field.crop}</span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {field.location}
              </span>
              <span>{field.area}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="container mx-auto px-4 py-8">

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-l-4 border-l-primary">
            <p className="text-sm text-muted-foreground mb-1">{t.moistureLevel}</p>
            <p className="text-3xl font-bold">{field.moisture}%</p>
            <Droplet className="w-10 h-10 text-primary ml-auto" />
          </Card>

          <Card className="p-6 border-l-4 border-l-warning">
            <p className="text-sm text-muted-foreground mb-1">{t.temperature}</p>
            <p className="text-3xl font-bold">{field.temperature}°C</p>
            <Thermometer className="w-10 h-10 text-warning ml-auto" />
          </Card>

          <Card className="p-6 border-l-4 border-l-success">
            <p className="text-sm text-muted-foreground mb-1">{t.healthStatus}</p>
            <p className={`text-2xl font-bold ${healthColor}`}>{field.healthStatus}</p>
            <Activity className="w-10 h-10 text-success ml-auto" />
          </Card>

          <Card className="p-6 border-l-4 border-l-accent">
            <p className="text-sm text-muted-foreground mb-1">{t.lastIrrigated}</p>
            <p className="text-xl font-bold">{field.lastIrrigated}</p>
            <CalendarIcon className="w-10 h-10 text-accent ml-auto" />
          </Card>
        </div>

        {/* PUMP CONTROL (UPDATED GREEN/RED) */}
        <div className="mb-8">
          <div
            className={`rounded-xl p-6 border shadow-sm transition-all ${
              isPumpOn
                ? "bg-green-50 border-green-400"
                : "bg-red-50 border-red-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-full ${
                    isPumpOn ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  <Power
                    className={`w-6 h-6 ${
                      isPumpOn ? "text-green-700" : "text-red-700"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t.pumpControl}</h3>
                  <p className="text-sm">
                    {t.status}:{" "}
                    <span
                      className={`font-semibold ${
                        isPumpOn ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {isPumpOn ? t.running : t.off}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span>OFF</span>
                <Switch
                  checked={isPumpOn}
                  onCheckedChange={handlePumpToggle}
                  className="data-[state=checked]:bg-green-600"
                />
                <span>ON</span>
              </div>
            </div>
          </div>
        </div>

        {/* SCHEDULE IRRIGATION */}
        <div className="mb-8">
          <div className="space-y-6">

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white">
                  <CalendarIcon className="w-5 h-5 mr-2" /> {t.scheduleIrrigation}
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px] bg-card">
                <DialogHeader>
                  <DialogTitle>{t.scheduleFor} {field.name}</DialogTitle>
                  <DialogDescription>
                    {t.scheduleDesc}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  
                  {/* DATE PICKER */}
                  <div className="space-y-2">
                    <Label>{t.selectDate}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : t.pickDate}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="p-0 bg-card" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(d) => d < new Date()}
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* TIME PICKER */}
                  <div className="space-y-2">
                    <Label>{t.selectTime}</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSchedule} className="w-full bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" /> {t.addSchedule}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* ✔ SHOW SELECTED DATE BELOW */}
            {selectedDate && (
              <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
                <p className="font-semibold text-green-800 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  {t.selectDate}: {format(selectedDate, "PPP")}
                </p>
                <p className="text-green-700 mt-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t.selectTime}: {selectedTime}
                </p>
              </div>
            )}

            {/* LIST OF SCHEDULES */}
            {scheduledIrrigations.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{t.scheduledIrrigations}</h3>
                  <Badge variant="outline" className="text-green-700 border-green-700">
                    {scheduledIrrigations.length} {t.scheduledLabel}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {scheduledIrrigations.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <CalendarIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {format(schedule.date, "EEEE, MMMM d, yyyy")}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {schedule.time}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(schedule.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* FERTILIZER PANEL */}
          <div className="p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-success/20 rounded-full">
                  <Leaf className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t.fertilizerRequirements}</h3>
                  <p className="text-sm text-muted-foreground">{t.optimizedFor} {field.crop}</p>
                </div>
              </div>
              <Badge variant="outline" className="border-success text-success">
                <TrendingUp className="w-3 h-3 mr-1" /> {t.updated}
              </Badge>
            </div>

            <div className="space-y-5">
              {fertilizers.map((fertilizer, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{fertilizer.name}</span>
                    <span className="text-muted-foreground">
                      {fertilizer.current}/{fertilizer.optimal} {fertilizer.unit}
                    </span>
                  </div>

                  <Progress
                    value={(fertilizer.current / fertilizer.optimal) * 100}
                    className={`h-2 ${getStatusColor(fertilizer.status)}`}
                  />

                  <p className="text-xs text-muted-foreground">
                    {fertilizer.status === "good"
                      ? "Optimal level maintained"
                      : `Add ${fertilizer.optimal - fertilizer.current} ${fertilizer.unit} recommended`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SMART SUGGESTIONS */}
          <div className="p-6 rounded-xl border shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-primary/20 rounded-full">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t.smartSuggestions}</h3>
                <p className="text-sm text-muted-foreground">{t.aiRecommendations}</p>
              </div>
            </div>

            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="p-4 border-l-4 border-l-primary hover:shadow-md">
                  <div className="flex items-start space-x-3">
                    <div>{getIcon(suggestion.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                        <Badge variant={getBadgeVariant(suggestion.type) as any} className="text-xs">
                          {suggestion.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default FieldDetail;
