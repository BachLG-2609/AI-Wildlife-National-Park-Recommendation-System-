const { model } = require('../config/gemini');
require('dotenv').config();

async function runTest() {
  console.log('Testing Gemini API connection...');
  console.log('API Key in use:', process.env.GEMINI_API_KEY ? 'CONFIGURED (ends with ' + process.env.GEMINI_API_KEY.slice(-4) + ')' : 'MISSING');
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    console.error('\n[ERROR] Gemini API Key is not set or is still the default placeholder in .env!');
    console.error('Please obtain a key from https://aistudio.google.com/app/apikey and update your .env file.');
    process.exit(1);
  }

  try {
    const prompt = 'Introduce yourself in one sentence and name a famous national park.';
    console.log(`\nSending prompt to Gemini: "${prompt}"`);
    console.log('Waiting for response...\n');
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log('================== GEMINI RESPONSE ==================');
    console.log(responseText.trim());
    console.log('=====================================================');
    console.log('\n[SUCCESS] Gemini API connection verified successfully!');
  } catch (error) {
    console.error('\n[ERROR] Gemini API call failed:');
    console.error(error);
    console.error('\nPlease double check your internet connection and API key permissions.');
  }
}

runTest();
