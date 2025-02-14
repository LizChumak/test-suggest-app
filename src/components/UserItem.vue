<template>
    <div class="user-item">
      <div>
         <img :src="user.avatar || 'default-person.png'" />
      </div>
      <div class="user-item-name">
         <div class="user-item-alias">{{ user.name || user.alias }}</div>
         <div class="user-item-type">@{{ user.alias }}</div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import Vue from 'vue';
  
  export default Vue.extend({
    props: {
      user: {
        type: Object as () => { alias: string; name?: string; avatar?: string },
        required: true,
      },
    },
  });
  </script>

<style scoped>
.user-item {
   display: flex;
   align-items: center;

  img {
    width: 30px;
    height: 30px;
    border-radius: 3px;
  }

   .user-item-name {
      display: block;
      padding-left: 10px;

      .user-item-alias {
         display: flex;
      }
      .user-item-type {
         display: flex;
         color: #bbb;
      }
   }
}
</style>