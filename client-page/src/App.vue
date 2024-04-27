<template>
  <div id="app">
    <h1>Клиентский интерфейс</h1>
    <dynamic-component></dynamic-component>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

const DynamicComponent = defineAsyncComponent({
  loader: () => import('./components/DynamicComponent.vue'),
  loadingComponent:  () => import('./components/LoadingComponent.vue'),
  errorComponent: () => import('./components/ErrorComponent.vue'),
  delay: 200,
  timeout: 5000,
});

export default defineComponent({
  name: 'App',
  components: {
    DynamicComponent
  }
});
</script>

<style scoped>
#app {
  padding: 0 16px;
}
</style>
