const mongoose = require('mongoose');
const ensureAdminUser = require('./ensureAdminUser');

module.exports = {
  connect: async () => {
    try {
      await mongoose.connect(process.env.DB_URL);
      console.log('connected to db');

      await ensureAdminUser();
    } catch (error) {
      console.error('Database connection/bootstrap failed:', error.message);
      throw error;
    }
  }
};
