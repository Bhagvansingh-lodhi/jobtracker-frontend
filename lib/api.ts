import axios from 'axios';

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    'https://jobtracker-backend-0cwx.onrender.com/api',

  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
  },
});