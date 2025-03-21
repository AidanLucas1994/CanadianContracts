import axios from 'axios';
import { API_BASE_URL } from '../config/index';

export interface Contract {
  id: string;
  title: string;
  description: string;
  fileName: string;
  filePath: string;
  uploadDate: string;
  status: string;
}

export const getAllContracts = async (): Promise<Contract[]> => {
  try {
    console.log('Fetching contracts from:', `${API_BASE_URL}/contracts`);
    const response = await axios.get(`${API_BASE_URL}/contracts`);
    console.log('Contracts response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching contracts:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
    }
    throw error;
  }
};

export const getContractById = async (id: string): Promise<Contract> => {
  try {
    console.log('Fetching contract details from:', `${API_BASE_URL}/contracts/${id}`);
    const response = await axios.get(`${API_BASE_URL}/contracts/${id}`);
    console.log('Contract details response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching contract:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
    }
    throw error;
  }
};

export const downloadContract = async (id: string): Promise<void> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/contracts/${id}/download`, {
      responseType: 'blob'
    });
    
    // Create a blob from the response data
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    
    // Get the filename from the response headers or use a default
    const contentDisposition = response.headers['content-disposition'];
    const fileName = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : 'contract.pdf';
    
    link.setAttribute('download', fileName);
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading contract:', error);
    throw error;
  }
};

export const viewContract = async (id: string): Promise<Blob> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/contracts/${id}/view`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error viewing contract:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
    }
    throw error;
  }
};

export const uploadContract = async (
  file: File,
  title: string,
  description: string
): Promise<Contract> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    const response = await axios.post(`${API_BASE_URL}/contracts/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading contract:', error);
    throw error;
  }
}; 