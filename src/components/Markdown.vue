<template>
  <div>
    <div class="labels-head m-auto flex items-stretch">
      <div class="flex-1 text-right pr-8 mb-2">
        <span
          class="inline-flex text-sm py-1 px-4 leading-5 font-semibold rounded-full bg-indigo-200 text-indigo-800 relative"
          style="bottom: -51px;"
        >Editor</span>
      </div>
      <div class="flex-1 text-right pr-10 mb-2">
        <span
          class="mr-1 inline-flex text-sm py-1 px-4 leading-5 font-semibold rounded-full bg-indigo-200 text-indigo-800 relative"
          style="bottom: -51px;"
        >Output</span>
      </div>
    </div>
    <div id="editor">
      <textarea
        :disabled="disabled"
        v-bind:class="{ 'opacity-50': disabled }"
        :value="input"
        @input="update"
        placeholder="Enter your markdown here.."
      />
      <div class="markdown-body" v-html="compiledMarkdown" />
    </div>
  </div>
</template>

<script>
import marked from "marked";
import debounce from "lodash.debounce";
import axios from "axios";
import * as firebase from "firebase";

export default {
  props: [
    "currentrepomd",
    "openEditor",
    "currentrepoId",
    "currentBranch",
    "currentPaymentPointerId"
  ],
  watch: {
    openEditor: async function(newVal, oldVal) {
      // watch it, oldVal refers to editBoxOpen here
      this.disabled = oldVal;
      if (oldVal) {
        try {
          const firebaseToken = await firebase.auth().currentUser.getIdToken();
          await axios.patch(
            `${process.env.VUE_APP_API_URL}/repos/${this.currentrepoId}`,
            {
              markdown: this.input,
              branch: this.currentBranch,
              paymentPointerId: this.currentPaymentPointerId
            },
            {
              headers: { Authorization: "Bearer " + firebaseToken }
            }
          );
          this.$noty.success("Markdown saved on the platform");
        } catch (err) {
          this.$noty.error("There was an error saving");
        }
      }
    },
    currentrepomd: async function(newVal, oldVal) {
      if (newVal != oldVal) {
        this.input = newVal;
      }
    }
  },
  data() {
    return {
      input: this.currentrepomd,
      disabled: true
    };
  },
  computed: {
    compiledMarkdown: function() {
      return marked(this.input, { sanitize: true });
    }
  },
  methods: {
    update: debounce(function(e) {
      this.input = e.target.value;
    }, 300)
  }
};
</script>

<style lang="css" scoped src="@/assets/styles/markdown.css"></style>
