import { v4 as uuidv4 } from 'uuid';
import { Proposal, CreateProposalDTO } from '../types/proposal';
import { getContractById } from './contractService';
import fs from 'fs/promises';
import path from 'path';

const PROPOSALS_FILE = path.join(__dirname, '../../data/proposals.json');

// Ensure the proposals file exists
const initializeProposalsFile = async () => {
  try {
    await fs.access(PROPOSALS_FILE);
  } catch {
    await fs.writeFile(PROPOSALS_FILE, '[]');
  }
};

// Read all proposals
const readProposals = async (): Promise<Proposal[]> => {
  await initializeProposalsFile();
  const data = await fs.readFile(PROPOSALS_FILE, 'utf-8');
  return JSON.parse(data);
};

// Write proposals to file
const writeProposals = async (proposals: Proposal[]): Promise<void> => {
  await fs.writeFile(PROPOSALS_FILE, JSON.stringify(proposals, null, 2));
};

// Create a new proposal
export const createProposal = async (data: CreateProposalDTO): Promise<Proposal> => {
  // Verify the contract exists
  const contract = await getContractById(data.contractId);
  if (!contract) {
    throw new Error('Contract not found');
  }

  const proposals = await readProposals();
  
  const newProposal: Proposal = {
    id: uuidv4(),
    ...data,
    submissionDate: new Date().toISOString(),
    status: 'pending'
  };

  proposals.push(newProposal);
  await writeProposals(proposals);

  return newProposal;
};

// Get all proposals for a contract
export const getProposalsByContractId = async (contractId: string): Promise<Proposal[]> => {
  const proposals = await readProposals();
  return proposals.filter(proposal => proposal.contractId === contractId);
};

// Get a specific proposal
export const getProposalById = async (id: string): Promise<Proposal | null> => {
  const proposals = await readProposals();
  return proposals.find(proposal => proposal.id === id) || null;
};

// Update proposal status
export const updateProposalStatus = async (
  id: string,
  status: 'accepted' | 'rejected'
): Promise<Proposal | null> => {
  const proposals = await readProposals();
  const index = proposals.findIndex(proposal => proposal.id === id);
  
  if (index === -1) {
    return null;
  }

  proposals[index] = {
    ...proposals[index],
    status
  };

  await writeProposals(proposals);
  return proposals[index];
}; 