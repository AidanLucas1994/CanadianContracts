import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { Vendor, CreateVendorDTO, VendorSearchParams } from '../types/vendor';

const VENDORS_FILE = path.join(__dirname, '../../data/vendors.json');

// Initialize vendors file
const initializeVendorsFile = async () => {
  try {
    await fs.access(VENDORS_FILE);
  } catch {
    await fs.writeFile(VENDORS_FILE, '[]');
  }
};

// Read all vendors
const readVendors = async (): Promise<Vendor[]> => {
  await initializeVendorsFile();
  const data = await fs.readFile(VENDORS_FILE, 'utf-8');
  return JSON.parse(data);
};

// Write vendors to file
const writeVendors = async (vendors: Vendor[]): Promise<void> => {
  await fs.writeFile(VENDORS_FILE, JSON.stringify(vendors, null, 2));
};

// Create a new vendor
export const createVendor = async (data: CreateVendorDTO): Promise<Vendor> => {
  const vendors = await readVendors();
  
  const newVendor: Vendor = {
    id: uuidv4(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  vendors.push(newVendor);
  await writeVendors(vendors);

  return newVendor;
};

// Get vendor by ID
export const getVendorById = async (id: string): Promise<Vendor | null> => {
  const vendors = await readVendors();
  return vendors.find(vendor => vendor.id === id) || null;
};

// Search vendors based on keywords and filters
export const searchVendors = async (params: VendorSearchParams): Promise<Vendor[]> => {
  const vendors = await readVendors();
  
  return vendors.filter(vendor => {
    // Match keywords against company name and services
    if (params.keywords?.length) {
      const vendorText = [
        vendor.companyName.toLowerCase(),
        ...vendor.services.map(s => s.toLowerCase())
      ].join(' ');
      
      const hasKeyword = params.keywords.some(keyword =>
        vendorText.includes(keyword.toLowerCase())
      );
      
      if (!hasKeyword) return false;
    }

    // Match specific services
    if (params.services?.length) {
      const hasService = params.services.some(service =>
        vendor.services.map(s => s.toLowerCase()).includes(service.toLowerCase())
      );
      if (!hasService) return false;
    }

    // Match location
    if (params.province && 
        vendor.province.toLowerCase() !== params.province.toLowerCase()) {
      return false;
    }

    if (params.city && 
        vendor.city.toLowerCase() !== params.city.toLowerCase()) {
      return false;
    }

    // Match certifications
    if (params.certifications?.length && vendor.certifications) {
      const hasCertification = params.certifications.some(cert =>
        vendor.certifications?.map(c => c.toLowerCase()).includes(cert.toLowerCase())
      );
      if (!hasCertification) return false;
    }

    // Match languages
    if (params.languages?.length) {
      const hasLanguage = params.languages.some(lang =>
        vendor.languages.map(l => l.toLowerCase()).includes(lang.toLowerCase())
      );
      if (!hasLanguage) return false;
    }

    return true;
  });
};

// Get vendor suggestions based on contract keywords
export const getVendorSuggestions = async (
  keywords: string[],
  services: string[],
  limit: number = 5
): Promise<Vendor[]> => {
  const vendors = await readVendors();
  
  // Score each vendor based on keyword and service matches
  const scoredVendors = vendors.map(vendor => {
    let score = 0;
    
    // Score based on service matches
    services.forEach(service => {
      if (vendor.services.some(s => 
        s.toLowerCase().includes(service.toLowerCase())
      )) {
        score += 2; // Higher weight for service matches
      }
    });

    // Score based on keyword matches in company name and services
    keywords.forEach(keyword => {
      if (vendor.companyName.toLowerCase().includes(keyword.toLowerCase())) {
        score += 1;
      }
      if (vendor.services.some(s => 
        s.toLowerCase().includes(keyword.toLowerCase())
      )) {
        score += 1;
      }
    });

    return { vendor, score };
  });

  // Sort by score and return top matches
  return scoredVendors
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ vendor }) => vendor);
}; 