const { v2: cloudinary } = require("cloudinary");

const requiredSettings = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const getMissingSettings = () => requiredSettings.filter((name) => !process.env[name]);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const assertCloudinaryConfigured = () => {
  const missingSettings = getMissingSettings();

  if (missingSettings.length) {
    const error = new Error(`Cloudinary is not configured. Missing: ${missingSettings.join(", ")}`);
    error.status = 503;
    throw error;
  }
};

module.exports = { cloudinary, assertCloudinaryConfigured };
