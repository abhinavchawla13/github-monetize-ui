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
            <svg class="fill-current text-indigo-500 inline-block h-7 w-7" viewBox="0 0 24 24">
              <path
                class="heroicon-ui"
                d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-9h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2V9a1 1 0 0 1 2 0v2z"
              />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3
              id="modal-headline"
              class="text-lg mt-2 leading-6 font-medium text-gray-900"
            >Add Wallet Pointer</h3>
            <div class="mt-2">
              <label class="mt-4 block text-sm leading-5 font-medium text-gray-700">Pointer link</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input
                  id="pointer_link"
                  v-model="paymentPointer"
                  class="form-input block w-full px-4 sm:text-sm sm:leading-5 focus:shadow-none"
                  placeholder="$ilp.gatehub.net/"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
          <button
            v-if="getWalletPointerNotExists"
            type="button"
            class="cursor-pointer inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            @click="savePointer()"
          >Add</button>
          <button
            v-if="!getWalletPointerNotExists"
            type="button"
            class="cursor-pointer inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            @click="savePointer()"
          >Update</button>
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

export default {
  data() {
    return {
      paymentPointer: store.state.currentUser.paymentPointer || ""
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
    savePointer: async function() {
      let vm = this;
      if (this.paymentPointer) {
        try {
          const firebaseToken = await firebase.auth().currentUser.getIdToken();
          await axios.patch(
            `${process.env.VUE_APP_API_URL}/users/wallet`,
            {
              paymentPointer: this.paymentPointer
            },
            {
              headers: { Authorization: "Bearer " + firebaseToken }
            }
          );
          store.commit("updatePaymentPointer", this.paymentPointer);
          this.$noty.success("Wallet pointer updated!");
          vm.$emit("closePointer", true);
        } catch (err) {
          this.$noty.error(err);
        }
      }
    },
    closeModal: function() {
      this.$emit("closePointer", true);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>