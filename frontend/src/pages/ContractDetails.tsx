import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Button,
  Grid,
  Breadcrumbs,
  Link,
  Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Contract, getContractById, viewContract } from '../services/contractService';
import { VendorSuggestions } from '../components/VendorSuggestions';

export const ContractDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewError, setViewError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        setError(null);
        if (id) {
          const data = await getContractById(id);
          console.log('Fetched contract data:', data);
          setContract(data);
        }
      } catch (err) {
        setError('Failed to fetch contract details');
        console.error('Error fetching contract:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  const handleBack = () => {
    navigate('/contracts');
  };

  const handleViewContract = async () => {
    if (!contract?.id) return;
    
    try {
      setViewError(null);
      const blob = await viewContract(contract.id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setViewError('Failed to view contract. Please try again later.');
      console.error('Error viewing contract:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !contract) {
    return (
      <Box p={2}>
        <Typography color="error">
          {error || 'Contract not found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box mb={3}>
        <Breadcrumbs>
          <Link
            component="button"
            variant="body1"
            onClick={handleBack}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <ArrowBackIcon sx={{ mr: 0.5 }} fontSize="small" />
            Back to Contracts
          </Link>
          <Typography color="text.primary">{contract.title}</Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {contract.title}
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>
              {contract.description || 'No description provided'}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
              File
            </Typography>
            <Typography paragraph>
              {contract.fileName || 'No file name available'}
            </Typography>

            {viewError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {viewError}
              </Alert>
            )}

            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleViewContract}
              >
                View Contract
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <VendorSuggestions
              contractTitle={contract.title}
              contractDescription={contract.description}
              workType={['IT Consulting', 'Software Development']} // Replace with actual work types from your contract
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 