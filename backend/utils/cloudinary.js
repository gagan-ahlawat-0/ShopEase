const cloudinary = require("cloudinary").v2;
const debug = require("debug")("app:cloudinary");

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Missing Cloudinary environment variables.");
  }

  debug("✅ Cloudinary configured successfully");
} catch (error) {
  console.error("❌ Cloudinary configuration failed:", error.message);
}

module.exports = cloudinary;