const { Sequelize } = require("sequelize");

// Render's managed Postgres requires SSL; local Postgres usually doesn't.
// DB_SSL=true (set this on Render) turns SSL on with a relaxed cert check,
// which is the standard approach for Render's managed Postgres.
const useSSL = process.env.DB_SSL === "true";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: useSSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.error(`Error connecting to PostgreSQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
