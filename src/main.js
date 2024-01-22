import { createApp } from 'vue'
import App from './App.vue'
import apiService from '@/services/apiService';

// Set the base URL for API calls
apiService.setBaseUrl('https://localhost:5001/api');
createApp(App).mount('#app')
