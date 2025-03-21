import express from 'express';
import { createVendor, getVendorById, searchVendors, getVendorSuggestions } from '../services/vendorService';
import { CreateVendorDTO, VendorSearchParams } from '../types/vendor';

const router = express.Router();

// Create a new vendor
router.post('/vendors', async (req, res) => {
  try {
    const vendorData: CreateVendorDTO = req.body;
    
    // Validate required fields
    const requiredFields = [
      'companyName', 'services', 'province', 'city', 'postalCode',
      'contactInfo', 'businessNumber', 'yearEstablished', 'languages'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate contact info
    const requiredContactFields = ['name', 'email', 'phone'];
    const missingContactFields = requiredContactFields.filter(
      field => !req.body.contactInfo[field]
    );
    
    if (missingContactFields.length > 0) {
      return res.status(400).json({
        error: `Missing required contact fields: ${missingContactFields.join(', ')}`
      });
    }

    // Validate Canadian postal code format
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!postalCodeRegex.test(vendorData.postalCode)) {
      return res.status(400).json({
        error: 'Invalid Canadian postal code format'
      });
    }

    const vendor = await createVendor(vendorData);
    res.status(201).json(vendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ error: 'Failed to create vendor' });
  }
});

// Get vendor by ID
router.get('/vendors/:id', async (req, res) => {
  try {
    const vendor = await getVendorById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ error: 'Failed to fetch vendor' });
  }
});

// Search vendors
router.post('/vendors/search', async (req, res) => {
  try {
    const searchParams: VendorSearchParams = req.body;
    const vendors = await searchVendors(searchParams);
    res.json(vendors);
  } catch (error) {
    console.error('Error searching vendors:', error);
    res.status(500).json({ error: 'Failed to search vendors' });
  }
});

// Get vendor suggestions for a contract
router.post('/vendors/suggest', async (req, res) => {
  try {
    const { keywords, services, limit } = req.body;
    
    if (!keywords || !Array.isArray(keywords) || !services || !Array.isArray(services)) {
      return res.status(400).json({
        error: 'Keywords and services must be provided as arrays'
      });
    }

    const suggestions = await getVendorSuggestions(
      keywords,
      services,
      limit || 5
    );
    
    res.json(suggestions);
  } catch (error) {
    console.error('Error getting vendor suggestions:', error);
    res.status(500).json({ error: 'Failed to get vendor suggestions' });
  }
});

export default router; 