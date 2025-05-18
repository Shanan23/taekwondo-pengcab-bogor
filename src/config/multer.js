const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    'organization',
    'events',
    'members',
    'content'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join('/app', 'uploads', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true, mode: 0o755 });
    }
  });
};

createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = '/app/uploads';
    
    // Determine upload directory based on route
    if (req.originalUrl.includes('/organization')) {
      uploadPath = path.join(uploadPath, 'organization');
    } else if (req.originalUrl.includes('/events')) {
      uploadPath = path.join(uploadPath, 'events');
    } else if (req.originalUrl.includes('/members')) {
      uploadPath = path.join(uploadPath, 'members');
    } else if (req.originalUrl.includes('/content')) {
      uploadPath = path.join(uploadPath, 'content');
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload; 