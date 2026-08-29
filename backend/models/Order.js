const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // { name, email, phone, address, city, notes }
    customer: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    // [{ productId, name, price, quantity, image }]
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deliveryFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    // Snapshot of the delivery zone selected at checkout. Stored as its own
    // columns (rather than just a foreign key) so the order's history stays
    // accurate even if an admin later renames, re-prices, or deletes the zone.
    deliveryZoneId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deliveryZoneName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paystackReference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      defaultValue: "pending",
    },
    orderStatus: {
      type: DataTypes.ENUM("pending", "processing", "shipped", "completed", "cancelled"),
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
  }
);

module.exports = Order;
