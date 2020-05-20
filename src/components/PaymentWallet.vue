<template>
  <div>
    <div class="bg-gray-50">
      <div
        class="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:py-8 lg:px-8 lg:flex lg:items-center lg:justify-between"
      >
        <h2
          v-if="getWalletPointerNotExists"
          class="text-3xl leading-9 text-left font-extrabold tracking-tight text-gray-900 sm:text-2xl sm:leading-10"
        >
          Ready to get monetize your work?
          <br>
          <span class="text-indigo-600 sm:text-4xl">Let's add your payment wallet pointer</span>
        </h2>
        <h2
          v-if="!getWalletPointerNotExists"
          class="text-3xl leading-9 text-left font-extrabold tracking-tight text-gray-900 sm:text-2xl sm:leading-10"
        >
          Your wallet pointer
          <br>
          <span class="text-indigo-600 sm:text-4xl">{{ getWalletPointer }}</span>
        </h2>
        <div class="mt-8 flex lg:flex-shrink-0 lg:mt-0">
          <div class="inline-flex rounded-md shadow">
            <a
              v-if="getWalletPointerNotExists"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              @click="openWalletModal()"
            >Add Wallet</a>

            <a
              v-if="!getWalletPointerNotExists"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              @click="openWalletModal()"
            >Update Wallet</a>
          </div>
        </div>
      </div>
    </div>
    <WalletModal
      v-if="showWalletModal"
      @closePointer="toggleWalletModal($event)"
    />
  </div>
</template>

<script>
import WalletModal from "@/components/WalletModal.vue";
import store from "../store";

export default {
  components: {
    WalletModal
  },
  data() {
    return {
      showWalletModal: false
    };
  },
  computed: {
    getWalletPointer() {
      return store.state.currentUser.paymentPointer;
    },
    getWalletPointerNotExists() {
      return (
        !store.state.currentUser.paymentPointer ||
        store.state.currentUser.paymentPointer == ""
      );
    }
  },
  methods: {
    toggleWalletModal: function(val) {
      if (val) {
        this.showWalletModal = false;
      }
    },
    openWalletModal: function() {
      this.showWalletModal = true;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>