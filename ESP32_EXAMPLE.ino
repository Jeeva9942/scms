// ESP32 Example Code for SCMS
// This is a simplified example of how to send sensor data to the SCMS backend

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API endpoint
const char* serverName = "http://your-backend-url.vercel.app/api/sensor-data";

// Timer variables
unsigned long lastTime = 0;
unsigned long timerDelay = 5000; // Send data every 5 seconds

// Sensor simulation (replace with actual sensor readings)
float temperature = 25.0;
float humidity = 60.0;
float soilMoisture = 45.0;
float lightLevel = 800.0;

void setup() {
  Serial.begin(115200);
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Send data every 5 seconds
  if ((millis() - lastTime) > timerDelay) {
    // Simulate sensor readings (replace with actual sensor code)
    temperature += random(-10, 10) / 10.0;
    humidity += random(-5, 5) / 10.0;
    soilMoisture += random(-3, 3) / 10.0;
    lightLevel += random(-50, 50);
    
    // Check WiFi connection status
    if(WiFi.status() == WL_CONNECTED){
      HTTPClient http;
      
      // Your Domain name with URL path or IP address with path
      http.begin(serverName);
      
      // Specify content-type header
      http.addHeader("Content-Type", "application/json");
      
      // Prepare JSON document
      DynamicJsonDocument doc(200);
      doc["temperature"] = temperature;
      doc["humidity"] = humidity;
      doc["soilMoisture"] = soilMoisture;
      doc["lightLevel"] = lightLevel;
      
      String httpRequestData;
      serializeJson(doc, httpRequestData);
      
      // Send HTTP POST request
      int httpResponseCode = http.POST(httpRequestData);
      
      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}