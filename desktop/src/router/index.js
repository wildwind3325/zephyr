import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Master from '../views/Master.vue';
import Home from '../views/Home.vue';
import Logout from '../views/Logout.vue';
import NotFound from '../views/NotFound.vue';

const routes = [{
  path: '/',
  name: 'Login',
  component: Login
}, {
  path: '/home',
  name: 'Master',
  component: Master,
  children: [{
    path: '',
    name: 'Home',
    component: Home
  }]
}, {
  path: '/logout',
  name: 'Logout',
  component: Logout
}, {
  path: '/:pathMatch(.*)',
  name: 'NotFound',
  component: NotFound
}];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;