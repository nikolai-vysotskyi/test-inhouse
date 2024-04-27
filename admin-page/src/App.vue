<template>
  <div id="app">
    <h1 class="title">Админский Интерфейс</h1>
    <div class="wrapper">
      <div class="admin-section">
        <TemplateEditor
            :html="html"
            :css="css"
            @update:input="updatePreview"
        />
      </div>
      <div class="preview-section">
        <DynamicComponent :customHtml="html" :customCss="css" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,defineAsyncComponent, ref, watch } from 'vue';
import TemplateEditor from './components/TemplateEditor.vue';
import useSWRV from 'swrv';
import axios, {AxiosResponse} from "axios";

const DynamicComponent = defineAsyncComponent({
  loader: () => import('./components/DynamicComponent.vue'),
  loadingComponent:  () => import('./components/LoadingComponent.vue'),
  errorComponent: () => import('./components/ErrorComponent.vue'),
  delay: 200,
  timeout: 5000,
});

interface TemplateData {
  html: string;
  css: string;
}

export default defineComponent({
  name: 'App',
  components: {
    TemplateEditor,
    DynamicComponent
  },
  setup() {
    const html = ref("");
    const css = ref("");

    // Запрашиваем первоначальные данные для textarea
    function fetcher<T>(url: string): Promise<T> {
      return axios.get<T, AxiosResponse<T>>(url).then(res => res.data);
    }
    const { data: initialData } = useSWRV<TemplateData>('http://localhost:3000/api/template', fetcher);
    const updatePreview = ({html: newHTML, css: newCSS}: {html: string, css: string}) => {
      html.value = newHTML;
      css.value = newCSS;
    };

    watch(initialData, (newData) => {
      if(newData) {
        html.value = newData.html;
        css.value = newData.css;
      }
    }, {
      immediate: true
    });
    return { html, css, updatePreview };
  }
});
</script>

<style scoped>
.title {
  padding: 0 16px;
}
.wrapper {
  display: flex;
  width: 100%;
}
.admin-section {
  width: 50%;
  padding: 16px;
}
.preview-section {
  width: 50%;
  padding: 16px;
}
</style>
