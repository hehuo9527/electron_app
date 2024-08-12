import { createRouter, createWebHistory } from 'vue-router'
import Camera from '../components/views/Camera.vue'
import Login from '../components/views/Login.vue'
import UserLogin from '@renderer/components/views/UserLogin.vue'

export const routes = [
  {
    path: '/Camera',
    name: 'Remote Camera Setting',
    component: Camera
  },
  {
    path: '/Login',
    name: 'Login',
    component: UserLogin
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
