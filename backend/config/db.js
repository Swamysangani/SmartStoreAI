const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Explicitly set network lookup handlers
    require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Error out quickly instead of hanging forever
    });
    
    console.log(`MongoDB Connected Safely: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Failure: ${error.message}`);
    // Keep the server up even if network drops temporarily
  }
};

module.exports = connectDB;