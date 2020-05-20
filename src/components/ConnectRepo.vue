<template>
  <div>
    <div class="bg-gray-200">
      <div
        class="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:py-8 lg:px-8 lg:flex lg:items-center lg:justify-between"
      >
        <h2
          v-if="!getWalletPointerNotExists"
          class="leading-9 text-left font-extrabold tracking-tight text-gray-900 sm:text-2xl sm:leading-10"
        >
          Have a repository in mind?
          <br />
          <span class="text-indigo-600 sm:text-4xl">Connect your GitHub Repository</span>
        </h2>
        <h2
          v-if="getWalletPointerNotExists"
          class="text-3xl leading-9 text-left font-extrabold tracking-tight text-gray-900 sm:text-2xl sm:leading-10"
        >
          Have a repository in mind?
          <br />
          <span class="text-indigo-600 sm:text-4xl">First add a wallet pointer</span>
        </h2>
        <div class="mt-8 flex lg:flex-shrink-0 lg:mt-0">
          <div class="inline-flex rounded-md shadow">
            <button
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              :class="{'cursor-not-allowed': getWalletPointerNotExists, 'opacity-50': getWalletPointerNotExists}"
              @click="openConnectRepoModal()"
            >Connect Repository</button>
          </div>
        </div>
      </div>
    </div>
    <ConnectRepoModal
      v-if="showConnectRepoModal"
      @addAndCloseConnectRepoModal="closeConnectRepoModalAndRefresh($event)"
      @close="closeConnectRepoModal($event)"
    />
  </div>
</template>

<script>
import store from "../store";
import ConnectRepoModal from "@/components/ConnectRepoModal.vue";
export default {
  components: {
    ConnectRepoModal
  },
  data() {
    return {
      showConnectRepoModal: false
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
  methods: {
    closeConnectRepoModalAndRefresh: function(val) {
      if (val) {
        this.showConnectRepoModal = false;
      }
    },
    closeConnectRepoModal: function(val) {
      if (val) {
        this.showConnectRepoModal = false;
      }
    },
    openConnectRepoModal: function() {
      this.showConnectRepoModal = true;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>