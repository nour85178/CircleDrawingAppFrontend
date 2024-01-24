//import Vue from 'vue';
//import VueRouter from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import CircleDrawing from '@/components/CircleDrawing.vue';


const routes = [
    {
      path: '/:setId?',  // This allows the route to have an optional parameter 'setId'
      name: 'CircleDrawing',
      component: CircleDrawing,
    },
    {
        path: '/new/:newId',
        name: 'CircleDrawingWithNewId',
        component: CircleDrawing,
      },
    // Add other routes as needed
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

export default router;
