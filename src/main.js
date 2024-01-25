import { createApp } from 'vue'
import App from './App.vue'
import apiService from '@/services/apiService';
import router from './router';


apiService.setBaseUrl('https://localhost:5001/api');

const app = createApp(App);
app.use(router);


app.mount('#app');
