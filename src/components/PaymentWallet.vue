<template>
  <div>
    <div class="bg-gray-50">
      <div class="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:py-8 lg:px-8">
        <h2
          v-if="getWalletPointerNotExists"
          class="text-3xl leading-9 text-left font-extrabold flex justify-between tracking-tight text-gray-900 sm:text-2xl sm:leading-10"
        >
          <div>
            Ready to get monetize your work?
            <br />
            <span class="text-indigo-600 sm:text-4xl">Let's add your payment wallet pointer</span>
          </div>
          <div class="rounded-md">
            <a
              class="cursor-pointer px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              @click="openWalletModal('add')"
            >Add Wallet</a>
          </div>
        </h2>
        <h2
          v-if="!getWalletPointerNotExists"
          class="text-3xl leading-9 text-left font-extrabold tracking-tight text-gray-900 sm:text-2xl sm:leading-10 flex justify-between"
        >
          <span>Your wallet pointers</span>
          <div>
            <div class="rounded-md shadow">
              <a
                class="cursor-pointer items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                @click="openWalletModal('add')"
              >Add Wallet</a>
            </div>
          </div>
        </h2>
        <div>
          <div v-for="pointer in getWalletPointer" :key="pointer._id">
            <span class="text-indigo-600 text-2xl font-bold">
              {{
              pointer.link
              }}
            </span>
            <button
              type="button"
              class="cursor-pointer inline-flex items-center px-4 py-2 focus:outline-none"
              @click="openWalletModal('update', pointer)"
            >
              <svg
                class="-ml-1 mr-2 h-4 w-4 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <WalletModal
      v-if="showWalletModal"
      @closePointer="toggleWalletModal($event)"
      :pointerUpdateObj="pointerUpdateObj"
      :pointerUpdateType="pointerUpdateType"
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
      showWalletModal: false,
      pointerUpdateType: "add",
      pointerUpdateObj: ""
    };
  },
  computed: {
    getWalletPointer() {
      return store.state.currentUser.paymentPointers;
    },
    getWalletPointerNotExists() {
      return (
        !store.state.currentUser.paymentPointers ||
        store.state.currentUser.paymentPointers == ""
      );
    }
  },
  methods: {
    toggleWalletModal: function(val) {
      if (val) {
        this.showWalletModal = false;
      }
    },
    openWalletModal: function(type, obj) {
      this.showWalletModal = true;
      this.pointerUpdateType = type;
      this.pointerUpdateObj = obj;
    }
  }
};
</script>

<style lang="scss" scoped></style>
