<template>
  <div v-html="customTemplate"></div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import useSWRV from 'swrv';
import axios, { AxiosResponse } from 'axios';

interface TemplateData {
  html: string;
  css: string;
}

interface ApiResponse {
  title: string;
  image: string;
  text: string;
}

// Стандартный шаблон
const defaultTemplate = `
<div class="card">
    <img class="card-img" src={{ image }} alt='Card Image' loading="lazy">
    <div class="card-inner">
        <div class="card-title">{{ title }}</div>
        <div class="card-text">{{ text }}</div>
        <button class="card-button">Buttons</button>
    </div>
</div
`;

// Стандартные стили
const defaultCSS = `
  .card {
    width: 226px;
  }

  .card-inner {
    border-right: 1px solid #E8EBED;
    border-bottom: 1px solid #E8EBED;
    border-left: 1px solid #E8EBED;
    border-radius: 0px 0px 0.5rem 0.5rem;
    padding: 0.9375rem 0.875rem;
  }

  .card-img {
    display: block;
    position: relative;
    width: 226px;
    height: 125px;
    border-radius: 0.5rem 0.5rem 0px 0px;
    background: #DD9A87;
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 600;
    padding-bottom: 0.375rem;
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 600;
  }

  .card-text {
    font-size: 0.6875rem;
    font-weight: 400;
    line-height: 18px;
  }

  .card-button {
    margin-top: 17px;
    border-radius: 4px;
    background: #6F50F0;
    padding: 7px 12px;
    color: #fff;
    border: 0;
    cursor: pointer;
  }
`;

export default defineComponent({
  name: 'PreviewComponent',
  props: {
    customHtml: { type: String, default: null },
    customCss: { type: String, default: null },
  },
  setup(props) {
    function fetcher<T>(url: string): Promise<T> {
      return axios.get<T, AxiosResponse<T>>(url).then(res => res.data);
    }

    const instanceData = {
      html: ref(props.customHtml),
      css: ref(props.customCss),
    };


    // Получаем данные и шаблон
    const { data: templateData } = useSWRV<TemplateData>('http://localhost:3000/api/template', fetcher);
    const { data: responseData } = useSWRV<ApiResponse>('http://localhost:3000/api/data', fetcher);

    const fetchTemplateData = computed(() => {
      return {
        html: props.customHtml ?? templateData.value?.html,
        css: props.customCss ?? templateData.value?.css,
      };
    });

    watch(fetchTemplateData, (newData) => {
      // Если обновился шаблог, применяем его
      instanceData.html.value = newData.html;
      instanceData.css.value = newData.css;
    }, { immediate: true });

    const customTemplate = computed(() => {
      // Loader, пока загружаются данные
      if (!responseData.value || !fetchTemplateData.value) return '<h1>Loading...</h1>';

      // Подставляем стили и шаблон, добавив в них переменные
      const styles = `<style>${fetchTemplateData.value.css || defaultCSS}</style>`;
      return styles + (fetchTemplateData.value.html || defaultTemplate)
          .replace('{{ title }}', responseData.value.title)
          .replace('{{ image }}', responseData.value.image)
          .replace('{{ text }}', responseData.value.text);
    });

    return { customTemplate };
  }
});
</script>
