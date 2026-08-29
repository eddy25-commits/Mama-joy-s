const fs = require("fs");
const path = require("path");
const { UPLOAD_DIR } = require("../middleware/upload");

/**
 * Builds the public URL for an uploaded filename, e.g.
 * https://your-api.onrender.com/uploads/<filename>
 * Uses the incoming request so it works correctly locally and on Render
 * without needing to hardcode the domain.
 */
const getFileUrl = (req, filename) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.get("host");
  return `${protocol}://${host}/uploads/${filename}`;
};

/**
 * Turns multer's req.files (disk storage) into the { url, filename } shape
 * stored on Product.images.
 */
const filesToImageRecords = (req, files = []) =>
  files.map((file) => ({
    url: getFileUrl(req, file.filename),
    filename: file.filename,
  }));

/**
 * Deletes a single uploaded file from the persistent disk. Safe to call
 * even if the file is already gone.
 */
const deleteUploadedFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(UPLOAD_DIR, filename);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error(`Failed to delete file ${filename}:`, err.message);
    }
  });
};

module.exports = { getFileUrl, filesToImageRecords, deleteUploadedFile };
