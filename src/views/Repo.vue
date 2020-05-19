<template>
  <div>
    <RepoInformation />
    <Markdown />
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import axios from "axios";
import RepoInformation from "@/components/RepoInformation.vue";
import Markdown from "@/components/Markdown.vue";

export default {
  props: ["name"],
  components: { RepoInformation, Markdown },
  data() {
    return {
      repos: []
    };
  },
  methods: {
    getReposInfo: async function() {
      try {
        // get firebase token
        const firebaseToken = await firebase.auth().currentUser.getIdToken();
        // make call to the backend to login user (or create if it's first time)
        const result = await axios.get(
          `${process.env.VUE_APP_API_URL}/users/repos`,
          {
            headers: { Authorization: "Bearer " + firebaseToken }
          }
        );

        console.log(result);
        this.repos = result.data.repos;
        console.log(this.repos);
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
  },
  mounted() {
    this.getReposInfo();
  }
};
</script>
<style lang="scss" scoped>
</style>