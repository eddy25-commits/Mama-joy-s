const express = require("express");
const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders (admin only) - supports ?status=
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    const where = {};
    if (status) where.orderStatus = status;
    const orders = await Order.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json(orders);
  })
);

// @route   GET /api/orders/reference/:reference
// @desc    Customer-facing order lookup by Paystack reference (order confirmation page)
router.get(
  "/reference/:reference",
  asyncHandler(async (req, res) => {
    const order = await Order.findOne({ where: { paystackReference: req.params.reference } });
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    res.json(order);
  })
);

// @route   GET /api/orders/track
// @desc    Customer-facing order tracking lookup by order number and contact info
router.get(
  "/track",
  asyncHandler(async (req, res) => {
    const { orderNumber, email, phone } = req.query;

    if (!orderNumber && (!email || !phone)) {
      res.status(400);
      throw new Error("Please provide an order number or both email and phone number.");
    }

    const orders = await Order.findAll({ order: [["createdAt", "DESC"]] });

    const normalizedOrderNumber = orderNumber ? String(orderNumber).trim().toLowerCase() : "";
    const normalizedEmail = email ? String(email).trim().toLowerCase() : "";
    const normalizedPhone = phone ? String(phone).replace(/\D/g, "") : "";

    const matches = orders.filter((order) => {
      const customer = order.customer || {};
      const customerEmail = String(customer.email || "").trim().toLowerCase();
      const customerPhone = String(customer.phone || "").replace(/\D/g, "");
      const orderRef = String(order.orderNumber || "").trim().toLowerCase();

      if (normalizedOrderNumber) {
        return orderRef === normalizedOrderNumber;
      }

      return customerEmail === normalizedEmail && customerPhone === normalizedPhone;
    });

    if (matches.length === 0) {
      res.status(404);
      throw new Error("No order found for the details you provided.");
    }

    res.json(matches[0]);
  })
);

// @route   PUT /api/orders/:id/status
// @desc    Update order fulfillment status (admin only)
router.put(
  "/:id/status",
  protect,
  asyncHandler(async (req, res) => {
    const { orderStatus } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    order.orderStatus = orderStatus || order.orderStatus;
    await order.save();
    res.json(order);
  })
);

module.exports = router;
