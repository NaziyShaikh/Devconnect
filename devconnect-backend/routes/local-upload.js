// Local file upload fallback for testing
// Use this if Cloudinary is not configured
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  }
});

// Local file upload endpoint
router.post('/image', verifyToken, upload.single('file'), async (req, res) => {
  try {
    console.log('Local upload route called');
    
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Create a URL that can be accessed from the frontend
    const fileUrl = `/uploads/${req.file.filename}`;
    
    console.log('File saved locally:', req.file.filename);
    res.json({ url: fileUrl });
  } catch (err) {
    console.error('Local upload error:', err);
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
});

// Serve uploaded files statically
router.use('/uploads', express.static(uploadsDir));

export default router;
