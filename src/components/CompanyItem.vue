<template>
    <div class="company-item">
      <div>
        <img :src="company.avatar || 'default-company.png'" />
      </div>
      <div class="company-item-name">
        <div class="company-item-alias">{{ company.name || company.alias }}</div>
        <div class="company-item-type">Компания</div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import Vue from 'vue';
  
  export default Vue.extend({
    props: {
      company: {
        type: Object as () => { alias: string; name?: string; avatar?: string },
        required: true,
      },
    },
  });
  </script>

  <style scoped>
    .company-item {
      display: flex;
      align-items: center;

      img {
        width: 30px;
        height: 30px;
        border-radius: 3px;
      }

      .company-item-name {
        display: block;
        padding-left: 10px;

        .company-item-alias {
          display: flex;
        }
        .company-item-type {
          display: flex;
          color: #bbb;
        }
      }
    }
  </style>