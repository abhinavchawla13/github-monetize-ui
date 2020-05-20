<template>
  <div id="app">
    <Navigation
      v-if="isLoggedIn"
      @userLogout="completeLogout($event)"
      @userLogin="completeLogin($event)"
      v-click-outside="onClickOutside"
      :hideShowRepos="hideShowReposInc"
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
import vClickOutside from "v-click-outside";

export default {
  components: {
    Navigation
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data() {
    return {
      userLoggedIn: false,
      hideShowReposInc: 0
    };
  },
  computed: {
    isLoggedIn() {
      return store.state.currentUser.loggedIn;
    }
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
  methods: {
    completeLogout: function(val) {
      if (val) {
        this.userLoggedIn = false;
        router.push("/login", () => {});
      }
    },
    completeLogin: function(val) {
      if (val) {
        this.userLoggedIn = true;
        router.push("/", () => {});
      }
    },
    onClickOutside() {
      this.hideShowReposInc += 1;
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
