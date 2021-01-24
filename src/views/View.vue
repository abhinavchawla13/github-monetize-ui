<template>
  <div class="flex justify-center h-full min-h-full bg-white">
    <div v-if="allLoaded && !repoNotFound" class="w-3/4 md:w-5/6">
      <!-- <b v-if="pointerLoaded">Page is monetized</b> -->
      <!-- <br /> -->
      <div
        class="justify-center max-w-screen-lg w-full mx-auto"
        v-if="pointerLoaded && isMonetizingUser"
      >
        <h2
          class="mt-10 pl-4 text-4xl leading-9 text-left font-extrabold tracking-tight text-gray-900 sm:text-3xl sm:leading-10"
        >{{ repo.fullname }}</h2>
        <img
          v-if="repo.status == 'published'"
          class="mt-2 pl-4 pb-5"
          src="https://img.shields.io/badge/documento-monetized-brightgreen?style=for-the-badge"
        />
        <div
          v-if="repo.status == 'published'"
          class="markdown-body min-w-full w-full p-8 rounded-lg bg-gray-50 shadow-md mt-4 mb-10 margin-auto"
          v-html="compiledMarkdown"
        />
        <h2
          v-if="repo.status != 'published'"
          class="mt-10 pl-4 text-2xl leading-9 text-left font-extrabold tracking-tight text-gray-900 sm:text-2xl sm:leading-10"
        >The link is not published yet.</h2>
      </div>
      <div v-if="!isMonetizingUser">
        <h2
          class="mt-10 pl-4 text-3xl leading-9 text-left font-extrabold tracking-tight text-gray-900 sm:text-2xl sm:leading-10"
        >
          This documentation is monetized. Please subscribe with Coil to view
          it.
        </h2>
      </div>
    </div>
    <div v-if="allLoaded && repoNotFound">
      <h2
        class="mt-10 pl-4 text-3xl leading-9 text-left font-extrabold tracking-tight text-gray-900 sm:text-2xl sm:leading-10"
      >This link is not associated with any repository.</h2>
    </div>
    <div v-if="checkComplete && !allLoaded && !pointerLoaded">
      <h2
        class="mt-10 pl-4 text-3xl leading-9 text-left font-extrabold tracking-tight text-gray-900 sm:text-2xl sm:leading-10"
      >
        Invalid payment pointer is linked with this documentation. Owner should
        update it with a working pointer.
      </h2>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import marked from "marked";

export default {
  props: ["id", "branch"],
  data() {
    return {
      paymentPointer: "",
      pointerLoaded: false,
      isMonetizingUser: false,
      markdown: "",
      repo: {},
      allLoaded: false,
      repoNotFound: false,
      checkComplete: false
    };
  },
  computed: {
    compiledMarkdown: function() {
      return marked(this.markdown, { sanitize: true });
    }
  },
  async mounted() {
    let result;
    try {
      result = await axios.get(
        `${process.env.VUE_APP_API_URL}/repos/pointer/${this.id}/${this.branch}`
      );
    } catch (err) {
      this.repoNotFound = true;
      this.allLoaded = true;
      return;
    }

    this.paymentPointer = result.data.paymentPointer;
    this.pointerLoaded = false;

    // ! for dev purposes
    // Note: Look around better ways to check document.monetization
    if (
      process.env.VUE_APP_ENABLE_COIL_REQUIREMENT === true ||
      process.env.VUE_APP_ENABLE_COIL_REQUIREMENT === "true"
    ) {
      if (document.monetization) {
        document.monetization.addEventListener(
          "monetizationstart",
          async () => {
            const resp = await axios.get(
              `${process.env.VUE_APP_API_URL}/repos/public/${this.id}/${this.branch}`
            );
            this.pointerLoaded = true;
            this.markdown = resp.data.markdown;
            this.repo = resp.data.repo;
            this.isMonetizingUser = true;
            this.allLoaded = true;
            this.checkComplete = true;
            // if (!document.monetization.state === "started") {
            // }
          }
        );
      } else {
        console.log("main if false");
        this.isMonetizingUser = false;
        this.allLoaded = true;
        this.checkComplete = true;
      }
    } else {
      const resp = await axios.get(
        `${process.env.VUE_APP_API_URL}/repos/public/${this.id}/${this.branch}`
      );
      this.pointerLoaded = true;
      this.markdown = resp.data.markdown;
      this.repo = resp.data.repo;
      this.isMonetizingUser = true;
      this.allLoaded = true;
      this.checkComplete = true;
    }
  },
  metaInfo() {
    return {
      title: "Documentation",
      meta: [
        {
          name: "monetization",
          content: this.paymentPointer
        }
      ]
    };
  }
};
</script>

<style lang="css">
body {
  height: 100vh;
}
#app {
  height: 100%;
}
</style>
