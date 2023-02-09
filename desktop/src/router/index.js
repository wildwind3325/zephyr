import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Master from '../views/Master.vue';
import Home from '../views/Home.vue';
import Logout from '../views/Logout.vue';
import NotFound from '../views/NotFound.vue';
import Calendar from '../views/Calendar.vue';

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
  }, {
    path: '/system/orgnization',
    name: 'Orgnization',
    component: () => import('../views/system/Orgnization.vue')
  }, {
    path: '/system/station',
    name: 'Station',
    component: () => import('../views/system/Station.vue')
  }, {
    path: '/system/menu',
    name: 'Menu',
    component: () => import('../views/system/Menu.vue')
  }, {
    path: '/system/role',
    name: 'Role',
    component: () => import('../views/system/Role.vue')
  }, {
    path: '/system/user',
    name: 'User',
    component: () => import('../views/system/User.vue')
  }, {
    path: '/system/dictionary',
    name: 'Dictionary',
    component: () => import('../views/system/Dictionary.vue')
  }, {
    path: '/system/configuration',
    name: 'Configuration',
    component: () => import('../views/system/Configuration.vue')
  }, {
    path: '/system/i18n',
    name: 'I18n',
    component: () => import('../views/system/I18n.vue')
  }, {
    path: '/system/log',
    name: 'Log',
    component: () => import('../views/system/Log.vue')
  }, {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar
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