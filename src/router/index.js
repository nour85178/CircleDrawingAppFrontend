import { createRouter, createWebHistory } from 'vue-router';
import CircleDrawing from '@/components/CircleDrawing.vue';


const routes = [
    {
      path: '/:setId?',  
      name: 'CircleDrawing',
      component: CircleDrawing,
    },
    /*{
        path: '/:newId',
        name: 'CircleDrawingWithNewId',
        component: CircleDrawing,
      },*/
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

export default router;
