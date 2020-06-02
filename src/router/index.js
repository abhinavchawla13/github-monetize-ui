import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../views/Login.vue";
import Repo from "../views/Repo.vue";
import View from "../views/View.vue";
import VueMeta from 'vue-meta';

// const Home = () => import('../views/Home.vue')
// const Login = () => import('../views/Login.vue')
// const Repo = () => import('../views/Repo.vue')
// const View = () => import('../views/View.vue')

import * as firebase from "firebase/app";
import "firebase/auth";

Vue.use(VueMeta);
Vue.use(VueRouter)

const routes = [

  {
    path: "/view/:id",
    name: "view",
    props: true,
    component: View
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/repo/:id",
    name: "repo",
    component: Repo,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    name: 'dashboard',
    component: Home,
    meta: { requiresAuth: true }
  },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = firebase.auth().currentUser;
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  }
  else {
    next();
  }
})
export default router
