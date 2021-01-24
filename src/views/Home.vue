<template>
  <div class="home">
    <PaymentWallet />
    <ConnectRepo />
    <RepoTable />
  </div>
</template>

<script>
// @ is an alias to /src
import PaymentWallet from "@/components/PaymentWallet.vue";
import RepoTable from "@/components/RepoTable.vue";
import ConnectRepo from "@/components/ConnectRepo.vue";

import * as firebase from "firebase/app";
import "firebase/auth";
import store from "../store";
import axios from "axios";

export default {
  name: "Home",
  components: {
    PaymentWallet,
    RepoTable,
    ConnectRepo
  },
  async mounted() {
    try {
      await this.getCurrentUserInfo();
    } catch (error) {
      // console.log(error);
    }
  },
  methods: {
    getCurrentUserInfo: async function() {
      const firebaseToken = await firebase.auth().currentUser.getIdToken();
      const resp = await axios.get(`${process.env.VUE_APP_API_URL}/users/`, {
        headers: { Authorization: "Bearer " + firebaseToken }
      });
      store.commit("updateUserInfo", {
        paymentPointers: resp.data.user.paymentPointers,
        repos: resp.data.user.repos
      });
    }
  }
};
</script>
