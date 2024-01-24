import axios from 'axios';
//import { v4 as uuidv4 } from 'uuid'; // Import the v4 function from the uuid libra

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
    // Allow the method to accept an optional setId parameter
    const url = setId ? `/circles/${setId}` : '/circles';
    return apiClient.get(url);
  },

  get(url, config) {
    return apiClient.get(url, config);
  },

};