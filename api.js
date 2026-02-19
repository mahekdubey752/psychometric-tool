/**
 * Psychometric Assessment Platform - API Service
 * Handles all backend API calls
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function for making API calls
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'An error occurred');
  }
  
  return response.json();
};

// ==================== Authentication API ====================

export const login = async (email, password) => {
  return apiCall('/auth/login', 'POST', { email, password });
};

export const register = async (email, password, fullName) => {
  return apiCall('/auth/register', 'POST', { email, password, full_name: fullName });
};

export const getCurrentUser = async () => {
  return apiCall('/auth/me', 'GET');
};

// ==================== Assessment API ====================

export const startAssessment = async () => {
  return apiCall('/assessment/start', 'POST');
};

export const getNextTriplet = async () => {
  return apiCall('/assessment/next-triplet', 'GET');
};

export const submitResponse = async (sessionId, tripletId, mostLikelyId, leastLikelyId) => {
  return apiCall('/assessment/submit-response', 'POST', {
    session_id: sessionId,
    triplet_id: tripletId,
    most_likely_statement_id: mostLikelyId,
    least_likely_statement_id: leastLikelyId,
  });
};

export const completeAssessment = async (sessionId) => {
  return apiCall('/assessment/complete', 'POST', { session_id: sessionId });
};

// ==================== Results API ====================

export const getResults = async (sessionId) => {
  return apiCall(`/results/${sessionId}`, 'GET');
};

export const getLatestResults = async () => {
  return apiCall('/results/latest', 'GET');
};

// ==================== Themes API ====================

export const getThemes = async () => {
  return apiCall('/themes', 'GET');
};

// ==================== Demo Data API ====================

export const createSampleData = async () => {
  return apiCall('/demo/create-sample-data', 'POST');
};

export default {
  login,
  register,
  getCurrentUser,
  startAssessment,
  getNextTriplet,
  submitResponse,
  completeAssessment,
  getResults,
  getLatestResults,
  getThemes,
  createSampleData,
};
