const cloudinary = require('cloudinary').v2;

function isCloudinaryEnabled() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

function configureCloudinary() {
  if (!isCloudinaryEnabled()) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

async function uploadToCloudinary(file) {
  configureCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: process.env.CLOUDINARY_FOLDER || 'little-star' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
}

async function saveUploadedFile(file) {
  if (!file) return '';

  if (isCloudinaryEnabled() && file.buffer) {
    return uploadToCloudinary(file);
  }

  if (file.filename) {
    return `/uploads/${file.filename}`;
  }

  return '';
}

async function saveUploadedFiles(files = []) {
  return Promise.all(files.map((file) => saveUploadedFile(file)));
}

module.exports = {
  isCloudinaryEnabled,
  saveUploadedFile,
  saveUploadedFiles,
};
