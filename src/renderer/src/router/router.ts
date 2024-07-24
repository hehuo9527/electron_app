import { createRouter, createWebHistory } from 'vue-router'
import Camera from '../components/views/Camera.vue'
import Login from '../components/views/Login.vue'

export const routes = [
  {
    path: '/Camera',
    name: 'Remote Camera Setting',
    component: Camera
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
