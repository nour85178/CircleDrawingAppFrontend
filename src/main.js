import { createApp } from 'vue'
import App from './App.vue'
import apiService from '@/services/apiService';
import router from './router';


// Set the base URL for API calls
apiService.setBaseUrl('https://localhost:5001/api');

// Create the Vue app and use the router
const app = createApp(App);
app.use(router);


// Mount the app to the element with the id 'app'
app.mount('#app');
