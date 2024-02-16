<template>
  <div id="app">
    <router-view v-if="isRouterActive" />
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterActive: true
    };
  },
  methods: {
    reload() {
      this.isRouterActive = false;
      this.$nextTick(() => {
        this.isRouterActive = true;
      });
    }
  }
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  min-width: 1275px;
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  height: 100%;
}
</style>
