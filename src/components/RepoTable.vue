<template>
  <div class="flex flex-col">
    <div
      class="mx-auto w-11/12 mx-4 py-8 px-4 overflow-x-auto md:w-11/12 lg:w-5/6 sm:px-6 lg:py-8 lg:px-8 lg:flex lg:items-center lg:justify-between lg:max-w-screen-xl"
    >
      <div
        class="align-middle inline-block min-w-full shadow overflow-x-auto sm:rounded-lg border-b border-gray-200"
      >
        <table class="min-w-full">
          <thead>
            <tr>
              <th
                class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider pl-10"
              >Repository</th>
              <th
                class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >Last Updated</th>
              <th
                class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >Status</th>
              <th
                class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >Link</th>
              <th class="px-6 py-3 border-b border-gray-200 bg-gray-50" />
            </tr>
          </thead>

          <tbody v-for="repo in currentAddedRepos" :key="repo.name" class="bg-white">
            <tr class="hover:bg-gray-100">
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div class="flex items-center">
                  <div class="ml-4">
                    <div
                      @click="takeToRepoPage(repo._id)"
                      class="cursor-pointer text-sm leading-5 font-medium text-gray-900"
                    >{{ repo.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div class="text-sm leading-5 text-gray-500">{{ repo.updatedAt | formatDate }}</div>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <span
                  v-if="repo.status == 'published'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                >Published</span>
                <span
                  v-if="repo.status == 'unpublished'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                >Unpublished</span>
              </td>
              <td
                class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500"
              >
                <a
                  v-if="repo.link"
                  class="cursor-pointer hover:underline"
                  :href="repo.link"
                  target="_blank"
                >{{ repo.link || 'No link generated yet' }}</a>
                <span v-if="!repo.link">No link generated yet</span>
              </td>
              <td
                class="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium"
              >
                <a
                  href="#"
                  class="text-indigo-600 hover:text-indigo-900"
                  @click="takeToRepoPage(repo._id)"
                >Edit</a>
              </td>
            </tr>
          </tbody>

          <tbody v-if="!currentAddedRepos.length">
            <tr>
              <td class="text-center py-5" colspan="4">No repositories added yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as firebase from "firebase";
import store from "@/store";
import router from "@/router";

export default {
  data() {
    return {};
  },
  async mounted() {
    await this.loadAllRepos();
  },
  computed: {
    currentAddedRepos() {
      return store.state.currentUser.repos;
    }
  },
  methods: {
    loadAllRepos: async function() {
      try {
        const firebaseToken = await firebase.auth().currentUser.getIdToken();
        const result = await axios.get(
          `${process.env.VUE_APP_API_URL}/users/repos`,
          {
            headers: { Authorization: "Bearer " + firebaseToken }
          }
        );
        store.commit("updateReposInformation", result.data.repos);
      } catch (error) {
        this.$noty.error(error);
      }
    },
    takeToRepoPage: function(id) {
      router.push(`/repo/${id}#`);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>