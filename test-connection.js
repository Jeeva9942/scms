// Simple test script to verify frontend can access backend API
fetch('http://localhost:3001/api/sensor-data')
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));