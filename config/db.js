const { Sequelize } = require("sequelize");
const CONFIG = require("./config");

// Get current environment: development, production, etc.
const env = process.env.NODE_ENV || "development";
const dbConfig = CONFIG[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port || 3306,
    dialect: dbConfig.dialect || "mysql",
    logging: false,
  }
);

// Test DB connection
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((error) => {
    console.error("❌ Unable to connect to the database:", error);
  });

module.exports = sequelize;
