const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

// "ghana" = a region/city within Ghana (local delivery).
// "international" = a destination outside Ghana (shipping abroad).
const SCOPES = ["ghana", "international"];

class DeliveryZone extends Model {}

DeliveryZone.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Display name shown to customers at checkout, e.g. "Kumasi",
    // "Greater Accra", "Nigeria", "United Kingdom", "Rest of World".
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scope: {
      type: DataTypes.ENUM(...SCOPES),
      allowNull: false,
      defaultValue: "ghana",
    },
    fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    // Lets an admin temporarily hide a zone from checkout without losing
    // its history on past orders.
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Controls display order within its scope group on the checkout dropdown
    // and in the admin list. Lower numbers show first.
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "DeliveryZone",
    tableName: "delivery_zones",
  }
);

DeliveryZone.SCOPES = SCOPES;

module.exports = DeliveryZone;
