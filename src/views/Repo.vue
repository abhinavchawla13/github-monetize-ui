<template>
  <div>
    <RepoInformation
      v-if="currentRepoLoaded"
      :currentrepo="currentRepo"
      v-on:editOn="openEditer"
      v-on:saveMarkdown="saveMarkdown"
      v-on:branchChanged="branchChanged"
      v-on:paymentPointerIdChanged="changePaymentPointerId"
      v-on:publishModalOpen="publishModalOpen"
      :publishedSuccess="publishedSuccessfully"
    />
    <Markdown
      v-if="currentRepoLoaded"
      :currentrepomd="currentRepoMarkdown"
      :openEditor="openEditerVal"
      :currentrepoId="currentRepo._id"
      :currentBranch="currentBranch"
      :currentPaymentPointerId="currentPaymentPointerId"
    />
    <PublishModal
      :branch="currentBranch"
      :currentRepo="currentRepo"
      :showModal="showPublishModal"
      v-on:closePublishModal="closePublishModal"
      v-if="showPublishModal"
      @closePointer="toggleWalletModal($event)"
    />
  </div>
</template>

<script>
import RepoInformation from "@/components/RepoInformation.vue";
import Markdown from "@/components/Markdown.vue";
import axios from "axios";
import * as firebase from "firebase";
import PublishModal from "@/components/PublishModal.vue";
import store from "../store";

export default {
  components: { RepoInformation, Markdown, PublishModal },
  props: ["id"],
  watch: {
    $route(to, from) {
      if (
        to &&
        to.params &&
        from &&
        from.params &&
        to.params.id != from.params.id
      ) {
        this.getCurrentRepoInfo();
      }
    }
  },
  data() {
    return {
      currentRepo: {},
      currentRepoLoaded: false,
      openEditerVal: false,
      currentBranch: "",
      currentRepoMarkdown: "",
      currentPaymentPointerId: "",
      showPublishModal: false,
      publishedSuccessfully: false,
      someCounter: 0
    };
  },
  async mounted() {
    try {
      await this.getCurrentRepoInfo();
      const markdowns = this.currentRepo.markdowns;
      if (markdowns.length > 0) {
        const filterMarkdown = markdowns.filter(
          md => md.branch === this.currentBranch
        );
        if (filterMarkdown.length > 0) {
          this.currentRepoMarkdown = filterMarkdown[0].value;
          this.currentPaymentPointerId = filterMarkdown[0].paymentPointerId._id;
        } else {
          this.currentRepoMarkdown = "";
        }
      } else {
        this.currentRepoMarkdown = "";
      }
    } catch (err) {
      return;
    }
  },
  methods: {
    getCurrentRepoInfo: async function() {
      const firebaseToken = await firebase.auth().currentUser.getIdToken();
      const result = await axios.get(
        `${process.env.VUE_APP_API_URL}/repos/${this.id}`,
        {
          headers: { Authorization: "Bearer " + firebaseToken }
        }
      );
      this.currentRepo = result.data.repo;
      this.currentRepoLoaded = true;
      this.currentBranch = this.currentRepo.defaultBranch;
      store.commit("updateRepoInformation", result.data.repo);

      if (result.data.repo.markdowns.length > 0) {
        const firstMarkdown = result.data.repo.markdowns[0];
        this.currentBranch = firstMarkdown.branch;
        this.currentRepoMarkdown = firstMarkdown.value;
        this.currentPaymentPointerId = firstMarkdown.paymentPointerId._id;
      }
    },
    openEditer: function() {
      this.openEditerVal = true;
    },
    saveMarkdown: function() {
      this.openEditerVal = false;
    },
    branchChanged: function(newBranch) {
      this.currentBranch = newBranch;
      const markdowns = this.currentRepo.markdowns;
      console.log("markdowns", markdowns);
      if (markdowns.length > 0) {
        const filterMarkdown = markdowns.filter(
          md => md.branch === this.currentBranch
        );
        if (filterMarkdown.length > 0) {
          this.currentRepoMarkdown = filterMarkdown[0].value;
        } else {
          this.currentRepoMarkdown = "";
        }
      } else {
        this.currentRepoMarkdown = "";
      }
    },
    changePaymentPointerId: function(id) {
      this.currentPaymentPointerId = id;
    },
    closePublishModal: function(shouldClose, updated) {
      this.$forceUpdate();
      if (shouldClose) {
        this.showPublishModal = false;
        if (updated) {
          this.getCurrentRepoInfo();
          this.someCounter++;
          this.publishedSuccessfully = this.someCounter;
        } else {
          this.publishedSuccessfully = false;
        }
      }
    },
    publishModalOpen: function(shouldOpen) {
      if (shouldOpen) this.showPublishModal = true;
    }
  }
};
</script>
<style lang="scss" scoped></style>
