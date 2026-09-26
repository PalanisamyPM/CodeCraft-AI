import axios from 'axios';

// The Flask backend. The AI provider's API key lives only on the backend —
// the frontend never sees it.
// Locally falls back to http://localhost:5000/api. In production, use VITE_API_BASE_URL env var.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const generateCode = async (prompt, language) => {
  const response = await api.post('/generate', { prompt, language });
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};

export const getGenerationById = async (id) => {
  const response = await api.get(`/history/${id}`);
  return response.data;
};

export default api;
