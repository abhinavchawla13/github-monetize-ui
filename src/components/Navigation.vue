<template>
  <nav class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="hidden md:block">
            <div class="flex items-baseline">
              <router-link
                to="/"
                class="px-3 py-2 rounded-md text-sm font-medium"
                v-bind:class="{'active-tab': checkTab('dashboard'), 'non-active-tab': !checkTab('dashboard')}"
                @click.native="updateTab('dashboard')"
              >Dashboard</router-link>
              <router-link
                to="/repos"
                class="ml-4 px-3 py-2 rounded-md text-sm font-medium"
                v-bind:class="{'active-tab': checkTab('repos'), 'non-active-tab': !checkTab('repos')}"
                @click.native="updateTab('repos')"
              >Repositories</router-link>
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6" @click="toggleUserMenu()">
            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <div>
                <button
                  class="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:no-shadow"
                  id="user-menu"
                >
                  <div class="mx-3 text-right">
                    <div class="text-base font-medium leading-none text-white">{{ getUserGithub }}</div>
                    <div
                      class="mt-1 text-sm font-medium leading-none text-gray-400"
                    >{{ getUserEmail }}</div>
                  </div>
                  <img class="h-8 w-8 rounded-full" :src="getUserPhotoURL" alt />
                </button>
              </div>
              <!--
                Profile dropdown panel, show/hide based on dropdown state.

                Entering: "transition ease-out duration-100"
                  From: "transform opacity-0 scale-95"
                  To: "transform opacity-100 scale-100"
                Leaving: "transition ease-in duration-75"
                  From: "transform opacity-100 scale-100"
                  To: "transform opacity-0 scale-95"
              -->
              <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                <div class="rounded-md bg-white overflow-hidden" v-if="userMenuActive">
                  <div
                    class="block px-4 py-4 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    @click="logout()"
                  >Logout</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="-mr-2 flex md:hidden">
          <!-- Mobile menu button -->
          <button
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
            @click="toggleMobileUserMenu"
          >
            <!-- Menu open: "hidden", Menu closed: "block" -->
            <svg class="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!-- Menu open: "block", Menu closed: "hidden" -->
            <svg class="hidden h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <!--
      Mobile menu, toggle classes based on menu state.

      Open: "block", closed: "hidden"
    -->
    <div class="block md:hidden text-left" v-if="mobileUserMenuActive">
      <div class="px-2 pt-2 pb-3 sm:px-3">
        <router-link
          to="/"
          class="block px-3 py-2 mt-1 rounded-md text-base font-medium focus:outline-none focus:text-white focus:bg-gray-700"
          v-bind:class="{'active-tab-mobile': checkTab('dashboard'), 'non-active-tab-mobile': !checkTab('dashboard')}"
          @click.native="updateTab('dashboard')"
        >Dashboard</router-link>
        <router-link
          to="/repos"
          class="block px-3 py-2 mt-1 rounded-md text-base font-medium focus:outline-none focus:text-white focus:bg-gray-700"
          v-bind:class="{'active-tab-mobile': checkTab('repos'), 'non-active-tab-mobile': !checkTab('repos')}"
          @click.native="updateTab('repos')"
        >Repositories</router-link>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-700">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <img class="h-10 w-10 rounded-full" :src="getUserPhotoURL" alt />
          </div>
          <div class="ml-3">
            <div class="text-base font-medium leading-none text-white">{{ getUserGithub }}</div>
            <div class="mt-1 text-sm font-medium leading-none text-gray-400">{{ getUserEmail }}</div>
          </div>
        </div>
        <div class="mt-3 px-2">
          <div
            class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
            @click="logout()"
          >Logout</div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import router from "@/router";
import store from "../store";

export default {
  name: "Navigation",
  props: {
    msg: String
  },
  data() {
    return {
      currentTab: "dashboard",
      userMenuActive: false,
      mobileUserMenuActive: false
    };
  },
  mounted() {
    this.currentTab = router.currentRoute?.path.substr(1);
  },
  computed: {
    getUserPhotoURL() {
      return store.state.currentUser.photoURL;
    },
    getUserEmail() {
      return store.state.currentUser.email;
    },
    getUserGithub() {
      return store.state.currentUser.githubId;
    }
  },
  methods: {
    updateTab: function(tab) {
      this.currentTab = tab;
    },
    checkTab: function(tab) {
      if (tab == "dashboard") {
        if (
          this.currentTab == "dashboard" ||
          this.currentTab == "home" ||
          this.currentTab == ""
        ) {
          return true;
        }
      }
      return this.currentTab == tab;
    },
    toggleUserMenu: function() {
      this.userMenuActive = !this.userMenuActive;
    },
    toggleMobileUserMenu: function() {
      this.mobileUserMenuActive = !this.mobileUserMenuActive;
    },
    logout: function() {
      let vm = this;
      firebase
        .auth()
        .signOut()
        .then(function() {
          // Sign-out successful.
          vm.userMenuActive = false;
          store.commit("logoutUser");
          router.replace({ name: "login" });
        })
        .catch(function(error) {
          // An error happened.
          console.log("Navigation logout", error);
          vm.userMenuActive = false;
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
