const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../config/multer-config');

const {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryTree,
    getSubCategories
} = require('../controllers/category-controller.js');

router.post('/create', admin, upload.single('image'), createCategory);
router.get('/', getAllCategories);
router.get('/tree', getCategoryTree);
router.get('/subcategories/:id', getSubCategories);
router.get('/:id', getCategoryById);
router.put('/:id', admin, upload.single('image'), updateCategory);
router.put('/upload/:id', admin, upload.array('images'), updateCategory);
router.delete('/:id', admin, deleteCategory);

module.exports = router;