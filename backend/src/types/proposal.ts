export interface Proposal {
  id: string;
  contractId: string;
  name: string;
  companyName: string;
  bidAmount: number;
  description: string;
  submissionDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface CreateProposalDTO {
  contractId: string;
  name: string;
  companyName: string;
  bidAmount: number;
  description: string;
} 