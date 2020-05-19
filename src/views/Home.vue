<template>
  <div class="home">
    <PaymentWallet />
    <a
      class="opacity-0 inline-flex items-center justify-center px-5 py-3 mt-6 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
    >Connect Repository</a>
    <RepoTable />
  </div>
</template>

<script>
// @ is an alias to /src
import PaymentWallet from "@/components/PaymentWallet.vue";
import RepoTable from "@/components/RepoTable.vue";

export default {
  name: "Home",
  components: {
    PaymentWallet,
    RepoTable
  }
};
</script>
