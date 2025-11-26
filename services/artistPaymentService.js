import { getData, postData, putData, deleteData, postMultipartData } from "./apiService";

// ==========================================
// ARTIST PAYMENT & WITHDRAWAL API SERVICES
// ==========================================

// 🏦 BANK DETAILS MANAGEMENT
export const addUpdateBankDetails = async (formData) => {
  return await postMultipartData("/artist-payment/bank-details", formData);
};

export const getBankDetails = async (artistId) => {
  return await getData(`/artist-payment/bank-details/${artistId}`);
};

// 💰 WITHDRAWAL SYSTEM
export const createWithdrawalRequest = async (requestData) => {
  return await postData("/artist-payment/withdrawal-request", requestData);
};

export const getWithdrawalHistory = async (artistId, params = {}) => {
  return await getData(`/artist-payment/withdrawal-history/${artistId}`, params);
};

export const cancelWithdrawalRequest = async (requestData) => {
  return await postData("/artist-payment/cancel-withdrawal", requestData);
};

export const getEarningsSummary = async (artistId) => {
  return await getData(`/artist-payment/earnings-summary/${artistId}`);
};

// 👨‍💼 ADMIN APIS
export const getPendingBankVerifications = async (params = {}) => {
  return await getData("/admin/artist-payment/pending-verifications", params);
};

export const verifyRejectBankDetails = async (verificationData) => {
  return await postData("/admin/artist-payment/verify-bank", verificationData);
};

export const getWithdrawalRequests = async (params = {}) => {
  return await getData("/admin/artist-payment/withdrawal-requests", params);
};

export const processWithdrawalRequest = async (processData) => {
  return await postData("/admin/artist-payment/process-withdrawal", processData);
};

export const markPaymentCompleted = async (completionData) => {
  return await postData("/admin/artist-payment/mark-completed", completionData);
};

export const getPaymentDashboardStats = async () => {
  return await getData("/admin/artist-payment/dashboard-stats");
};

// 📊 EARNINGS & ANALYTICS
export const getArtistEarningsHistory = async (params = {}) => {
  return await getData("/admin/artist-payment/earnings-history", params);
};

export const getPaymentAnalytics = async (params = {}) => {
  return await getData("/admin/artist-payment/analytics", params);
};

// 🔄 BOOKING COMPLETION (Auto Points Award)
export const completeBookingWithPoints = async (bookingData) => {
  return await putData("/booking/complete", bookingData);
};

// 📋 UTILITY FUNCTIONS
export const validateIFSCCode = async (ifscCode) => {
  return await getData(`/artist-payment/validate-ifsc/${ifscCode}`);
};

export const getBankDetailsByIFSC = async (ifscCode) => {
  return await getData(`/artist-payment/bank-info/${ifscCode}`);
};

// 📄 DOCUMENT MANAGEMENT
export const uploadBankDocument = async (documentData) => {
  return await postMultipartData("/artist-payment/upload-document", documentData);
};

export const downloadBankDocument = async (documentId) => {
  return await getData(`/artist-payment/download-document/${documentId}`);
};

// 🔐 SECURITY & VALIDATION
export const verifyBankAccount = async (verificationData) => {
  return await postData("/artist-payment/verify-account", verificationData);
};

export const checkWithdrawalEligibility = async (artistId) => {
  return await getData(`/artist-payment/withdrawal-eligibility/${artistId}`);
};

// 📈 REPORTS & EXPORTS
export const exportPaymentReport = async (params = {}) => {
  return await getData("/admin/artist-payment/export-report", params);
};

export const exportWithdrawalReport = async (params = {}) => {
  return await getData("/admin/artist-payment/export-withdrawals", params);
};

export const exportEarningsReport = async (params = {}) => {
  return await getData("/admin/artist-payment/export-earnings", params);
};

// 🔔 NOTIFICATIONS
export const sendPaymentNotification = async (notificationData) => {
  return await postData("/admin/artist-payment/send-notification", notificationData);
};

export const getPaymentNotifications = async (artistId, params = {}) => {
  return await getData(`/artist-payment/notifications/${artistId}`, params);
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Format currency for display
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Convert points to INR
export const pointsToINR = (points) => {
  return (points / 1000) * 100; // 1000 points = ₹100
};

// Convert INR to points
export const inrToPoints = (amount) => {
  return (amount / 100) * 1000; // ₹100 = 1000 points
};

// Validate withdrawal amount
export const validateWithdrawalAmount = (points) => {
  const minPoints = 1000; // Minimum 1000 points (₹100)
  return {
    isValid: points >= minPoints,
    minAmount: pointsToINR(minPoints),
    message: points < minPoints ? `Minimum withdrawal amount is ₹${pointsToINR(minPoints)}` : null
  };
};

// Generate request ID
export const generateRequestId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `WR${timestamp}${random}`;
};

// Format bank account number for display
export const formatAccountNumber = (accountNumber) => {
  if (!accountNumber) return '';
  return `****${accountNumber.slice(-4)}`;
};

// Validate IFSC code format
export const validateIFSCFormat = (ifscCode) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifscCode);
};

// Calculate processing time
export const calculateProcessingTime = (createdAt, completedAt) => {
  if (!completedAt) return null;
  
  const created = new Date(createdAt);
  const completed = new Date(completedAt);
  const diffTime = Math.abs(completed - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    approved: 'blue',
    processing: 'purple',
    completed: 'green',
    rejected: 'red',
    verified: 'green',
    unverified: 'gray'
  };
  
  return colors[status] || 'gray';
};

export default {
  // Bank Details
  addUpdateBankDetails,
  getBankDetails,
  
  // Withdrawals
  createWithdrawalRequest,
  getWithdrawalHistory,
  cancelWithdrawalRequest,
  getEarningsSummary,
  
  // Admin Functions
  getPendingBankVerifications,
  verifyRejectBankDetails,
  getWithdrawalRequests,
  processWithdrawalRequest,
  markPaymentCompleted,
  getPaymentDashboardStats,
  
  // Utilities
  formatCurrency,
  pointsToINR,
  inrToPoints,
  validateWithdrawalAmount,
  generateRequestId,
  formatAccountNumber,
  validateIFSCFormat,
  calculateProcessingTime,
  getStatusColor
};
