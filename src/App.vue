<template>
  <div id="app">
    <Navigation
      v-if="isLoggedIn"
      v-on:userLogout="completeLogout($event)"
      v-on:userLogin="completeLogin($event)"
    />
    <router-view />
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import router from "@/router";
import Navigation from "@/components/Navigation.vue";
import store from "@/store";

export default {
  components: {
    Navigation
  },
  data() {
    return {
      userLoggedIn: false
    };
  },
  mounted() {
    const user = firebase.auth().currentUser;
    if (user) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
      router.push("/login", () => {});
    }
  },
  computed: {
    isLoggedIn() {
      return store.state.currentUser.loggedIn;
    }
  },
  methods: {
    completeLogout: function(val) {
      console.log(val);
      if (val) {
        this.userLoggedIn = false;
        router.push("/login", () => {});
      }
    },
    completeLogin: function(val) {
      console.log("completeLogin", val);
      if (val) {
        this.userLoggedIn = true;
        router.push("/", () => {});
      }
    }
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
</style>
