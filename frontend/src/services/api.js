/**
 * API Service - Handles all backend communication
 * Toggles between mock data and real API based on environment
 */

import axios from 'axios';
import { mockData } from './mockData';
import { API_URL, USE_MOCK_DATA } from '../utils/constants';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

/**
 * API Methods
 */
export const api = {
  /**
   * Create a new vendor
   * @param {Object} vendorData - { company_name, contact_email, ein, address, contact_phone }
   * @returns {Promise<Object>} - { id, status, onboarding_progress, ... }
   */
  createVendor: async (vendorData) => {
    if (USE_MOCK_DATA) {
      return mockData.createVendor(vendorData);
    }

    try {
      const response = await apiClient.post('/vendors', vendorData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create vendor: ${error.message}`);
    }
  },

  /**
   * Get vendor onboarding status
   * @param {string} vendorId
   * @returns {Promise<Object>} - { vendor_id, status, progress, documents, ... }
   */
  getVendorStatus: async (vendorId) => {
    if (USE_MOCK_DATA) {
      return mockData.getStatus(vendorId);
    }

    try {
      const response = await apiClient.get(`/vendors/${vendorId}/status`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get vendor status: ${error.message}`);
    }
  },

  /**
   * Get presigned URL for document upload
   * @param {string} vendorId
   * @param {string} documentType - w9, insurance, diversity_cert, etc.
   * @param {string} filename
   * @returns {Promise<Object>} - { upload_url, document_id, ... }
   */
  getUploadUrl: async (vendorId, documentType, filename) => {
    if (USE_MOCK_DATA) {
      return mockData.getUploadUrl(vendorId, documentType, filename);
    }

    try {
      const response = await apiClient.post('/documents/upload', {
        vendor_id: vendorId,
        document_type: documentType,
        filename
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get upload URL: ${error.message}`);
    }
  },

  /**
   * Upload file to S3 using presigned URL
   * @param {string} uploadUrl - Presigned S3 URL
   * @param {File} file
   * @returns {Promise<void>}
   */
  uploadFile: async (uploadUrl, file) => {
    if (USE_MOCK_DATA) {
      return mockData.uploadToS3(uploadUrl, file);
    }

    try {
      // For real S3 upload, use PUT request with file as body
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  },

  /**
   * Calculate vendor risk score
   * @param {string} vendorId
   * @returns {Promise<Object>} - { overall_score, breakdown, risk_level, ... }
   */
  calculateRiskScore: async (vendorId) => {
    if (USE_MOCK_DATA) {
      return mockData.calculateRiskScore(vendorId);
    }

    try {
      const response = await apiClient.post(`/vendors/${vendorId}/risk-score`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to calculate risk score: ${error.message}`);
    }
  },

  /**
   * Get existing risk score
   * @param {string} vendorId
   * @returns {Promise<Object>} - { overall_score, breakdown, risk_level, ... }
   */
  getRiskScore: async (vendorId) => {
    if (USE_MOCK_DATA) {
      return mockData.getRiskScore(vendorId);
    }

    try {
      const response = await apiClient.get(`/vendors/${vendorId}/risk-score`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get risk score: ${error.message}`);
    }
  },

  /**
   * Approve or reject a vendor
   * @param {string} vendorId
   * @param {Object} approvalData - { approved: boolean, comments, approver_email }
   * @returns {Promise<Object>} - { status, approved_at, message }
   */
  approveVendor: async (vendorId, approvalData) => {
    if (USE_MOCK_DATA) {
      return mockData.approveVendor(vendorId, approvalData);
    }

    try {
      const response = await apiClient.post(`/vendors/${vendorId}/approve`, approvalData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to approve vendor: ${error.message}`);
    }
  },
};

/**
 * Helper function to upload document (combines getting URL and uploading)
 * @param {string} vendorId
 * @param {string} documentType
 * @param {Object} uploadData - { document_type, filename, size }
 * @returns {Promise<Object>}
 */
export const uploadDocument = async (vendorId, documentType, uploadData) => {
  if (USE_MOCK_DATA) {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockData.uploadDocument(vendorId, documentType, uploadData);
  }

  try {
    // Get presigned URL
    const { upload_url, document_id } = await api.getUploadUrl(
      vendorId,
      documentType,
      uploadData.filename
    );

    // Upload file to S3
    if (uploadData.file) {
      await api.uploadFile(upload_url, uploadData.file);
    }

    return { document_id, status: 'uploaded' };
  } catch (error) {
    throw new Error(`Failed to upload document: ${error.message}`);
  }
};

// Export individual functions for easier imports
export const createVendor = api.createVendor;
export const getVendorStatus = api.getVendorStatus;
export const getRiskScore = api.getRiskScore;
export const calculateRiskScore = api.calculateRiskScore;
export const approveVendor = api.approveVendor;

export default api;
