import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, Button, CircularProgress } from '@mui/material';
import { Visibility, GetApp, Send } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import { Contract, getAllContracts, downloadContract } from '../services/contractService';
import ProposalForm from '../components/ProposalForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const ContractList = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllContracts();
      setContracts(data);
    } catch (err) {
      console.error('Error fetching contracts:', err);
      setError('Failed to fetch contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      await downloadContract(id);
    } catch (err) {
      console.error('Error downloading contract:', err);
      setError('Failed to download contract');
    }
  };

  const handleView = (id: string) => {
    navigate(`/contracts/${id}`);
  };

  const handleOpenProposalDialog = (contractId: string) => {
    setSelectedContractId(contractId);
    setProposalDialogOpen(true);
  };

  const handleCloseProposalDialog = () => {
    setSelectedContractId(null);
    setProposalDialogOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Contracts
      </Typography>
      <Paper>
        <List>
          {contracts.map((contract) => (
            <ListItem 
              key={contract.id} 
              divider
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
              onClick={() => handleView(contract.id)}
            >
              <ListItemText
                primary={contract.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      {contract.description}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="textSecondary">
                      File: {contract.fileName}
                      <br />
                      Uploaded: {format(new Date(contract.uploadDate), 'PPP')}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<GetApp />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(contract.id);
                  }}
                  color="primary"
                >
                  Download
                </Button>
                <Button
                  startIcon={<Visibility />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(contract.id);
                  }}
                  color="secondary"
                >
                  View Details
                </Button>
                <Button
                  startIcon={<Send />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenProposalDialog(contract.id);
                  }}
                  color="success"
                  variant="contained"
                >
                  Submit Proposal
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
      {contracts.length === 0 && (
        <Typography variant="body1" color="textSecondary" align="center" style={{ marginTop: 20 }}>
          No contracts found. Upload a contract to get started.
        </Typography>
      )}
      {selectedContractId && (
        <ProposalForm
          contractId={selectedContractId}
          open={proposalDialogOpen}
          onClose={handleCloseProposalDialog}
        />
      )}
    </Box>
  );
};

export default ContractList; 