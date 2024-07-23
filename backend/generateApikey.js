const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Generate a UUID
const apiKey = uuidv4();
console.log('Generated API Key:', apiKey);

// Save the API key to a file
fs.writeFileSync('apiKey.txt', apiKey, 'utf8');
console.log('API Key saved to apiKey.txt');
