const express = require('express');
const router = express.Router();
const {
    searchProducts,
    searchCategories,
    searchProductBySlug
} = require("../controllers/search-controller");

router.get('/products', searchProducts);
router.get('/categories', searchCategories);
router.get('/product/:slug', searchProductBySlug);

module.exports = router;