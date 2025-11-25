@echo off
echo Setting up SCMS development environment...

echo Installing frontend dependencies...
cd scms-frontend
npm install

echo Installing backend dependencies...
cd ../scms-backend
npm install

echo.
echo Setup complete!
echo.
echo To start the development servers:
echo 1. Open a terminal and run: cd scms-backend ^& npm start
echo 2. Open another terminal and run: cd scms-frontend ^& npm run dev
echo.
echo The frontend will be available at http://localhost:3000
echo The backend API will be available at http://localhost:3001