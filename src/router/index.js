import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/pages/Home.vue';
import Exam from '../views/pages/Exam.vue';
import LogIn from '../views/pages/LogIn.vue';
import dashboard from '../components/dashboard/Dashboard.vue';

const routes = [
  { path: '/', name: 'login', component: LogIn },
  { path: '/home', name: 'home', component: Home },
  { path: '/examPage', name: 'examPage', component: Exam },
  { path: '/result', name: 'ResultPage', component: () => import('../views/pages/ResultPage.vue') },
  { path: '/systems', name: 'SystemsPage', component: () => import('../views/dashboard/SystemsPage.vue') },
  { path: '/password-reset', name: 'password-reset', component: () => import('../views/pages/password-reset.vue') },
  { path: '/:catchAll(.*)', name: 'error', component: () => import('@/views/pages/Error404.vue') },
  // dashboard
  {
    path: '/dashboard',
    component: dashboard,
    children: [
      {
        path: '',
        name: 'dashboard-home',
        component: () => import('@/views/dashboard/DashboardHome.vue')
      },
      {
        path: 'employees',
        name: 'employees',
        component: () => import('@/views/dashboard/EmployeeList.vue')
      },
      {
        path: 'create-exam',
        name: 'create-exam',
        component: () => import('@/views/dashboard/CreateExams.vue')
      },
      {
        path: 'exams',
        name: 'exams',
        component: () => import('@/views/dashboard/AllExams.vue')
      },
      {
        path: 'instructors',
        name: 'instructors',
        component: () => import('@/views/dashboard/InstructorList.vue')
      },
      {
        path: 'courses',
        name: 'courses',
        component: () => import('@/views/dashboard/CourseList.vue')
      },
      {
        path: 'scholarships',
        name: 'scholarships',
        component: () => import('@/views/dashboard/ScholarshipList.vue')
      },
      {
        path: 'exams/:id/edit',
        name: 'edit-exam',
        component: () => import('@/views/dashboard/EditExam.vue')
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/views/dashboard/RoleList.vue')
      }
      
    
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
