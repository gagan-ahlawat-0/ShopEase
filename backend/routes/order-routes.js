const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markAsDelivered,
  markAsPaid,
  updateOrderStatus
} = require("../controllers/order-controller");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/create", auth, createOrder);
router.get("/", auth, admin, getAllOrders);
router.get("/myorders", auth, getMyOrders);
router.get("/:id", auth, getOrderById);
router.put("/markasdelivered/:id", auth, admin, markAsDelivered);
router.put("/markaspaid/:id", auth, markAsPaid);
router.put("/update/:id", auth, updateOrderStatus);

module.exports = router;
