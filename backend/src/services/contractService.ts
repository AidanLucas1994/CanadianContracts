import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Contract } from '../types/contract';
import { CONTRACTS_FILE, UPLOAD_DIR } from '../config/storage';

// Ensure directories exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

if (!fs.existsSync(path.dirname(CONTRACTS_FILE))) {
  fs.mkdirSync(path.dirname(CONTRACTS_FILE), { recursive: true });
}

// Initialize contracts file if it doesn't exist
if (!fs.existsSync(CONTRACTS_FILE)) {
  fs.writeFileSync(CONTRACTS_FILE, JSON.stringify([], null, 2));
}

export const getAllContracts = (): Contract[] => {
  try {
    const data = fs.readFileSync(CONTRACTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contracts file:', error);
    return [];
  }
};

export const getContractById = (id: string): Contract | undefined => {
  try {
    const contracts = getAllContracts();
    return contracts.find(contract => contract.id === id);
  } catch (error) {
    console.error('Error getting contract by ID:', error);
    return undefined;
  }
};

export const saveContract = async (
  file: Express.Multer.File,
  title: string,
  description: string
): Promise<Contract> => {
  try {
    const contracts = getAllContracts();
    const newContract: Contract = {
      id: uuidv4(),
      title,
      description,
      fileName: file.originalname,
      filePath: file.path,
      uploadDate: new Date().toISOString(),
      status: 'pending',
    };

    contracts.push(newContract);
    fs.writeFileSync(CONTRACTS_FILE, JSON.stringify(contracts, null, 2));

    return newContract;
  } catch (error) {
    console.error('Error saving contract:', error);
    throw error;
  }
}; 