import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/pages/Home.vue';
import Exam from '../views/pages/Exam.vue';
import LogIn from '../views/pages/LogIn.vue';

const routes = [
  { path: '/', name: 'login', component: LogIn },
  { path: '/home', name: 'home', component: Home },
  { path: '/examPage', name: 'examPage', component: Exam },
  { path: '/result', name: 'ResultPage', component: () => import('../views/pages/ResultPage.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
