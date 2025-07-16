const express = require("express");
const router = express();
const {getAllProducts, 
    getProductById, 
    createProduct, 
    uploadProduct, 
    deleteProduct
    } = require("../controllers/product-controller");
const upload = require("../config/multer-config");
const admin = require("../middleware/admin");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", admin, upload.array("images"), createProduct);
router.put("/:id", admin, upload.array("images"), uploadProduct);
router.delete("/:id", admin, deleteProduct);

module.exports = router;