<template>
  <div>
    <RepoInformation
      v-if="currentRepoLoaded"
      :currentrepo="currentRepo"
      v-on:editOn="openEditer"
      v-on:saveMarkdown="saveMarkdown"
    />
    <Markdown
      v-if="currentRepoLoaded"
      :currentrepomd="currentRepo.markdown"
      :openEditor="openEditerVal"
      :currentrepoId="currentRepo._id"
    />
  </div>
</template>

<script>
import RepoInformation from "@/components/RepoInformation.vue";
import Markdown from "@/components/Markdown.vue";
import axios from "axios";
import * as firebase from "firebase";

export default {
  components: { RepoInformation, Markdown },
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
      openEditerVal: false
    };
  },
  async mounted() {
    try {
      await this.getCurrentRepoInfo();
    } catch (err) {
      console.error(err);
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
    },
    openEditer: function() {
      this.openEditerVal = true;
    },
    saveMarkdown: function() {
      this.openEditerVal = false;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>