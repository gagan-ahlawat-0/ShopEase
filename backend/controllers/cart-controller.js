const cartModel = require("../models/cart-model");
const productModel = require("../models/product-model");
const debug = require("debug")("app:cart-controller");

module.exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            cart = new cartModel({
                user: req.user._id,
                items: [{ product: product._id, quantity, price: product.price }]
            })
        } else {
            const existingProduct = cart.items.find(item => item.product.toString() === product._id.toString());
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.items.push({ product: product._id, quantity, price: product.price });
            }
        }

        await cart.save();
        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getCart = async (req, res) => {
    try {
        const cart = cartModel.findOne({ user: req.user._id }).populate('items.product', 'name price image');
        if (!cart) {
            return res.status(200).json({ items: [], totalAmount: 0 });
        }

        res.json(cart);
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) return res.status(404).json({ message: 'Product not in cart' });

        item.quantity = quantity;
        await cart.save();

        res.status(200).json({ message: 'Cart item updated', cart });
    } catch (error) {
        debug(error);
        res.status(500).json({ message: 'Failed to update cart item' });
    }
};

module.exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();

        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (error) {
        debug(error);
        res.status(500).json({ message: 'Failed to remove item from cart' });
    }
};

module.exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ user: req.user._id });
        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        debug(error);
        res.status(500).json({ message: 'Failed to clear cart' });
    }
};