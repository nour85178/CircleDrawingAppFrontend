import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  setBaseUrl(baseUrl) {
    apiClient.defaults.baseURL = baseUrl;
  },

  submitCircle(circleData,requestData) {
    return apiClient.post('/circles', circleData, requestData);
  },

  getCirclesBySetId(setId) {
    return apiClient.get(`/circles/${setId}`);
  },
};