const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const { sequelize } = require("../config/db");
const Order = require("../models/Order");
const Product = require("../models/Product");
const DeliveryZone = require("../models/DeliveryZone");

const router = express.Router();

const PAYSTACK_BASE_URL = "https://api.paystack.co";
const paystackHeaders = () => ({
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  "Content-Type": "application/json",
});

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MJC-${timestamp}${random}`;
};

// Decrements stock for every item in an order inside a single transaction,
// so partial failures can't leave stock counts inconsistent.
const decrementStockForOrder = async (order) => {
  await sequelize.transaction(async (t) => {
    for (const item of order.items) {
      await Product.decrement(
        { stock: item.quantity },
        { where: { id: item.productId }, transaction: t }
      );
    }
  });
};

// @route   POST /api/payment/initialize
// @desc    Validate cart against DB prices/stock, create a pending order,
//          then initialize a Paystack transaction and return the authorization_url
router.post(
  "/initialize",
  asyncHandler(async (req, res) => {
    const { customer, items, deliveryZoneId } = req.body;

    if (!customer || !customer.name || !customer.email || !customer.phone) {
      res.status(400);
      throw new Error("Please provide full customer details (name, email, phone)");
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error("Cart is empty");
    }

    // Re-validate items & prices against the database — never trust client-sent prices
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || !product.isActive) {
        res.status(400);
        throw new Error(`Product not found or unavailable: ${item.name || item.productId}`);
      }
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Not enough stock for ${product.name}. Available: ${product.stock}`);
      }
      const price = Number(product.price);
      subtotal += price * item.quantity;
      validatedItems.push({
        productId: product.id,
        name: product.name,
        price,
        quantity: item.quantity,
        image: product.images?.[0]?.url || "",
      });
    }

    // The delivery fee is never trusted from the client — only a zone ID is
    // accepted, and its price is looked up here so a tampered request body
    // can't be used to pay less than the admin-configured rate.
    if (!deliveryZoneId) {
      res.status(400);
      throw new Error("Please select a delivery region");
    }
    const zone = await DeliveryZone.findOne({ where: { id: deliveryZoneId, isActive: true } });
    if (!zone) {
      res.status(400);
      throw new Error("Selected delivery region is no longer available. Please choose another.");
    }

    const fee = Number(zone.fee);
    const total = subtotal + fee;
    const orderNumber = generateOrderNumber();
    const reference = `${orderNumber}-${crypto.randomBytes(4).toString("hex")}`;

    const order = await Order.create({
      orderNumber,
      customer,
      items: validatedItems,
      subtotal,
      deliveryFee: fee,
      deliveryZoneId: zone.id,
      deliveryZoneName: zone.name,
      total,
      paystackReference: reference,
      paymentStatus: "pending",
    });

    // Paystack expects the amount in the lowest currency unit (pesewas for GHS)
    const amountInPesewas = Math.round(total * 100);

    const paystackResponse = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email: customer.email,
        amount: amountInPesewas,
        currency: "GHS",
        reference,
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
        metadata: {
          orderNumber,
          customerName: customer.name,
          customerPhone: customer.phone,
        },
      },
      { headers: paystackHeaders() }
    );

    res.status(201).json({
      authorizationUrl: paystackResponse.data.data.authorization_url,
      reference,
      orderNumber,
    });
  })
);

// @route   GET /api/payment/verify/:reference
// @desc    Verify a Paystack transaction and update order + reduce stock if successful
router.get(
  "/verify/:reference",
  asyncHandler(async (req, res) => {
    const { reference } = req.params;

    const order = await Order.findOne({ where: { paystackReference: reference } });
    if (!order) {
      res.status(404);
      throw new Error("Order not found for this reference");
    }

    // If we've already confirmed this order, don't re-process (idempotency)
    if (order.paymentStatus === "paid") {
      return res.json({ status: "success", order });
    }

    const verifyResponse = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: paystackHeaders() }
    );

    const data = verifyResponse.data.data;

    if (data.status === "success") {
      order.paymentStatus = "paid";
      order.orderStatus = "processing";
      await order.save();
      await decrementStockForOrder(order);
      return res.json({ status: "success", order });
    }

    order.paymentStatus = "failed";
    await order.save();
    return res.json({ status: "failed", order });
  })
);

// @route   POST /api/payment/webhook
// @desc    Paystack webhook (recommended for production reliability alongside verify)
router.post(
  "/webhook",
  asyncHandler(async (req, res) => {
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.body)
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).send("Invalid signature");
    }

    const event = JSON.parse(req.body);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const order = await Order.findOne({ where: { paystackReference: reference } });

      if (order && order.paymentStatus !== "paid") {
        order.paymentStatus = "paid";
        order.orderStatus = "processing";
        await order.save();
        await decrementStockForOrder(order);
      }
    }

    res.sendStatus(200);
  })
);

module.exports = router;
