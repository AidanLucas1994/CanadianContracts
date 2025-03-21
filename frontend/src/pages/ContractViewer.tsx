import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { viewContract } from '../services/contractService';

const ContractViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      viewContract(id);
    }
  }, [id]);

  return null; // This component doesn't render anything as it just triggers the file view
};

export default ContractViewer; 