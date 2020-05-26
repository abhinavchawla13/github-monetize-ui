import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import firebase from 'firebase/app'

import '@/assets/styles/index.css';
import '@/assets/styles/markdown.css';
import router from './router';
import store from './store';
import moment from 'moment';

import VueNoty from 'vuejs-noty';
// import VueMeta from 'vue-meta';


const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let app;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('MMMM Do YYYY, h:mm a')
  }
});

Vue.use(VueNoty, {
  theme: 'relax',
  layout: 'bottomRight',
  timeout: 3000,
})

// Vue.use(VueMeta)

// eslint-disable-next-line no-unused-vars
firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    app =
      new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount('#app')
  }
})


