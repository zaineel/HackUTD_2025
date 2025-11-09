// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Use mock data if no API URL is configured
export const USE_MOCK_DATA = !import.meta.env.VITE_API_URL;

// Document types
export const DOCUMENT_TYPES = {
  W9: 'w9',
  INSURANCE: 'insurance',
  DIVERSITY_CERT: 'diversity_cert',
  BCP: 'bcp',
  SOC2: 'soc2',
  ISO_CERT: 'iso_cert'
};

// Document labels
export const DOCUMENT_LABELS = {
  w9: 'W-9 Tax Form',
  insurance: 'Insurance Certificate',
  diversity_cert: 'Diversity Certification',
  bcp: 'Business Continuity Plan',
  soc2: 'SOC 2 Report',
  iso_cert: 'ISO Certification'
};

// Vendor statuses
export const VENDOR_STATUS = {
  SUBMITTED: 'submitted',
  DOCUMENTS_PENDING: 'documents_pending',
  UNDER_REVIEW: 'under_review',
  RISK_ASSESSMENT: 'risk_assessment',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ONBOARDING_COMPLETE: 'onboarding_complete'
};

// Status labels and colors
export const STATUS_CONFIG = {
  submitted: { label: 'Submitted', color: 'blue' },
  documents_pending: { label: 'Documents Pending', color: 'yellow' },
  under_review: { label: 'Under Review', color: 'yellow' },
  risk_assessment: { label: 'Risk Assessment', color: 'yellow' },
  approved: { label: 'Approved', color: 'green' },
  rejected: { label: 'Rejected', color: 'red' },
  onboarding_complete: { label: 'Onboarding Complete', color: 'green' }
};

// Risk levels
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Risk level configuration
export const RISK_CONFIG = {
  low: { label: 'Low Risk', color: 'green', threshold: 30 },
  medium: { label: 'Medium Risk', color: 'yellow', threshold: 60 },
  high: { label: 'High Risk', color: 'orange', threshold: 80 },
  critical: { label: 'Critical Risk', color: 'red', threshold: 100 }
};

// Get risk level from score
export const getRiskLevel = (score) => {
  if (score < 30) return 'low';
  if (score < 60) return 'medium';
  if (score < 80) return 'high';
  return 'critical';
};

// Local storage keys
export const STORAGE_KEYS = {
  VENDOR_ID: 'vendorId',
  VENDOR_DATA: 'vendorData'
};
