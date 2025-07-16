const orderModel = require("../models/order-model");
const debug = require("debug")("app:order-controller");

module.exports.createOrder = async (req, res) => {
  try {
    const {
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (
      !user ||
      !orderItems ||
      !shippingAddress ||
      !paymentMethod ||
      !itemsPrice ||
      !taxPrice ||
      !shippingPrice ||
      !totalPrice
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const order = await orderModel.create({
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    res.status(201).json(order);
  } catch (error) {
    debug(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("user", "name email contactNo");
    res.json(orders);
  } catch (error) {
    debug(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user._id });
    if (!orders) {
      return res.status(404).json({ error: "Orders not found" });
    }
    res.json(orders);
  } catch (error) {
    debug(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() ||
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    res.json(order);
  } catch (error) {
    debug(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.markAsPaid = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() ||
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    debug(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.markAsDelivered = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() ||
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    debug(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.updateOrderStatus = async (req, res) => {
  try {
    const order = orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (
      req.user._id.toString() !== order.user._id.toString() &&
      !req.user.role !== "admin"
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    order.status = req.order.status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    debug(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
