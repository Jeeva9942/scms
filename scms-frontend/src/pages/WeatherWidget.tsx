import { useState } from "react";
import {
  CloudSun,
  Droplets,
  CloudRain,
  CalendarDays,
  X,
} from "lucide-react";

export default function WeatherWidget() {
  const [showWidget, setShowWidget] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("No location yet.");
  const [loading, setLoading] = useState(false);
  const [openDetail, setOpenDetail] = useState(null);

  const [weather, setWeather] = useState({
    place: "",
    coords: "",
    cond: "",
    code: "",
    humNow: "",
    humMean: "",
    rainToday: "",
    rainWeek: "",
    rainMonth: "",
  });

  const WMO = [
    { codes: [0], label: "Sunny/Clear" },
    { codes: [1, 2], label: "Partly cloudy" },
    { codes: [3], label: "Overcast" },
    { codes: [45, 48], label: "Fog" },
    { codes: [51, 53, 55, 56, 57], label: "Drizzle" },
    { codes: [61, 63, 65, 66, 67], label: "Rain" },
    { codes: [80, 81, 82], label: "Rain showers" },
    { codes: [95, 96, 99], label: "Thunderstorm" },
  ];

  const wmoLabel = (c) =>
    WMO.find((g) => g.codes.includes(c))?.label || `Code ${c}`;

  const fetchJson = async (url) => {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  };

  const geocodePIN = async (pin) => {
    const q = new URL("https://nominatim.openstreetmap.org/search");
    q.searchParams.set("postalcode", pin);
    q.searchParams.set("country", "India");
    q.searchParams.set("format", "jsonv2");
    q.searchParams.set("limit", "1");
    const arr = await fetchJson(q);

    if (!arr.length) throw new Error(`Could not find PIN ${pin}`);

    return {
      lat: +arr[0].lat,
      lon: +arr[0].lon,
      display: arr[0].display_name,
    };
  };

  const getForecast = async (lat, lon, display) => {
    const daily = ["rain_sum", "relative_humidity_2m_mean", "weathercode"].join(",");
    const current = ["weather_code", "relative_humidity_2m", "precipitation", "rain"].join(",");

    const fUrl = new URL("https://api.open-meteo.com/v1/forecast");
    fUrl.searchParams.set("latitude", lat);
    fUrl.searchParams.set("longitude", lon);
    fUrl.searchParams.set("timezone", "auto");
    fUrl.searchParams.set("forecast_days", "16");
    fUrl.searchParams.set("daily", daily);
    fUrl.searchParams.set("current", current);

    const data = await fetchJson(fUrl);

    const t = data.daily.time || [];
    const rain = data.daily.rain_sum || [];
    const hum = data.daily.relative_humidity_2m_mean || [];
    const unit = data.daily_units?.rain_sum || "mm";

    const sum = (arr) => arr.reduce((x, y) => x + (+y || 0), 0);

    const week = sum(rain.slice(0, 7));
    const today = rain[0] ?? null;

    let month = null;
    if (t[0]) {
      const ym = t[0].slice(0, 7);
      month = sum(
        t.map((v, i) => (v.startsWith(ym) ? (+rain[i] || 0) : 0))
      );
    }

    const code = data.current?.weather_code;
    const nowHum = data.current?.relative_humidity_2m;

    setWeather({
      place: display,
      coords: `Lat ${lat.toFixed(3)}, Lon ${lon.toFixed(3)}`,
      cond: wmoLabel(+code || 0),
      code: code ?? "--",
      humNow: nowHum != null ? `${Math.round(nowHum)}%` : "—",
      humMean: hum[0] != null ? `${Math.round(hum[0])}%` : "—",
      rainToday: today != null ? `${today.toFixed(1)} ${unit}` : "—",
      rainWeek: `${week.toFixed(1)} ${unit}`,
      rainMonth: month != null ? `${month.toFixed(1)} ${unit}` : "—",
    });

    setOpenDetail(null);
    setStatus("Done.");
  };

  const handlePin = async (e) => {
    e.preventDefault();
    setError("");
    setOpenDetail(null);

    if (!/^\d{6}$/.test(pin)) {
      setError("Enter a valid 6-digit PIN.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Finding location…");

      const g = await geocodePIN(pin);
      setStatus("Fetching weather…");
      await getForecast(g.lat, g.lon, g.display);

    } catch (err) {
      setError(err.message);
      setStatus("Error.");
    } finally {
      setLoading(false);
    }
  };

  const handleGPS = () => {
    setError("");
    setOpenDetail(null);

    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    setLoading(true);
    setStatus("Getting location…");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        setStatus("Fetching weather…");
        await getForecast(latitude, longitude, "Your Current Location");

      } catch (err) {
        setError(err.message);
        setStatus("Error.");
      } finally {
        setLoading(false);
      }
    });
  };

  const closeWidget = () => {
    setShowWidget(false);
    setOpenDetail(null);
    setWeather({
      place: "",
      coords: "",
      cond: "",
      code: "",
      humNow: "",
      humMean: "",
      rainToday: "",
      rainWeek: "",
      rainMonth: "",
    });
    setPin("");
    setError("");
    setStatus("No location yet.");
  };

  return (
    <div className="w-full flex flex-col items-end p-6 mt-10">

      {/* FIRST BUTTON */}
      {!showWidget && (
        <button
          onClick={() => setShowWidget(true)}
          className="bg-green-400 hover:bg-green-500 text-green-900 font-semibold px-6 py-3 rounded-xl shadow-md flex items-center gap-2"
        >
          <CloudSun size={22} /> Get Weather
        </button>
      )}

      {/* MAIN WIDGET */}
      {showWidget && (
        <div className="relative w-full max-w-md mt-4 bg-green-100 border border-green-300 rounded-xl p-5 shadow-lg text-green-900">

          {/* CLOSE BUTTON */}
          <button
            onClick={closeWidget}
            className="absolute top-3 right-3 bg-green-300 hover:bg-green-400 text-green-900 p-1 rounded-full shadow"
          >
            <X size={18} />
          </button>

          <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <CloudSun size={24} /> Weather by PIN or GPS
          </h2>

          {/* FORM */}
          <form onSubmit={handlePin} className="flex gap-2 mb-3">
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              className="flex-1 bg-green-200 border border-green-400 rounded-lg px-3 py-2"
              placeholder="Enter PIN"
            />
            <button className="bg-green-400 hover:bg-green-500 border border-green-400 rounded-lg px-4 py-2">
              {loading ? "..." : "Get"}
            </button>
            <button
              type="button"
              onClick={handleGPS}
              className="bg-green-400 hover:bg-green-500 border border-green-400 rounded-lg px-4 py-2"
            >
              GPS
            </button>
          </form>

          <div className="text-sm text-green-700">{status}</div>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

          {/* SUMMARY */}
          {weather.place && (
            <div className="mt-4 p-4 bg-green-200 border border-green-300 rounded-xl">

              <div className="text-sm text-green-700">Location</div>
              <div className="text-lg font-semibold">{weather.place}</div>
              <div className="text-sm mt-1">{weather.coords}</div>

              {/* ICON BAR */}
              <div className="flex mt-4 justify-center gap-8">
                <IconButton
                  label="Condition"
                  icon={<CloudSun size={28} />}
                  active={openDetail === "cond"}
                  onClick={() => setOpenDetail(openDetail === "cond" ? null : "cond")}
                />
                <IconButton
                  label="Humidity"
                  icon={<Droplets size={28} />}
                  active={openDetail === "hum"}
                  onClick={() => setOpenDetail(openDetail === "hum" ? null : "hum")}
                />
                <IconButton
                  label="Today"
                  icon={<CloudRain size={28} />}
                  active={openDetail === "today"}
                  onClick={() => setOpenDetail(openDetail === "today" ? null : "today")}
                />
                <IconButton
                  label="7-Day"
                  icon={<CalendarDays size={28} />}
                  active={openDetail === "week"}
                  onClick={() => setOpenDetail(openDetail === "week" ? null : "week")}
                />
              </div>
            </div>
          )}

          {/* DETAILS */}
          {openDetail === "cond" && (
            <Detail icon={<CloudSun />} label="Condition" value={weather.cond} />
          )}
          {openDetail === "hum" && (
            <Detail
              icon={<Droplets />}
              label="Humidity"
              value={`${weather.humNow} (Mean ${weather.humMean})`}
            />
          )}
          {openDetail === "today" && (
            <Detail icon={<CloudRain />} label="Rain Today" value={weather.rainToday} />
          )}
          {openDetail === "week" && (
            <Detail icon={<CalendarDays />} label="Rain Next 7 Days" value={weather.rainWeek} />
          )}
        </div>
      )}
    </div>
  );
}

/* ICON BUTTON */
function IconButton({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex flex-col items-center px-3 py-1 rounded-lg 
      ${active ? "bg-green-300 text-green-900" : "text-green-700 hover:text-green-900"}`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
}

/* DETAIL CARD */
function Detail({ icon, label, value }) {
  return (
    <div className="mt-4 p-4 bg-green-200 border border-green-300 rounded-xl flex gap-3 items-center">
      <div className="text-green-700">{icon}</div>
      <div>
        <div className="text-sm text-green-700">{label}</div>
        <div className="text-xl font-semibold text-green-900">{value}</div>
      </div>
    </div>
  );
}
