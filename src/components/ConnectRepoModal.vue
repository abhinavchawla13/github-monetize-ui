<template>
  <div
    class="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center"
  >
    <div class="fixed inset-0 transition-opacity">
      <div class="absolute inset-0 bg-gray-500 opacity-50" />
    </div>
    <!-- Modal panel, show/hide based on modal state.  -->
    <div
      class="bg-white absolute rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
      style="top: 20%; left: calc(50% - 256px)"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <svg class="fill-current text-indigo-500 inline-block h-5 w-5" viewBox="0 0 24 24">
              <path
                class="heroicon-ui"
                d="M19.48 13.03A4 4 0 0 1 16 19h-4a4 4 0 1 1 0-8h1a1 1 0 0 0 0-2h-1a6 6 0 1 0 0 12h4a6 6 0 0 0 5.21-8.98L21.2 12a1 1 0 1 0-1.72 1.03zM4.52 10.97A4 4 0 0 1 8 5h4a4 4 0 1 1 0 8h-1a1 1 0 0 0 0 2h1a6 6 0 1 0 0-12H8a6 6 0 0 0-5.21 8.98l.01.02a1 1 0 1 0 1.72-1.03z"
              />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-3/4">
            <h3
              id="modal-headline"
              class="text-lg mt-2 leading-6 font-medium text-gray-900"
            >Connect any repository</h3>
            <div class="mt-2">
              <label
                class="mt-4 block text-sm leading-5 font-medium text-gray-700"
              >Search through your repositories</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input
                  id="pointer_link"
                  class="form-input block w-full px-4 sm:text-sm sm:leading-5 focus:shadow-none"
                  placeholder="github-repo-name"
                  v-model="searchString"
                  v-on:input="filter"
                />

                <div
                  class="w-full bg-white rounded-lg shadow-xl max-h-full h-48 overflow-y-auto"
                  v-if="filteredRepos.length && searchString.length"
                >
                  <div v-for="repo in filteredRepos" :key="repo.name">
                    <a
                      href="#"
                      class="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                      @click="storeRepo(repo)"
                    >{{ repo.name }}</a>
                  </div>
                </div>
              </div>
              <span v-if="error && error.length" class="text-red-400 text-xs">{{ error }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
          <button
            type="button"
            class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            @click="connectRepo()"
          >Connect</button>
        </span>
        <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
          <button
            type="button"
            class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
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

export default {
  data() {
    return {
      searchString: "",
      allRepos: [],
      filteredRepos: [],
      error: "",
      selectedFullname: ""
    };
  },
  computed: {
    getWalletPointerNotExists() {
      return (
        !store.state.currentUser.paymentPointer ||
        store.state.currentUser.paymentPointer == ""
      );
    }
  },
  mounted() {
    this.getReposInfo();
  },
  methods: {
    connectRepo: async function() {
      let vm = this;

      if (this.searchString && this.selectedFullname) {
        try {
          const firebaseToken = await firebase.auth().currentUser.getIdToken();
          await axios.post(
            `${process.env.VUE_APP_API_URL}/repos`,
            {
              fullname: this.selectedFullname
            },
            {
              headers: { Authorization: "Bearer " + firebaseToken }
            }
          );
          vm.$emit("addAndCloseConnectRepoModal", true);
          this.$noty.success("Repository connected!");
          await this.loadAllRepos();
          this.error = "";
        } catch (err) {
          console.error(err);
          this.error = "Sorry, repository was not be connected";
        }
      }
    },
    closeModal: function() {
      this.$emit("close", true);
    },
    filter: function() {
      this.filteredRepos = this.allRepos.filter(repo => {
        return (
          repo.name.toLowerCase().indexOf(this.searchString.toLowerCase()) >= 0
        );
      });
    },
    getReposInfo: async function() {
      try {
        const firebaseToken = await firebase.auth().currentUser.getIdToken();
        const result = await axios.get(`${process.env.VUE_APP_API_URL}/repos`, {
          headers: { Authorization: "Bearer " + firebaseToken }
        });
        this.allRepos = result.data.repos;
      } catch (error) {
        console.error(error);
      }
    },
    storeRepo: async function(repo) {
      try {
        this.searchString = repo.name;
        this.selectedFullname = repo.full_name;
        this.filteredRepos = [];
      } catch (err) {
        console.error(err);
      }
    },
    loadAllRepos: async function() {
      try {
        const firebaseToken = await firebase.auth().currentUser.getIdToken();
        const result = await axios.get(
          `${process.env.VUE_APP_API_URL}/users/repos`,
          {
            headers: { Authorization: "Bearer " + firebaseToken }
          }
        );
        // this.repos = result.data.repos;
        store.commit("updateReposInformation", result.data.repos);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>