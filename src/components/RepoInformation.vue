<template>
  <div>
    <div
      v-if="updatedRepo && updatedRepo.name"
      class="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:py-8 lg:px-8 lg:flex lg:items-center lg:justify-between"
    >
      <div class="flex-1 min-w-0">
        <span
          class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate text-left"
        >{{ updatedRepo.name }}</span>
        <span
          v-if="publishStatus == 'published' || publishCheck"
          class="ml-6 px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 relative"
          style="bottom: 6px;"
        >Branch Published</span>
        <span
          v-if="publishStatus == 'unpublished' && !publishCheck"
          class="ml-6 px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 relative"
          style="bottom: 6px;"
        >Branch Unpublished</span>
        <!-- <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap">
          <div
            class="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mr-6"
          >
            <svg
              class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
              <path
                d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"
              />
            </svg>
            <span v-text="updatedRepo.private ? 'Private' : 'Public'"></span>
          </div>
          <div
            class="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mr-6"
            v-if="updatedRepo.language"
          >
            <svg
              class="mr-1.5 h-5 w-5x text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                class="heroicon-ui"
                d="M20.59 12l-3.3-3.3a1 1 0 1 1 1.42-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.42-1.4l3.3-3.3zM3.4 12l3.3 3.3a1 1 0 0 1-1.42 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.42 1.4L3.4 12zm7.56 8.24a1 1 0 0 1-1.94-.48l4-16a1 1 0 1 1 1.94.48l-4 16z"
              />
            </svg>
            {{ updatedRepo.language }}
          </div>
        </div>-->
        <div class="mt-1 flex">
          <div class="mt-3 text-sm leading-5 text-gray-500 sm:mr-6">
            <label id="listbox-label" class="ml-1 block font-bold text-gray-700">Branch</label>
            <select class="text-base" style="max-width: 150px;" v-model="currentBranch">
              <option v-for="branch in updatedRepo.branches" :key="branch">{{ branch }}</option>
            </select>
          </div>
          <div class="mt-3 text-sm leading-5 text-gray-500 sm:mr-6">
            <label id="listbox-label" class="ml-1 block font-bold text-gray-700">Payment Pointer</label>
            <select
              class="text-base focus:outline-none"
              :value="currentPaymentPointerId"
              @change="updatePaymentPointerId($event)"
              :disabled="!editOn"
            >
              <option v-for="p in allPaymentPointer" :key="p._id" :value="p._id">{{ p.link }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="mt-5 flex lg:mt-0 lg:ml-4">
        <span v-if="!editOn" class="sm:block shadow-sm rounded-md">
          <button
            type="button"
            class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out"
            @click="openEdit"
          >
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              />
            </svg>
            Edit
          </button>
        </span>

        <span v-if="editOn" class="sm:block shadow-sm rounded-md">
          <button
            type="button"
            class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out"
            @click="saveMarkdown"
          >
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              />
            </svg>
            Save
          </button>
        </span>

        <span class="sm:block mx-3 shadow-sm rounded-md">
          <a
            :href="updatedRepo.link + '/' + currentBranch"
            target="_blank"
            class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
          >
            <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fill-rule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clip-rule="evenodd"
              />
            </svg>
            View
          </a>
        </span>

        <span class="shadow-sm rounded-md" v-if="publishStatus == 'published' || publishCheck">
          <button
            type="button"
            class="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out"
            @click="unpublish"
            v-bind:class="{
              'opacity-50': editOn,
              'cursor-not-allowed': editOn
            }"
            :disabled="editOn"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M2 10a4 4 0 004 4h3v3a1 1 0 102 0v-3h3a4 4 0 000-8 4 4 0 00-8 0 4 4 0 00-4 4zm9 4H9V9.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 9.414V14z"
              />
            </svg>
            <span>Unpublish</span>
          </button>
        </span>

        <span class="shadow-sm rounded-md" v-if="publishStatus == 'unpublished' && !publishCheck">
          <button
            type="button"
            class="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out"
            @click="publish"
            v-bind:class="{
              'opacity-50': editOn,
              'cursor-not-allowed': editOn
            }"
            :disabled="editOn"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M2 10a4 4 0 004 4h3v3a1 1 0 102 0v-3h3a4 4 0 000-8 4 4 0 00-8 0 4 4 0 00-4 4zm9 4H9V9.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 9.414V14z"
              />
            </svg>
            <span>Publish to Repository</span>
          </button>
        </span>
      </div>
    </div>
    <div v-if="!updatedRepo || !updatedRepo.name">
      <h2
        class="text-xl mt-12 px-4 font-bold leading-7 text-gray-900 sm:text-xl sm:leading-9 sm:truncate text-center"
      >Repository does not exist or you do not have permissions to view.</h2>
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import axios from "axios";
import store from "../store";

export default {
  props: ["currentrepo", "publishedSuccess"],
  data() {
    return {
      editOn: false,
      updatedRepo: this.currentrepo,
      currentBranch: this.currentrepo.branches[0],
      currentPaymentPointerId: "",
      publishStatus: "unpublished",
      publishCheck: false
    };
  },
  computed: {
    allPaymentPointer() {
      return store.state.currentUser.paymentPointers;
    }
  },
  watch: {
    currentrepo: async function(newVal, oldVal) {
      if (newVal.name != oldVal.name) {
        this.updatedRepo = newVal;
      }
    },
    currentBranch: function(newVal) {
      this.$emit("branchChanged", newVal);
      this.currentBranch = newVal;
      this.currentPaymentPointer();
    },
    publishedSuccess: function(newVal) {
      if (newVal) {
        this.publishCheck = true;
      }
    }
  },
  methods: {
    openEdit: function() {
      this.editOn = true;
      this.$emit("editOn");
    },
    saveMarkdown: function() {
      this.editOn = false;
      this.$emit("saveMarkdown");
    },
    currentPaymentPointer() {
      const markdowns = this.updatedRepo.markdowns;
      if (markdowns.length > 0) {
        const filterMarkdown = markdowns.filter(
          md => md.branch === this.currentBranch
        );
        // console.log(filterMarkdown);
        if (filterMarkdown.length) {
          this.currentPaymentPointerId = filterMarkdown[0].paymentPointerId._id;
          this.publishStatus = filterMarkdown[0].status || "unpublished";
          return;
        } else {
          this.publishStatus = "unpublished";
        }
      }
      this.currentPaymentPointerId =
        store.state.currentUser.paymentPointers[0]._id;
    },
    publish: function() {
      this.$emit("publishModalOpen", true);
    },
    unpublish: async function() {
      try {
        const firebaseToken = await firebase.auth().currentUser.getIdToken();
        await axios.post(
          `${process.env.VUE_APP_API_URL}/repos/unpublish`,
          {
            id: this.updatedRepo._id,
            branch: this.currentBranch
          },
          {
            headers: { Authorization: "Bearer " + firebaseToken }
          }
        );
        this.publishStatus = "unpublished";
        this.publishCheck = false;
        this.$noty.success("README.md: Updated with the markdown");
      } catch (err) {
        this.$noty.error(err);
        this.$noty.error("Sorry, repository was not unpublished");
      }
    },
    updatePaymentPointerId: async function(event) {
      this.currentPaymentPointerId = event.target.value;
      this.$emit("paymentPointerIdChanged", event.target.value);
    }
  },
  mounted() {
    this.currentPaymentPointer();
  }
};
</script>

<style lang="scss" scoped></style>
