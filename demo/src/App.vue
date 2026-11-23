<template>
  <PittoolsShowcase />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PittoolsShowcase from './pittools/PittoolsShowcase.vue'

export default defineComponent({
  name: 'App',
  components: {
    PittoolsShowcase,
  },
})
</script>

<style>
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  background: radial-gradient(120% 90% at 50% 0%, #1b1a1d 0%, #0c0c0e 60%);
  min-height: 100vh;
}

#app {
  font-family: Vazirmatn, 'Segoe UI', Tahoma, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
