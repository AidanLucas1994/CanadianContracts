import express from 'express';
import { createProposal, getProposalsByContractId, getProposalById, updateProposalStatus } from '../services/proposalService';

const router = express.Router();

// Submit a new proposal
router.post('/contracts/:contractId/proposals', async (req, res) => {
  try {
    const { contractId } = req.params;
    const proposalData = {
      contractId,
      name: req.body.name,
      companyName: req.body.companyName,
      bidAmount: parseFloat(req.body.bidAmount),
      description: req.body.description
    };

    // Validate required fields
    const requiredFields = ['name', 'companyName', 'bidAmount', 'description'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate bid amount
    if (isNaN(proposalData.bidAmount) || proposalData.bidAmount <= 0) {
      return res.status(400).json({
        error: 'Bid amount must be a positive number'
      });
    }

    const proposal = await createProposal(proposalData);
    res.status(201).json(proposal);
  } catch (error) {
    console.error('Error creating proposal:', error);
    if (error instanceof Error && error.message === 'Contract not found') {
      res.status(404).json({ error: 'Contract not found' });
    } else {
      res.status(500).json({ error: 'Failed to create proposal' });
    }
  }
});

// Get all proposals for a contract
router.get('/contracts/:contractId/proposals', async (req, res) => {
  try {
    const { contractId } = req.params;
    const proposals = await getProposalsByContractId(contractId);
    res.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// Get a specific proposal
router.get('/proposals/:id', async (req, res) => {
  try {
    const proposal = await getProposalById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json(proposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

// Update proposal status
router.patch('/proposals/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const proposal = await updateProposalStatus(req.params.id, status);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json(proposal);
  } catch (error) {
    console.error('Error updating proposal status:', error);
    res.status(500).json({ error: 'Failed to update proposal status' });
  }
});

export default router; 