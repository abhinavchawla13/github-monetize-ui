<template>
  <div class="home">
    <PaymentWallet />
    <ConnectRepo />
    <RepoTable />
  </div>
</template>

<script>
// @ is an alias to /src
import PaymentWallet from "@/components/PaymentWallet.vue";
import RepoTable from "@/components/RepoTable.vue";
import ConnectRepo from "@/components/ConnectRepo.vue";

export default {
  name: "Home",
  components: {
    PaymentWallet,
    RepoTable,
    ConnectRepo
  },
  mounted() {}
};
</script>
