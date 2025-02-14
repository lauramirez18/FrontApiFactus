
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Login from '../views/login.vue'
import Home from '../views/Home.vue'



const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {

    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: Login
      },
      {
        path: 'inicio',
        name: 'Home',
        component: Home
      },

     
    ]
  },


]

export const router = createRouter({
  history: createWebHistory(),
  routes
})