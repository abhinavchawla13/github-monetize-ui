import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

/* eslint-disable no-new */
const store = new Vuex.Store({
  modules: {},
  state: {
    currentUser: {
      loggedIn: false,
      firebaseId: "",
      photoURL: "",
      githubId: "",
      email: "",
      paymentPointers: "",
      repos: []
    }
  },
  plugins: [createPersistedState()],
  mutations: {
    loginUser(state, userInfo) {
      const {
        loggedIn,
        firebaseId,
        photoURL,
        githubId,
        email,
        paymentPointers
      } = userInfo;
      state.currentUser.loggedIn = loggedIn;
      state.currentUser.firebaseId = firebaseId;
      state.currentUser.photoURL = photoURL;
      state.currentUser.githubId = githubId;
      state.currentUser.email = email;
      state.currentUser.paymentPointers = paymentPointers;
    },
    logoutUser(state) {
      state.currentUser.loggedIn = false;
      state.currentUser.firebaseId = "";
      state.currentUser.photoURL = "";
      state.currentUser.githubId = "";
      state.currentUser.email = "";
      state.currentUser.paymentPointers = "";
    },
    updatePaymentPointers(state, paymentPointers) {
      state.currentUser.paymentPointers = paymentPointers;
    },
    updateReposInformation(state, repos) {
      state.currentUser.repos = repos;
    },
    updateUserInfo(state, userInfo) {
      const { paymentPointers, repos } = userInfo;
      state.currentUser.paymentPointers = paymentPointers;
      state.currentUser.repos = repos;
    }
  }
});

export default store;
