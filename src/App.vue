<script setup>
import { ref } from 'vue'
import useRefHistory from "./useRefHistory.ts"
import useManualRefHistory from "./useManualRefHistory.ts"

// create by https://github.com/hotdogc1017

const isEdit = ref(false);
const msg = ref('Hello World!')
const { history, commit, undo, clear, undoUpdate } = useManualRefHistory(msg);
const showEdit = () => {
  isEdit.value = true;
}
const confirm = () => {
  commit();
  isEdit.value = false;
}
const cancel = () => {
  undoUpdate();
  isEdit.value = false;
}
</script>

<template>
  <div v-if="!isEdit">
    <p>
    <h1>{{ msg }}</h1>
    <button @click="showEdit()">编辑</button>
    <button @click="undo()">撤销</button>
    <button @click="clear()">清空</button>
    </p>
    <ul>
      <li v-for="value in history">{{ value }}</li>
    </ul>
  </div>
  <div v-else>
    <input v-model="msg" />
    <button @click="confirm()">确认</button>
    <button @click="cancel()">取消</button>
  </div>
</template>

<style scoped></style>
