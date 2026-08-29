const express = require("express");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { filesToImageRecords, deleteUploadedFile } = require("../utils/fileStorage");

const router = express.Router();

const serializeProduct = (product) => {
  const data = product && typeof product.toJSON === "function" ? product.toJSON() : { ...product };
  if (data && data.id !== undefined && data._id === undefined) {
    data._id = data.id;
  }
  return data;
};

// @route   GET /api/products
// @desc    Get all active products (public) - supports ?category=&search=&featured=true
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { category, search, featured } = req.query;
    const where = { isActive: true };

    if (category && category !== "All") where.category = category;
    if (featured === "true") where.isFeatured = true;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const products = await Product.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json(products.map(serializeProduct));
  })
);

// @route   GET /api/products/admin/all
// @desc    Get ALL products including inactive ones (admin only)
router.get(
  "/admin/all",
  protect,
  asyncHandler(async (req, res) => {
    const products = await Product.findAll({ order: [["createdAt", "DESC"]] });
    res.json(products.map(serializeProduct));
  })
);

// @route   GET /api/products/:id
// @desc    Get single product
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(serializeProduct(product));
  })
);

// @route   POST /api/products
// @desc    Create a product (admin only), up to 5 images
router.post(
  "/",
  protect,
  upload.array("images", 5),
  asyncHandler(async (req, res) => {
    const { name, description, price, category, brand, stock, isFeatured } = req.body;

    if (!name || !description || !price || !category) {
      res.status(400);
      throw new Error("Please provide name, description, price, and category");
    }

    const images = filesToImageRecords(req, req.files);

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      brand: brand || "",
      stock: Number(stock) || 0,
      isFeatured: isFeatured === "true" || isFeatured === true,
      images,
    });

    res.status(201).json(serializeProduct(product));
  })
);

// @route   PUT /api/products/:id
// @desc    Update a product (admin only), optionally add/remove images
router.put(
  "/:id",
  protect,
  upload.array("images", 5),
  asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const { name, description, price, category, brand, stock, isFeatured, isActive, removeImageIds } =
      req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (stock !== undefined) product.stock = Number(stock);
    if (isFeatured !== undefined) product.isFeatured = isFeatured === "true" || isFeatured === true;
    if (isActive !== undefined) product.isActive = isActive === "true" || isActive === true;

    // Remove selected images from disk + row (removeImageIds holds filenames)
    let currentImages = product.images || [];
    if (removeImageIds) {
      const filenamesToRemove = Array.isArray(removeImageIds) ? removeImageIds : [removeImageIds];
      filenamesToRemove.forEach(deleteUploadedFile);
      currentImages = currentImages.filter((img) => !filenamesToRemove.includes(img.filename));
    }

    // Add newly uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = filesToImageRecords(req, req.files);
      currentImages = [...currentImages, ...newImages];
    }
    product.images = currentImages;

    const updated = await product.save();
    res.json(serializeProduct(updated));
  })
);

// @route   DELETE /api/products/:id
// @desc    Delete a product (admin only)
router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    (product.images || []).forEach((img) => deleteUploadedFile(img.filename));

    await product.destroy();
    res.json({ message: "Product removed" });
  })
);

module.exports = router;
