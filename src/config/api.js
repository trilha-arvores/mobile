//// filepath: /home/jo-o-victor/Documents/projeto/mobile/src/config/api.js
export const API_BASE = 'http://200.144.255.186:2281'; // use 5000 se for essa a porta pública

export const normalizeUrl = (url) => {
  if (!url) return url;
  // troca qualquer 'localhost' ou IP local pelo host público
  return url
    .replace('localhost', '200.144.255.186')
    .replace('127.0.0.1', '200.144.255.186')
    .replace(/192\.168\.\d+\.\d+/g, '200.144.255.186');
};