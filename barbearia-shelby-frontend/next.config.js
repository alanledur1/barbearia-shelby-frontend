module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Adicione os domínios permitidos para imagens
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api', // URL da API
  },
};