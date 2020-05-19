<template>
  <div id="editor">
    <textarea :value="input" @input="update"></textarea>
    <div class="markdown-body" v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
import marked from "marked";
import debounce from "lodash.debounce";

export default {
  data() {
    return {
      input: "# hello",
      compiledMarkdown2: "<h1>hello</h1>"
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

<style lang="css" scoped src="@/assets/styles/markdown.css">
</style>