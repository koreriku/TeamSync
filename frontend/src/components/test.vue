<template>
  <h1 class="mt-15">test</h1>
</template>

<script setup>
import axios from "axios";
const excelFunc = async () => {
  await axios.get("http://localhost:3000/work/testExcel").then((res) => {
    const a = document.createElement("a");
    a.href = res.data;
    a.click();
    a.remove();
  });
};
excelFunc();
</script>
