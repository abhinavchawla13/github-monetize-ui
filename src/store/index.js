import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";


Vue.use(Vuex)

/* eslint-disable no-new */
const store = new Vuex.Store({
  modules: {
  },
  state: {
    currentUser: {
      loggedIn: false,
      firebaseId: '',
      photoURL: '',
      githubId: '',
      email: '',
      paymentPointer: ''
    }
  },
  plugins: [createPersistedState()],
  mutations: {
    loginUser(state, userInfo) {
      const { loggedIn, firebaseId, photoURL, githubId, email, paymentPointer } = userInfo;
      state.currentUser.loggedIn = loggedIn;
      state.currentUser.firebaseId = firebaseId;
      state.currentUser.photoURL = photoURL;
      state.currentUser.githubId = githubId;
      state.currentUser.email = email;
      state.currentUser.paymentPointer = paymentPointer;

    },
    logoutUser(state) {
      state.currentUser.loggedIn = false;
      state.currentUser.firebaseId = '';
      state.currentUser.photoURL = '';
      state.currentUser.githubId = '';
      state.currentUser.email = '';
      state.currentUser.paymentPointer = '';
    },
    updatePaymentPointer(state, paymentPointer) {
      state.currentUser.paymentPointer = paymentPointer
    }
  },
})

export default store
