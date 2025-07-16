const categoryModel = require("../models/category-model");
const debug = require("debug")("app:category-controller");

module.exports.createCategory = async (req, res) => {
    try {
        const {name, description, parent} = req.body;
        const image = req.file.path;
        
        const category = new categoryModel({
            name,
            description,
            image,
            parent : parent ? parent : null
        });

        await category.save();
        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Failed to create category', details: error.message});
    }
};

module.exports.getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const [categories, total] = await Promise.all([
            categoryModel.find()
            .populate("parent", "name")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
            categoryModel.countDocuments()
        ])
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Failed to fetch categories', details: error.message});
    }
};

module.exports.getCategoryById = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id).populate("parent", "name");
        if(!category) {
            return res.status(404).json({ error: 'Category not found'});
        }
        res.status(200).json({ category });
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Failed to fetch category', details: error.message});
    }
};

module.exports.updateCategory = async (req, res) => {
    try {
        const {name, description, parent, isActive} = req.body;
        const image = req.file.path;
        const category = await categoryModel.findById(req.params.id);
        if(!category) {
            return res.status(404).json({ error: 'Category not found'});
        }
        category.name = name;
        category.description = description;
        category.image = image;
        category.parent = parent ? parent : null;
        category.isActive = isActive !== undefined ? isActive : category.isActive;
        category.updatedAt = Date.now();

        await category.save();
        res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Failed to update category', details: error.message});
    }
};

module.exports.deleteCategory = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);
        if(!category) {
            return res.status(404).json({ error: 'Category not found'});
        }
        await category.remove();
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Failed to delete category', details: error.message});
    }
};

module.exports.getCategoryTree = async (req, res) => {
    try {
        const tree = await categoryModel.getCategoryTree();
        res.status(200).json({ tree });
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Failed to fetch category tree', details: error.message});
    }
};

module.exports.getSubCategories = async (req, res) => {
    try {
        const subCategories = await categoryModel.getSubcategories(req.params.id);
        res.status(200).json({ subCategories });
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Failed to fetch subcategories', details: error.message});
    }
};