const productModel = require("../models/product-model");
const categoryModel = require("../models/category-model");
const debug = require("debug")("app:search-controller");

module.exports.searchProducts = async (req, res) => {
    try {
        const {
            q,
            category,
            brand,
            minPrice = 0,
            maxPrice,
            page = 1,
            limit = 12,
            sortBy = "createdAt",
            order = "desc"
        } = req.body;

        const filter = {}
        if (q) {
            filter.$text = {$search: q}
        };

        if (category) {
            filter.category = category;
        };

        if (brand) {
            filter.brand = brand;
        };

        if(minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        };
        
        const skip = (Number(page) - 1) * Number(limit);

        const [products, total] = await Promise.all([
            productModel
            .find(filter)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate("category", "name")
            .populate("brand", "name"),
            productModel.countDocuments(filter)
        ])

    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Failed to search products', details: error.message});
    }
};

module.exports.searchCategories = async (req, res) => {
    try{
        const {keyword = "", page = 1, limit = 10} = req.query;
        const regex = new RegExp(keyword.trim(), "i");

        const skip = (Number(page) - 1) * Number(limit);

        const [categories, total] = await Promise.all([
            categoryModel
            .find({ name: regex })
            .populate("parent", "name")
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 }),
            categoryModel.countDocuments({ name: regex })
        ]);

        res.status(200).json({
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            categories
        })
    } catch (error) {
        debug(error);
        res.status(500).json({ error: 'Failed to search categories', details: error.message});
    }
};

module.exports.searchProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await productModel
      .find({ slug })
      .populate("category", "name")
      .populate("brand", "name");

    if (product) {
      return res.status(200).json({ exactMatch: true, product });
    }

    const regex = new RegExp(slug.replace(/-/g, " "), "i");
    const similarProducts = await productModel
      .find({ name: { $regex: regex } })
      .limit(5)
      .populate("category", "name")
      .populate("brand", "name");

    if (similarProducts.length > 0) {
      return res.status(404).json({
        message: "Exact match not found. Showing similar results.",
        exactMatch: false,
        similarProducts,
      });
    }

    res.status(404).json({ message: "Product not found", exactMatch: false });
  } catch (error) {
    debug("Slug search error:", error);
    res.status(500).json({ message: "Slug search failed", error: error.message });
  }
};
