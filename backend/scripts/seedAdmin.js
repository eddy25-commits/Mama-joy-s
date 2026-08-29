// Run with: npm run seed:admin
// Reads ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD from your .env file
require("dotenv").config();
const { sequelize } = require("../config/db");
const Admin = require("../models/Admin");

const run = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Please set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in your .env file first.");
    process.exit(1);
  }

  // Ensure the admins table exists (safe no-op if it's already there)
  await sequelize.sync();

  const existing = await Admin.findOne({ where: { email: ADMIN_EMAIL.toLowerCase() } });
  if (existing) {
    console.log(`Admin with email ${ADMIN_EMAIL} already exists. No changes made.`);
    process.exit(0);
  }

  const admin = await Admin.create({
    name: ADMIN_NAME || "Mama Joy",
    email: ADMIN_EMAIL.toLowerCase(),
    password: ADMIN_PASSWORD,
  });

  console.log(`Admin account created for ${admin.email}. You can now log in on /admin/login.`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
