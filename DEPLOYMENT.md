# Deployment Guide for SCMS

This guide explains how to deploy both the frontend and backend of the SCMS application to Vercel.

## Prerequisites

1. Vercel account
2. MongoDB Atlas account (for database)
3. Twilio account (for SMS functionality)

## Environment Variables

### Frontend (.env file)
```
VITE_API_URL=http://localhost:3001
VITE_TWILIO_ACCOUNT_SID=your_twilio_account_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token
VITE_TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Backend (.env file)
```
PORT=3001
MONGODB_URI=your_mongodb_connection_string
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
```

## Deployment Steps

### 1. Backend Deployment

1. Navigate to the `scms-backend` directory
2. Create a new project in Vercel
3. Connect your Git repository or upload the files
4. Set the environment variables in Vercel dashboard
5. Configure the build settings:
   - Build Command: `npm install`
   - Output Directory: `.` (root)
   - Install Command: `npm install`

### 2. Frontend Deployment

1. Navigate to the `scms-frontend` directory
2. Create a new project in Vercel
3. Connect your Git repository or upload the files
4. Set the environment variables in Vercel dashboard
5. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## API Integration

The frontend will automatically proxy API requests to the backend during development. In production, make sure to set the `VITE_API_URL` to your backend's URL.

## ESP32 Integration

To connect your ESP32 device to the system:

1. Program your ESP32 to send HTTP POST requests to `/api/sensor-data` endpoint
2. Send JSON data in the following format:
   ```json
   {
     "temperature": 25.6,
     "humidity": 60,
     "soilMoisture": 45,
     "lightLevel": 800
   }
   ```

3. The system will automatically display this real-time data on the dashboard.

## Troubleshooting

1. If you encounter CORS issues, make sure the backend has the proper CORS configuration
2. If environment variables are not loading, check that they are correctly set in the Vercel dashboard
3. For database connection issues, verify your MongoDB connection string

## Support

For any deployment issues, please contact the development team.