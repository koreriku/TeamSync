<script setup>
import { watch, ref } from "vue";
import { Marked } from "marked";
import { mangle } from "marked-mangle";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { markDownColor } from "../../store/common.js";

const props = defineProps({
  source: {
    type: String,
    required: true,
  },
});
const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      if (
        (typeof lang === "string" || lang instanceof String) &&
        lang.includes(":")
      ) {
        lang = lang.substring(0, lang.indexOf(":"));
      }
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);
let options = {
  prefix: "my-prefix-",
};

const compiledMarkdown = ref("");
const renderer = new marked.Renderer();
renderer.heading = function (text, level, raw, slugger) {
  {
    let mapping = {
      1: "text-h4 title",
      2: "text-h5 title",
      3: "text-h6",
      4: "text-h7",
    };
    if (this.options.headerIds) {
      const id = this.options.headerPrefix + slugger.slug(raw);
      return `<h${level} id="${id}" style="border-bottom-color: ${markDownColor.value};" class="${mapping[level]}">${text}</h${level}>\n`;
    }

    // ignore IDs
    return `<h${level} class="${mapping[level]}" style="border-bottom-color: ${markDownColor.value};">${text}</h${level}>\n`;
  }
};

renderer.table = function (header, body) {
  return `
    <table class="table">
      <thead>${header}</thead>
      <tbody>${body}</tbody>
    </table>
  `;
};

renderer.list = function (body, ordered) {
  if (ordered) {
    // 順序付きリストの場合
    return "<ol class='list'>" + body + "</ol>";
  } else {
    // 無順序リストの場合
    return "<ul class='list'>" + body + "</ul>";
  }
};

renderer.image = (src) => {
  return `<img src="${src}" class="img">`;
};

marked.use(mangle()).use(gfmHeadingId(options)).use({ renderer });

if (props.source) {
  compiledMarkdown.value = marked.parse(props.source);
}

watch(
  () => props.source,
  () => {
    compiledMarkdown.value = marked.parse(props.source);
  }
);
</script>

<template>
  <div class="markdown-container" v-html="compiledMarkdown" />
</template>

<style>
.title {
  border-bottom: 1px solid;
  padding: 3px 0 3px;
}

.list {
  margin-left: 1.5rem;
  margin-bottom: 1.25rem;
}
.list li {
  margin-bottom: -1.25rem;
}
.list li .list {
  margin-top: 0.2rem;
  margin-bottom: -1.5rem;
}

pre {
  margin-bottom: 1rem;
}

.markdown-container {
  white-space: pre-line;
  font-size: 1rem;
  line-height: 1.5rem;
}

.table {
  border-collapse: separate;
  border-spacing: 0;
}

.table th:last-child {
  border-right: 1px solid #757575;
}

.table th {
  text-align: center;
  color: black;
  background-color: #bdbdbd;
  border-left: 1px solid #757575;
  border-top: 1px solid #757575;
  border-bottom: 1px solid #757575;
  padding: 5px 10px;
}

.table td {
  border-left: 1px solid #757575;
  border-bottom: 1px solid #757575;
  border-top: none;
  padding: 5px 10px;
}

.table td:last-child {
  border-right: 1px solid #757575;
}

.img {
  max-width: 80%;
  margin: 0 auto;
  display: block;
}
</style>
