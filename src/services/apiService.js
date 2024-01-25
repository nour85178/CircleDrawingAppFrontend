import axios from 'axios';
//import { v4 as uuidv4 } from 'uuid'; 

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
    const url = setId ? `/circles/${setId}` : '/circles';
    return apiClient.get(url);
  },

  get(url, config) {
    return apiClient.get(url, config);
  },

};