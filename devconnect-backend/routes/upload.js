// routes/upload.js
import express from 'express';
import upload from '../middlewares/upload.js';
import cloudinary from '../utils/cloudinary.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/image', verifyToken, upload.single('file'), async (req, res) => {
  try {
    console.log('Image upload route called');
    console.log('File received:', req.file);

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    console.log('File mimetype:', req.file.mimetype);
    console.log('File buffer length:', req.file.buffer.length);

    // Validate file size
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ msg: 'File too large. Maximum size is 5MB' });
    }

    // Validate file type
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ msg: 'Invalid file type. Only images are allowed' });
    }

    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    console.log('File string length:', fileStr.length);

    console.log('Uploading to cloudinary...');
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      resource_type: "auto",
      folder: "devconnect-profiles"
    });
    console.log('Upload successful:', uploadedResponse.secure_url);
    res.json({ url: uploadedResponse.secure_url });
  } catch (err) {
    console.error('Upload error details:', {
      message: err.message,
      name: err.name,
      stack: err.stack
    });

    // Handle specific Cloudinary errors
    if (err.message.includes('Invalid API key')) {
      return res.status(500).json({ msg: 'Cloudinary configuration error: Invalid API key' });
    }
    if (err.message.includes('Invalid cloud name')) {
      return res.status(500).json({ msg: 'Cloudinary configuration error: Invalid cloud name' });
    }

    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
});

// Resume upload endpoint
router.post('/resume', verifyToken, upload.single('file'), async (req, res) => {
  try {
    console.log('Resume upload route called');
    console.log('File received:', req.file);

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Validate that it's a PDF file
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ msg: 'Only PDF files are allowed for resumes' });
    }

    // Validate file size (PDFs can be larger, allow up to 10MB)
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ msg: 'File too large. Maximum size is 10MB for PDFs' });
    }

    console.log('File mimetype:', req.file.mimetype);
    console.log('File size:', req.file.size);
    console.log('File buffer length:', req.file.buffer.length);

    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    console.log('File string length:', fileStr.length);

    console.log('Uploading resume to cloudinary...');
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      resource_type: "auto",
      folder: "devconnect-resumes",
      // Add specific settings for PDF uploads
      format: "pdf",
      type: "upload"
    });
    console.log('Resume upload successful:', uploadedResponse.secure_url);
    res.json({ url: uploadedResponse.secure_url });
  } catch (err) {
    console.error('Resume upload error details:', {
      message: err.message,
      name: err.name,
      stack: err.stack
    });

    // Handle specific Cloudinary errors
    if (err.message.includes('Invalid API key')) {
      return res.status(500).json({ msg: 'Cloudinary configuration error: Invalid API key' });
    }
    if (err.message.includes('Invalid cloud name')) {
      return res.status(500).json({ msg: 'Cloudinary configuration error: Invalid cloud name' });
    }
    if (err.message.includes('File size too large')) {
      return res.status(400).json({ msg: 'File size too large for Cloudinary upload' });
    }

    res.status(500).json({ msg: 'Resume upload failed', error: err.message });
  }
});

export default router;
