import { createMemoryHistory, createRouter } from 'vue-router';

const routes = [
  { 
    path: '/clients/', 
    name: 'clients', 
    component: () => import('../pages/DataMain.vue'), 
    meta: {
      layout: 'Admin',
      requiresAuth: true,
    }, 
  }
];

export const DataRouter = createRouter({
  history: createMemoryHistory(),
  routes,
});


