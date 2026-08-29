const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

const CATEGORIES = [
  "Skincare",
  "Makeup",
  "Hair Care",
  "Body Care",
  "Fragrance",
  "Bridal Collection",
  "Accessories",
  "Other",
];

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    category: {
      type: DataTypes.ENUM(...CATEGORIES),
      allowNull: false,
      defaultValue: "Other",
    },
    brand: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    // Array of { url, filename } objects pointing at files on the Render disk
    images: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
  }
);

Product.CATEGORIES = CATEGORIES;

module.exports = Product;
