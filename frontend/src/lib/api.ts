import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export async function fetchOverview() {
  const res = await api.get(`/analytics/overview`);
  return res.data.data;
}

export async function fetchHoneypots() {
  const res = await api.get(`/honeypots?page=1&per_page=100`);
  return res.data.data;
}

export async function fetchHoneypotById(id: string) {
  const res = await api.get(`/honeypots/${id}`);
  return res.data.data;
}

export async function createHoneypot(data: { name: string; type: string; port: number | null }) {
  const res = await api.post(`/honeypots`, data);
  return res.data.data;
}

export async function updateHoneypot(id: string, data: { name?: string; metadata?: any }) {
  const res = await api.patch(`/honeypots/${id}`, data);
  return res.data.data;
}

export async function deleteHoneypot(id: string) {
  const res = await api.delete(`/honeypots/${id}`);
  return res.data.data;
}

export async function startHoneypot(id: string) {
  const res = await api.post(`/honeypots/${id}/start`);
  return res.data.data;
}

export async function stopHoneypot(id: string) {
  const res = await api.post(`/honeypots/${id}/stop`);
  return res.data.data;
}

export async function fetchEvents() {
  const res = await api.get(`/events?page=1&per_page=20`);
  return res.data.data;
}

export async function triggerDemoAttack() {
  const res = await api.post(`/internal/demo-event`);
  return res.data.data;
}

export default api;
