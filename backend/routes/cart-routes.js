const express = require('express');
const router = express.Router();
const {addToCart, removeFromCart, getCart, updateCartItem, clearCart} = require("../controllers/cart-controller");
const auth = require("../middleware/auth");

router.post("/add", auth, addToCart);
router.get("/mycart", auth, getCart);
router.delete("/remove/:productId", auth, removeFromCart);
router.put("/update/:productId", auth, updateCartItem);
router.delete("/clear", auth, clearCart);

module.exports = router;