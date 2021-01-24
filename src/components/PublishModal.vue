<template>
  <div
    class="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center"
  >
    <!--
    Background overlay, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
    -->
    <div class="fixed inset-0 transition-opacity">
      <div class="absolute inset-0 bg-gray-500 opacity-50" />
    </div>
    <!-- Modal panel, show/hide based on modal state.  -->
    <div
      class="bg-white absolute rounded-lg overflow-hidden shadow-xl transform transition-all w-2/3"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <!-- <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <svg class="fill-current text-indigo-500 inline-block h-7 w-7" viewBox="0 0 24 24">
              <path
                class="heroicon-ui"
                d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-9h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2V9a1 1 0 0 1 2 0v2z"
              />
            </svg>
          </div>-->
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3
              id="modal-headline"
              class="text-lg mt-2 leading-6 font-medium text-gray-900"
            >Publish Preview</h3>
            <label
              class="mt-4 block text-sm leading-5 font-medium text-gray-700"
            >You can personalize your default published README, if you like:</label>
            <div class="mt-2 flex justify-between">
              <div class="w-6/12">
                <div class="mt-1 relative rounded-md">
                  <textarea
                    style="width: 90% !important; min-height: 400px;"
                    placeholder="Enter your markdown here.."
                    v-model="defaultMarkdown"
                  />
                </div>
              </div>
              <div class="w-6/12">
                <div class="mt-1 relative rounded-md">
                  <div
                    style="width: 90% !important; min-height: 400px;"
                    class="markdown-body"
                    v-html="compiledMarkdown"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <label class="ml-4 text-xs">
          Note: You must include the link:
          <b>{{link}}</b> atleast once in your markdown.
        </label>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
          <button
            type="button"
            class="cursor-pointer inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            @click="publish()"
          >Publish</button>
        </span>
        <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
          <button
            type="button"
            class="cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            @click="closeModal()"
          >Cancel</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as firebase from "firebase/app";
import "firebase/auth";
import store from "../store";
import _ from "lodash";
import marked from "marked";

export default {
  props: ["currentRepo", "branch"],
  data() {
    return {
      paymentPointers: store.state.currentUser.paymentPointers || "",
      paymentPointerLink: _.get(this, "pointerUpdateObj.link") || "",
      defaultMarkdown: "",
      link: ""
    };
  },
  computed: {
    compiledMarkdown: function() {
      return marked(this.defaultMarkdown, { sanitize: true });
    }
  },
  watch: {
    showModal: function(show) {
      if (show) {
        this.fetchLatest();
      }
    }
  },
  methods: {
    closeModal: function() {
      this.$emit("closePublishModal", true, false);
    },
    publish: async function() {
      if (!this.defaultMarkdown.includes(this.link)) {
        this.$noty.error("Please include the link atleast once");
        return;
      }
      try {
        const firebaseToken = await firebase.auth().currentUser.getIdToken();
        await axios.post(
          `${process.env.VUE_APP_API_URL}/repos/publish`,
          {
            id: this.currentRepo._id,
            branch: this.branch,
            publishMarkdown: this.defaultMarkdown
          },
          {
            headers: { Authorization: "Bearer " + firebaseToken }
          }
        );
        this.publishStatus = "published";
        this.$noty.success("README.md published!");
        this.$emit("closePublishModal", true, true);
      } catch (err) {
        // console.log(err);
        this.$noty.error("Sorry, repository was not published");
      }
    },
    fetchLatest: function() {
      this.link = `${process.env.VUE_APP_DEPLOY_URL}/view/${this.currentRepo._id}/${this.branch}`;

      const md = this.currentRepo.markdowns.filter(
        md => md.branch === this.branch
      );
      if (md.length > 0) {
        if (md[0].publishedMarkdown && md[0].publishedMarkdown != "") {
          this.defaultMarkdown = md[0].publishedMarkdown;
          return;
        }
      }
      this.defaultMarkdown = `[![Documento Monetized](https://img.shields.io/badge/documento-monetized-brightgreen?style=for-the-badge)](${process.env.VUE_APP_DEPLOY_URL}/view/${this.currentRepo._id}/${this.branch})\n\n#### Documentation can be found at:\n## [${process.env.VUE_APP_BASE_NAME}](${process.env.VUE_APP_DEPLOY_URL}/view/${this.currentRepo._id}/${this.branch})\n\nDocument is web monetized. You would need a [Coil](https://coil.com/) membership to view it.`;
    }
  },
  mounted() {
    this.fetchLatest();
  }
};
</script>

<style lang="scss" scoped></style>
