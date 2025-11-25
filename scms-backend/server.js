// server.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Vonage } = require('@vonage/server-sdk');

// Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

/* ---------------------- MONGODB CONNECTION ---------------------- */
mongoose
  .connect(
   process.env.MONGODB_URI
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("⚠️  MongoDB Connection Failed:", err.message);
    console.log("\n📝 To fix this issue:");
    console.log("1. Go to MongoDB Atlas (https://cloud.mongodb.com)");
    console.log("2. Navigate to Network Access");
    console.log("3. Add your current IP address or use 0.0.0.0/0 for all IPs (development only)");
    console.log("\n⚡ Server is still running - API endpoints for sensor data and AI are available\n");
  });

/* ---------------------- MONGOOSE SCHEMA ---------------------- */
const farmSchema = new mongoose.Schema(
  {
    farmerName: String,
    farmName: String,
    location: String,
    farmSize: String,
    cropTypes: String,
    livestock: String,
    irrigationType: String,
    soilType: String,
    contactNumber: String,
    email: String,
    additionalNotes: String,
  },
  { timestamps: true }
);

const Farm = mongoose.model("Farm", farmSchema);

/* ---------------------- CRUD ROUTES ---------------------- */

// GET — fetch all farms
app.get("/your-farm", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected. Please check MongoDB Atlas connection." });
    }
    const farms = await Farm.find().sort({ createdAt: -1 });
    res.json(farms);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch farms" });
  }
});

// POST — add new farm
app.post("/your-farm", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected. Please check MongoDB Atlas connection." });
    }
    const farm = await Farm.create(req.body);
    res.json(farm);
  } catch (err) {
    res.status(500).json({ message: "Failed to save farm" });
  }
});

// PUT — update farm
app.put("/your-farm/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected. Please check MongoDB Atlas connection." });
    }
    const updatedFarm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedFarm);
  } catch (err) {
    res.status(500).json({ message: "Failed to update farm" });
  }
});

/* ---------------------- TWILIO SMS ---------------------- */
app.get("/sms", (req, res) => {
  client.messages
    .create({
      body:
        "\n\n⚠️ Water Alert! ⚠️\nField 4 is getting dry 💧\nPlease turn ON the motor 🚜🌱\n\n⚠️ Rain Alert! ⚠️ Heavy rain expected. Do NOT turn on the motor.",
      from: "+18578470441",
      to: "+919003899180",
    })
    .then((message) => {
      console.log("SMS SID:", message.sid);
      res.send("SMS sent!");
    })
    .catch((err) => {
      console.error("Error sending SMS:", err);
      res.status(500).send("Failed to send SMS");
    });
});

/* ---------------------- WHATSAPP MESSAGE (VONAGE) ---------------------- */


app.get("/send", async (req, res) => {
const twilio = require('twilio');

const accountSid = 'AC71d22376b5666a6090b3b584c26efb46';
const authToken = '541a5f9d24194f75e09b0b4d5bb782b9';
const client = twilio(accountSid, authToken);

const body = `
🌿 Weekly Plant Report

Monday
🌱 Growth: 1.2 cm
💧 Soil Moisture: 41.2%
🌡 Temperature: 30.1°C
🐛 Pest Status: No issues
🧪 Fertilizer Used: Yes

Tuesday
🌱 Growth: 1.2 cm
💧 Soil Moisture: 65.1%
🌡 Temperature: 29.1°C
🐛 Pest Status: Mild pest activity
🧪 Fertilizer Used: No

Wednesday
🌱 Growth: 1.3 cm
💧 Soil Moisture: 42.7%
🌡 Temperature: 31.8°C
🐛 Pest Status: No issues
🧪 Fertilizer Used: Yes

Thursday
🌱 Growth: 1.9 cm
💧 Soil Moisture: 69.4%
🌡 Temperature: 24.9°C
🐛 Pest Status: No issues
🧪 Fertilizer Used: Yes

Friday
🌱 Growth: 2.5 cm
💧 Soil Moisture: 59.2%
🌡 Temperature: 29.3°C
🐛 Pest Status: No issues
🧪 Fertilizer Used: No

Saturday
🌱 Growth: 2.8 cm
💧 Soil Moisture: 65.2%
🌡 Temperature: 28.7°C
🐛 Pest Status: No issues
🧪 Fertilizer Used: No

Sunday
🌱 Growth: 3.8 cm
💧 Soil Moisture: 59.2%
🌡 Temperature: 26.9°C
🐛 Pest Status: No issues
🧪 Fertilizer Used: No
`;

client.messages
  .create({
from: 'whatsapp:+14155238886',
to: 'whatsapp:+919003899180',
body: body

  })
  .then(message => console.log(message.sid))
  .catch(error => console.error(error));
});

/* ---------------------- SENSOR DATA ENDPOINT ---------------------- */
// This endpoint would typically receive data from your ESP32 device
let latestSensorData = {
  temperature: 26.5,
  humidity: 65,
  soilMoisture: 42,
  lightLevel: 780,
  timestamp: new Date().toISOString()
};

// Endpoint to receive sensor data from ESP32
app.post("/api/sensor-data", (req, res) => {
  try {
    latestSensorData = {
      ...req.body,
      timestamp: new Date().toISOString()
    };
    console.log("Received sensor data:", latestSensorData);
    res.status(200).json({ message: "Data received successfully", data: latestSensorData });
  } catch (error) {
    console.error("Error processing sensor data:", error);
    res.status(500).json({ message: "Failed to process sensor data" });
  }
});

// Endpoint to get latest sensor data
app.get("/api/sensor-data", (req, res) => {
  try {
    res.status(200).json(latestSensorData);
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    res.status(500).json({ message: "Failed to fetch sensor data" });
  }
});

/* ---------------------- AI CHAT ENDPOINT ---------------------- */
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    
    // Simple AI response (you can integrate with actual AI service later)
    const response = `Based on your question about "${prompt}", I recommend checking soil moisture levels and irrigation schedules regularly for optimal crop health.`;
    
    res.status(200).json({ response });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "AI service unavailable" });
  }
});


/* ---------------------- START SERVER ---------------------- */
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
