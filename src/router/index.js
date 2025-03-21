import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Exam from '../views/Exam.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/examPage', name: 'examPage', component: Exam },
  { path: '/result', name: 'ResultPage', component: () => import('../views/ResultPage.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
