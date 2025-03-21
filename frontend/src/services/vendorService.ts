import axios from 'axios';
import { API_BASE_URL } from '../config/index';

export interface VendorContact {
  name: string;
  email: string;
  phone: string;
  role?: string;
}

export interface Vendor {
  id: string;
  companyName: string;
  services: string[];
  province: string;
  city: string;
  postalCode: string;
  contactInfo: VendorContact;
  businessNumber: string;
  yearEstablished: number;
  certifications?: string[];
  languages: string[];
  createdAt: string;
  updatedAt: string;
}

export const getVendorSuggestions = async (
  keywords: string[],
  services: string[],
  limit: number = 5
): Promise<Vendor[]> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/vendors/suggest`, {
      keywords,
      services,
      limit
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor suggestions:', error);
    return [];
  }
}; 