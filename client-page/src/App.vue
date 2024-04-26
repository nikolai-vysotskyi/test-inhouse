<template>
  <div id="app">
    <h1>Клиентский интерфейс</h1>
    <dynamic-component></dynamic-component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DynamicComponent from './components/DynamicComponent.vue';

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
