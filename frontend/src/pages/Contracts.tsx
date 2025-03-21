import React, { useEffect, useState } from 'react';
import { Contract, getAllContracts, downloadContract } from '../services/contractService';
import { format } from 'date-fns';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Contracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingContractId, setViewingContractId] = useState<string | null>(null);

  useEffect(() => {
    console.log('Contracts component mounted');
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      console.log('Starting to fetch contracts');
      setLoading(true);
      setError(null);
      const data = await getAllContracts();
      console.log('Contracts fetched successfully:', data);
      setContracts(data);
    } catch (err) {
      console.error('Error in fetchContracts:', err);
      setError('Failed to fetch contracts. Please try again later.');
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          config: err.config
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      await downloadContract(id);
    } catch (err) {
      console.error('Error downloading contract:', err);
      setError('Failed to download contract. Please try again later.');
    }
  };

  const handleView = async (id: string, e: React.MouseEvent) => {
    try {
      e.preventDefault();
      setViewingContractId(id);
      setError(null);

      // Open the view URL directly in a new tab
      const viewUrl = `${API_URL}/contracts/${id}/view`;
      window.open(viewUrl, '_blank', 'noopener,noreferrer');

    } catch (err) {
      console.error('Error viewing contract:', err);
      setError('Failed to view contract. Please try again later.');
    } finally {
      setViewingContractId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contracts</h1>
      <div className="grid gap-6">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{contract.title}</h2>
                <p className="text-gray-600 mb-4">{contract.description}</p>
                <div className="text-sm text-gray-500">
                  <p>File: {contract.fileName}</p>
                  <p>Uploaded: {format(new Date(contract.uploadDate), 'PPP')}</p>
                  <p>Status: <span className="capitalize">{contract.status}</span></p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(contract.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={(e) => handleView(contract.id, e)}
                  disabled={viewingContractId === contract.id}
                  className={`${
                    viewingContractId === contract.id 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white px-4 py-2 rounded transition-colors`}
                >
                  {viewingContractId === contract.id ? 'Opening...' : 'View'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {contracts.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No contracts found. Upload a contract to get started.
        </div>
      )}
    </div>
  );
};

export default Contracts; 