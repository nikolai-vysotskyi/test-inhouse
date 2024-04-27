<template>
  <div class="template-editor">
    <prism-editor
        v-model="htmlLocal"
        class="editor"
        placeholder="Vuejs code"
        :highlight="onHighlightHTML"
        lang="markup"
        line-numbers
    />
    <prism-editor
        v-model="cssLocal"
        class="editor"
        placeholder="CSS code"
        :highlight="onHighlightCSS"
        lang="css"
        line-numbers
    />
    <button class="template-save" @click="saveTemplate">Save</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import axios from "axios";
import "vue-prism-editor/dist/prismeditor.min.css";
import { PrismEditor } from "vue-prism-editor";
import Prism from "prismjs";
import 'prismjs/components/prism-css.min.js';
import 'prismjs/components/prism-markup.min.js';
import 'prismjs/themes/prism-tomorrow.css';

interface TemplateData {
  html: string;
  css: string;
}

export default defineComponent({
  name: 'TemplateEditor',
  props: {
    html: String,
    css: String
  },
  components: {
    PrismEditor
  },
  setup(props, { emit }) {
    const htmlLocal = ref(props.html);
    const cssLocal = ref(props.css);

    // Обновляем данные в шаблоне при изменении пользователем
    watch(htmlLocal, (newHTML) => {
      emit('update:input', { html: newHTML, css: cssLocal.value });
    });

    watch(cssLocal, (newCSS) => {
      emit('update:input', { html: htmlLocal.value, css: newCSS });
    });

    // Сохраняем шаблон, отправив его на сервер
    const saveTemplate = async () => {
      try {
        if (htmlLocal.value === undefined || cssLocal.value === undefined) {
          alert('HTML or CSS content is missing. Please check and try again.');
          return;
        }

        const payload: TemplateData = {
          html: htmlLocal.value,
          css: cssLocal.value,
        };
        await axios.post('http://localhost:3000/api/template', payload);
        alert('Template saved successfully!');
      } catch (error) {
        alert('Failed to save template.');
        console.error('Error:', error);
      }
    };

    // Стили и правила для HTML и CSS в textarea
    const onHighlightHTML = (code: string) => {
      return Prism.highlight(code, Prism.languages.markup, 'markup');
    };
    const onHighlightCSS = (code: string) => {
      return Prism.highlight(code, Prism.languages.css, 'css');
    };

    return { htmlLocal, cssLocal, saveTemplate, onHighlightHTML, onHighlightCSS };
  },
});
</script>

<style>
.editor {
  height: 192px;
  width: 100%;
  background: #f5f2f0;
  color: #000;
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 16px 16px 16px 0;
  margin-bottom: 16px;
  border-radius: 8px;
}

.prism-editor__container {
  height: 192px;
}

.prism-editor__textarea{
  height: 192px;
}

.prism-editor__textarea:focus {
  outline: none;
}

.template-save {
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 500;
  background: #6F50F0;
  color: #ffffff;
  border-radius: 4px;
  border: 0;
  cursor: pointer;
}
</style>
