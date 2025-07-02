const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config(); // Secret key holder
const app = express(); // instance of the express server

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// DB Connection
// Connect to MongoDB, then start server
connectDB().then(() => {
  app.listen(process.env.PORT || 6000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
