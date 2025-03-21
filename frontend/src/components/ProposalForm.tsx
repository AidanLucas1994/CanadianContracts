import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';

interface ProposalFormProps {
  contractId: string;
  open: boolean;
  onClose: () => void;
}

interface ProposalData {
  name: string;
  companyName: string;
  bidAmount: number;
  description: string;
}

const ProposalForm: React.FC<ProposalFormProps> = ({ contractId, open, onClose }) => {
  const [formData, setFormData] = useState<ProposalData>({
    name: '',
    companyName: '',
    bidAmount: 0,
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bidAmount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/contracts/${contractId}/proposals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit proposal');
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting the proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Submit Proposal</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="companyName"
              label="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="bidAmount"
              label="Bid Amount"
              type="number"
              value={formData.bidAmount || ''}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <span>$</span>
              }}
            />
            <TextField
              name="description"
              label="Proposal Description"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Submitting...' : 'Submit Proposal'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProposalForm; 