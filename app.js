const express = require('express');
require('dotenv').config();

const parkRoutes = require('./routes/parkRoutes');

const app = express();

app.use(express.json());

app.use('/api/parks', parkRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});