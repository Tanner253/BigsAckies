const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

// Promisify fs.unlink
const unlinkAsync = promisify(fs.unlink);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for temporary local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Filter function to allow only images
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Set up multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Upload image to Cloudinary
const uploadToCloudinary = async (filePath, folder = 'reptile-ecommerce/products') => {
  try {
    console.log('Starting Cloudinary upload for file:', filePath);
    console.log('Using folder:', folder);
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      use_filename: true
    });
    
    console.log('Cloudinary upload successful:', result.secure_url);
    
    // Delete local file
    await unlinkAsync(filePath);
    console.log('Local file deleted successfully');
    
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Try to delete local file even if upload failed
    try {
      await unlinkAsync(filePath);
      console.log('Local file deleted after failed upload');
    } catch (unlinkError) {
      console.error('Error deleting local file:', unlinkError);
    }
    
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      result
    };
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary
}; 