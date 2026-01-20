export const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export const normalizeUrl = (url) => {
  if (!url) return url;
  // troca qualquer 'localhost' ou IP local pelo host público
  return url
    .replace('localhost', '200.144.255.186')
    .replace('127.0.0.1', '200.144.255.186')
    .replace(/192\.168\.\d+\.\d+/g, '200.144.255.186');
};