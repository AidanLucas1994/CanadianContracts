export interface Contract {
  id: string;
  title: string;
  description: string;
  fileName: string;
  filePath: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
} 