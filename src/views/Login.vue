<template>
  <div>
    <div>login</div>
    <button @click="loginWithGithub">sign in with github</button>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import router from "../router";
import store from "../store";
import axios from "axios";

export default {
  methods: {
    loginWithGithub: async function() {
      const provider = new firebase.auth.GithubAuthProvider();
      provider.setCustomParameters({
        allow_signup: "false"
      });
      // add scope to get access to all the repos
      provider.addScope("repo");

      try {
        const result = await firebase.auth().signInWithPopup(provider);
        // The signed-in user info.
        const user = result.user;

        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        // TODO: Encrypt it
        const githubToken = result.credential.accessToken;

        // get firebase token
        const firebaseToken = await firebase.auth().currentUser.getIdToken();
        // make call to the backend to login user (or create if it's first time)
        const resp = await axios.post(
          `${process.env.VUE_APP_API_URL}/auth/login`,
          {
            email: user.email,
            photoURL: user.photoURL,
            githubToken: githubToken
          },
          {
            headers: { Authorization: "Bearer " + firebaseToken }
          }
        );

        store.commit("loginUser", {
          loggedIn: true,
          firebaseId: user.uid,
          photoURL: user.photoURL,
          githubId: resp.data.user.githubId,
          email: user.email,
          paymentPointer: resp.data.user.paymentPointer
        });
        router.push("/", () => {});
      } catch (error) {
        console.log(error);
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // // The email of the user's account used.
        // var email = error.email;
        // // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // ...
      }
    }
  }
};
</script>

<style scoped>
</style>