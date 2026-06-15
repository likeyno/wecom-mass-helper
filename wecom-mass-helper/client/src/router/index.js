import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/tasks',
  },
  {
    path: '/tasks',
    name: 'TaskList',
    component: () => import('../views/TaskList.vue'),
  },
  {
    path: '/tasks/create',
    name: 'TaskCreate',
    component: () => import('../views/TaskCreate.vue'),
  },
  {
    path: '/tasks/:id',
    name: 'TaskDetail',
    component: () => import('../views/TaskDetail.vue'),
  },
  {
    path: '/templates',
    name: 'TemplateList',
    component: () => import('../views/TemplateList.vue'),
  },
  {
    path: '/templates/create',
    name: 'TemplateCreate',
    component: () => import('../views/TemplateForm.vue'),
  },
  {
    path: '/templates/:id',
    name: 'TemplateEdit',
    component: () => import('../views/TemplateForm.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
