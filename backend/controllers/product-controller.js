const productModel = require('../models/product-model');
const debug = require('debug')('app:product-controller');

module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.json(products);
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.createProduct = async (req, res) => {
    try {
        const product = await productModel.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.uploadProduct = async (req, res) => {
    try{
        const product = await productModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.deleteProduct = async (req, res) => {
    try{
        const product = await productModel.findOneAndDelete({_id: req.params.id});
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};