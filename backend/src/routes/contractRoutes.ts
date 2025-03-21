import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_DIR } from '../config/storage';
import { getAllContracts, saveContract, getContractById } from '../services/contractService';
import fs from 'fs';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// GET /api/contracts - Get all contracts
router.get('/', (req, res) => {
  try {
    const contracts = getAllContracts();
    res.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

// GET /api/contracts/:id - Get contract by ID
router.get('/:id', (req, res) => {
  try {
    const contractId = req.params.id;
    console.log(`Fetching contract with ID: ${contractId}`);

    const contract = getContractById(contractId);
    if (!contract) {
      console.error(`Contract not found with ID: ${contractId}`);
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Verify file exists and is readable
    if (!fs.existsSync(contract.filePath)) {
      console.error(`Contract file not found at path: ${contract.filePath}`);
      return res.status(404).json({ error: 'Contract file not found' });
    }

    try {
      // Check if file is readable
      fs.accessSync(contract.filePath, fs.constants.R_OK);
    } catch (accessError) {
      console.error(`File access error for contract ${contractId}:`, accessError);
      return res.status(403).json({ error: 'Contract file is not accessible' });
    }

    // Get file stats for additional information
    const stats = fs.statSync(contract.filePath);
    console.log(`Contract file stats for ${contractId}:`, {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    });

    // Determine content type based on file extension
    const ext = path.extname(contract.fileName).toLowerCase();
    let contentType = 'application/octet-stream';
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
    }

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Last-Modified', stats.mtime.toUTCString());

    // Stream the file
    const fileStream = fs.createReadStream(contract.filePath);
    fileStream.pipe(res);

    // Handle stream errors
    fileStream.on('error', (error) => {
      console.error(`Error streaming file for contract ${contractId}:`, error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to stream contract file' });
      }
    });

    // Handle client disconnect
    req.on('close', () => {
      fileStream.destroy();
    });

  } catch (error) {
    console.error('Error processing contract request:', error);
    res.status(500).json({ error: 'Failed to process contract request' });
  }
});

// GET /api/contracts/:id/download - Download contract file
router.get('/:id/download', (req, res) => {
  try {
    const contractId = req.params.id;
    console.log(`Downloading contract with ID: ${contractId}`);

    const contract = getContractById(contractId);
    if (!contract) {
      console.error(`Contract not found with ID: ${contractId}`);
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (!fs.existsSync(contract.filePath)) {
      console.error(`Contract file not found at path: ${contract.filePath}`);
      return res.status(404).json({ error: 'Contract file not found' });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${contract.fileName}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(contract.filePath);
    fileStream.pipe(res);

    // Handle errors
    fileStream.on('error', (error) => {
      console.error(`Error streaming file for contract ${contractId}:`, error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download contract' });
      }
    });

    // Handle client disconnect
    req.on('close', () => {
      fileStream.destroy();
    });

  } catch (error) {
    console.error('Error downloading contract:', error);
    res.status(500).json({ error: 'Failed to download contract' });
  }
});

// GET /api/contracts/:id/view - View contract file
router.get('/:id/view', (req, res) => {
  try {
    const contractId = req.params.id;
    console.log(`Viewing contract with ID: ${contractId}`);

    const contract = getContractById(contractId);
    if (!contract) {
      console.error(`Contract not found with ID: ${contractId}`);
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (!fs.existsSync(contract.filePath)) {
      console.error(`Contract file not found at path: ${contract.filePath}`);
      return res.status(404).json({ error: 'Contract file not found' });
    }

    // Determine content type based on file extension
    const ext = path.extname(contract.fileName).toLowerCase();
    let contentType = 'application/octet-stream';
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
    }

    // Set headers for file viewing
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${contract.fileName}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(contract.filePath);
    fileStream.pipe(res);

    // Handle errors
    fileStream.on('error', (error) => {
      console.error(`Error streaming file for contract ${contractId}:`, error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to view contract' });
      }
    });

    // Handle client disconnect
    req.on('close', () => {
      fileStream.destroy();
    });

  } catch (error) {
    console.error('Error viewing contract:', error);
    res.status(500).json({ error: 'Failed to view contract' });
  }
});

// POST /api/contracts/upload - Upload a new contract
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const contract = await saveContract(req.file, title, description);
    res.status(201).json(contract);
  } catch (error) {
    console.error('Error uploading contract:', error);
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
      }
    }
    res.status(500).json({ error: 'Failed to upload contract' });
  }
});

export default router; 