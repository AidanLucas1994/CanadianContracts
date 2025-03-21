import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');
const CONTRACTS_FILE = path.join(__dirname, '../../data/contracts.json');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Ensure data directory and contracts file exist
const DATA_DIR = path.dirname(CONTRACTS_FILE);
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(CONTRACTS_FILE)) {
  fs.writeFileSync(CONTRACTS_FILE, JSON.stringify([], null, 2));
}

export { UPLOAD_DIR, CONTRACTS_FILE }; 