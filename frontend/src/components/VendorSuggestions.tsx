import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  List,
  ListItem,
  Collapse,
  IconButton,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { Vendor, getVendorSuggestions } from '../services/vendorService';

interface VendorSuggestionsProps {
  contractTitle: string;
  contractDescription: string;
  workType: string[];
}

export const VendorSuggestions: React.FC<VendorSuggestionsProps> = ({
  contractTitle,
  contractDescription,
  workType
}) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        setError(null);

        // Extract keywords from title and description
        const titleWords = contractTitle.toLowerCase().split(' ');
        const descriptionWords = contractDescription.toLowerCase().split(' ');
        const keywords = [...new Set([...titleWords, ...descriptionWords])]
          .filter(word => word.length > 3); // Filter out short words

        const suggestions = await getVendorSuggestions(keywords, workType);
        setVendors(suggestions);
      } catch (err) {
        setError('Failed to fetch vendor suggestions');
        console.error('Error fetching vendor suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [contractTitle, contractDescription, workType]);

  const handleExpandVendor = (vendorId: string) => {
    setExpandedVendor(expandedVendor === vendorId ? null : vendorId);
  };

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (vendors.length === 0) {
    return (
      <Box p={2}>
        <Typography>No vendor suggestions available for this contract.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Suggested Vendors ({vendors.length})
      </Typography>
      <List>
        {vendors.map((vendor) => (
          <Card key={vendor.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{vendor.companyName}</Typography>
                <IconButton onClick={() => handleExpandVendor(vendor.id)}>
                  {expandedVendor === vendor.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              <Typography variant="body2" color="textSecondary">
                <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                {vendor.city}, {vendor.province}
              </Typography>
              <Box mt={1}>
                {vendor.services.map((service, index) => (
                  <Chip
                    key={index}
                    label={service}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
              <Collapse in={expandedVendor === vendor.id}>
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Contact Information:
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                      {vendor.contactInfo.email}
                    </Typography>
                    <Typography variant="body2">
                      <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                      {vendor.contactInfo.phone}
                    </Typography>
                  </Stack>
                  {vendor.certifications && vendor.certifications.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Certifications:
                      </Typography>
                      {vendor.certifications.map((cert, index) => (
                        <Chip
                          key={index}
                          label={cert}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  )}
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(vendor)}
                    >
                      View Full Details
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </List>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md">
        {selectedVendor && (
          <>
            <DialogTitle>{selectedVendor.companyName}</DialogTitle>
            <DialogContent>
              <Box>
                <Typography variant="subtitle1" gutterBottom>Company Information</Typography>
                <Typography variant="body2">
                  <strong>Business Number:</strong> {selectedVendor.businessNumber}
                </Typography>
                <Typography variant="body2">
                  <strong>Established:</strong> {selectedVendor.yearEstablished}
                </Typography>
                <Typography variant="body2">
                  <strong>Languages:</strong> {selectedVendor.languages.join(', ')}
                </Typography>

                <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                  Services
                </Typography>
                <Box mb={2}>
                  {selectedVendor.services.map((service, index) => (
                    <Chip
                      key={index}
                      label={service}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>

                <Typography variant="subtitle1" gutterBottom>Contact Information</Typography>
                <Typography variant="body2">
                  <strong>Name:</strong> {selectedVendor.contactInfo.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {selectedVendor.contactInfo.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {selectedVendor.contactInfo.phone}
                </Typography>
                {selectedVendor.contactInfo.role && (
                  <Typography variant="body2">
                    <strong>Role:</strong> {selectedVendor.contactInfo.role}
                  </Typography>
                )}

                <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                  Location
                </Typography>
                <Typography variant="body2">
                  {selectedVendor.city}, {selectedVendor.province}
                </Typography>
                <Typography variant="body2">
                  {selectedVendor.postalCode}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}; 