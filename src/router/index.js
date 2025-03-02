
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Exam from '../views/Exam.vue';

const routes = [
 { path: '/', component: Home },
 { path: '/exam', name: 'exam', component: Exam },
];

const router = createRouter({
 history: createWebHistory(),
 routes,
});

export default router;
