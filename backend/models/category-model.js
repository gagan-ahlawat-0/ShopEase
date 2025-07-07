const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters."],
    },
    description: {
      type: String,
      required: [true, "Category description is required."],
      maxlength: [200, "Category description cannot exceed 200 characters."],
    },
    image: {
      type: String,
      required: [true, "Category image is required."],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    productCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", (next) => {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/^a-zA-Z0-9]+/g, "-")
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }
  next();
});

categorySchema.post("save", async (doc, next) => {
  if (doc.parent) {
    await mongoose.model("Category").updateOne(doc.parent, {
      $addToSet: {
        children: doc._id,
      },
      $inc: {
        productCount: doc.productCount,
      },
    });
  }
});

categorySchema.post("remove", async (doc, next) => {
  if (doc.parent) {
    await mongoose.model("Category").updateOne(doc.parent, {
      $pull: {
        children: doc._id,
      },
      $inc: {
        productCount: -doc.productCount,
      },
    });
  }
});

categorySchema.statics.getCategoryTree = async () => {
  const categories = await this.find({ isActive: true })
    .sort({ sortOrder: 1 })
    .populate("children", "name slug image -_id");

  const tree = {};
  const categoreMap = {};

  categories.forEach((category) => {
    categoreMap[category._id] = {
      ...category.toObject(),
      children: [],
    };
  });

  categories.forEach((category) => {
    if (category.parent) {
      categoreMap[category.parent].children.push(categoreMap[category._id]);
    } else {
      tree[category._id] = categoreMap[category._id];
    }
  });

  return tree;
};

categorySchema.statics.getSubcategories = async (categoryId) => {
  const subcategories = [];

  const findChildren = async (parentId) => {
    const children = await this.find({ parent: parentId, isActive: true });
    for (const child of children) {
      subcategories.push(child._id);
      await findChildren(child._id);
    }
  };

  await findChildren(categoryId);
  return subcategories;
};

categorySchema.methods.getPath = async () => {
  const path = [];
  let current = this;
  while (current) {
    path.unshift({
      _id: current._id,
      name: current.name,
      slug: current.slug,
    });

    if (current.parent) {
      current = await this.model("Category").findById(current.parent);
    } else {
      current = null;
    }
  }

  return path;
};

categorySchema.index({
  name: 1,
  slug: 1,
  parent: 1,
  isActive: 1,
  sortOrder: 1,
});

module.exports = mongoose.model("Category", categorySchema);