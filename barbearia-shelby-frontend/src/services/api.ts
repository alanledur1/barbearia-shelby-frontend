import axios from 'axios';

const API_BASE_URL = 'https://api.seuservidor.com'; // Substitua pela URL da sua API

export const fetchAppointments = async (barberId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/barbers/${barberId}/appointments`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar agendamentos: ' + error.message);
  }
};

export const fetchBarberInfo = async (barberId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/barbers/${barberId}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar informações do barbeiro: ' + error.message);
  }
};