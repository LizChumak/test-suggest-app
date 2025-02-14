<template>
    <div id="app">
      <h2>Тестовое задание vuejs</h2>
      <!-- Компонент саджеста -->
      <SuggestInput
      label="* Пользователь и компания"
      :apiUrl="apiUrl"
      placeholder="Введите логин"
      :maxSelectedItems="3"
      @change="handleChange"
    />
    </div>
  </template>
  
  <script lang="ts">
  import Vue from 'vue';
  import SuggestInput from './components/SuggestInput.vue';
  
  export default Vue.extend({
    components: { SuggestInput },
    data() {
      return {
        apiUrl: 'https://habr.com/kek/v2/publication/suggest-mention',
      };
    },
    methods: {
      // Обработчик изменения выбранного элемента
      handleChange(selectedItems: any[]) {
        console.log('Выбранные элементы:', selectedItems);
      },
    }
  });
  </script>
  
  <style>
  #app {
    font-family: Arial;
    text-align: center;
    margin-top: 60px;
  }
  </style>