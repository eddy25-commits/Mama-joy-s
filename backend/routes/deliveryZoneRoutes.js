const express = require("express");
const asyncHandler = require("express-async-handler");
const DeliveryZone = require("../models/DeliveryZone");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/delivery-zones
// @desc    Get active delivery zones for the checkout dropdown (public),
//          grouped by scope and ordered for display.
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const zones = await DeliveryZone.findAll({
      where: { isActive: true },
      order: [
        ["scope", "ASC"],
        ["sortOrder", "ASC"],
        ["name", "ASC"],
      ],
    });
    res.json(zones);
  })
);

// @route   GET /api/delivery-zones/admin/all
// @desc    Get ALL delivery zones including inactive ones (admin only)
router.get(
  "/admin/all",
  protect,
  asyncHandler(async (req, res) => {
    const zones = await DeliveryZone.findAll({
      order: [
        ["scope", "ASC"],
        ["sortOrder", "ASC"],
        ["name", "ASC"],
      ],
    });
    res.json(zones);
  })
);

// @route   POST /api/delivery-zones
// @desc    Create a delivery zone (admin only)
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { name, scope, fee, isActive, sortOrder } = req.body;

    if (!name || !scope || fee === undefined || fee === null || fee === "") {
      res.status(400);
      throw new Error("Please provide a name, scope, and fee");
    }
    if (!DeliveryZone.SCOPES.includes(scope)) {
      res.status(400);
      throw new Error("Scope must be either 'ghana' or 'international'");
    }

    const zone = await DeliveryZone.create({
      name: name.trim(),
      scope,
      fee: Number(fee),
      isActive: isActive === undefined ? true : isActive === "true" || isActive === true,
      sortOrder: Number(sortOrder) || 0,
    });

    res.status(201).json(zone);
  })
);

// @route   PUT /api/delivery-zones/:id
// @desc    Update a delivery zone (admin only)
router.put(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const zone = await DeliveryZone.findByPk(req.params.id);
    if (!zone) {
      res.status(404);
      throw new Error("Delivery zone not found");
    }

    const { name, scope, fee, isActive, sortOrder } = req.body;

    if (name !== undefined) zone.name = name.trim();
    if (scope !== undefined) {
      if (!DeliveryZone.SCOPES.includes(scope)) {
        res.status(400);
        throw new Error("Scope must be either 'ghana' or 'international'");
      }
      zone.scope = scope;
    }
    if (fee !== undefined) zone.fee = Number(fee);
    if (isActive !== undefined) zone.isActive = isActive === "true" || isActive === true;
    if (sortOrder !== undefined) zone.sortOrder = Number(sortOrder) || 0;

    const updated = await zone.save();
    res.json(updated);
  })
);

// @route   DELETE /api/delivery-zones/:id
// @desc    Delete a delivery zone (admin only)
router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const zone = await DeliveryZone.findByPk(req.params.id);
    if (!zone) {
      res.status(404);
      throw new Error("Delivery zone not found");
    }
    await zone.destroy();
    res.json({ message: "Delivery zone removed" });
  })
);

module.exports = router;
