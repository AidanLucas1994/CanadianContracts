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
  businessNumber: string; // Canadian Business Number
  yearEstablished: number;
  certifications?: string[];
  languages: string[]; // e.g., ['English', 'French']
  createdAt: string;
  updatedAt: string;
}

export interface VendorSearchParams {
  keywords?: string[];
  services?: string[];
  province?: string;
  city?: string;
  certifications?: string[];
  languages?: string[];
}

export interface CreateVendorDTO {
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
} 