require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize, connectDB } = require("./config/db");
const { UPLOAD_DIR } = require("./middleware/upload");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const deliveryZoneRoutes = require("./routes/deliveryZoneRoutes");

const app = express();

// Render sits behind a proxy; trusting it lets req.protocol / x-forwarded-proto
// resolve correctly so uploaded image URLs are built with https.
app.set("trust proxy", 1);

// CORS - allow the deployed frontend (Vercel) and local dev
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// The Paystack webhook needs the raw request body to verify the signature,
// so it must be mounted BEFORE the global JSON body parser below.
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded product images. UPLOAD_DIR points at the Render persistent
// disk's mount path in production (see render.yaml), or a local folder in dev.
app.use("/uploads", express.static(UPLOAD_DIR));

app.get("/", (req, res) => {
  res.json({ message: "Mama Joy's Cosmetics and Collections API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/delivery-zones", deliveryZoneRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  // Creates/updates tables to match the models above. Fine for a small
  // single-instance site like this one; for larger projects you'd normally
  // switch to versioned Sequelize migrations instead.
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
