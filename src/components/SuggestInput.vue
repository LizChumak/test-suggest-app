<template>
  <div class="suggest-input">

    <div class="input-label"> 
      <!-- Лейбл инпута -->
      <label v-if="label">{{ label }}</label>
    </div>

    <div class="input-container">

      <!-- Поле ввода -->
      <input
        v-model="searchQuery"
        @input="handleInput"
        @keydown.down="moveDown"
        @keydown.up="moveUp"
        @keydown.enter="selectItem(item)"
        :aria-label="label || ''"
        :placeholder="placeholder"
      />

      <!-- Выбранные элементы (теги) -->
      <div v-if="selectedItems.length" class="selected-items">
        <div v-for="(item, index) in selectedItems" :key="item.id" class="selected-item">
          <span>@{{ item.alias }}</span>
          <button @click="removeItem(index)" aria-label="Удалить">×</button>
        </div>
      </div>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="loading">Загрузка...</div>

    <!-- Сообщение об отсутствии данных -->
    <div v-else-if="searchQuery && !suggestions.length" class="loading">Нет данных</div>

    <!-- Сообщение об ошибке -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Список саджестов -->
    <ul v-if="suggestions.length" class="suggestions-list" role="listbox">
      <li
        v-for="(item, index) in suggestions"
        :key="item.id"
        :class="{ active: index === activeIndex }"
        @click="selectItem(item)"
        @mouseover="activeIndex = index"
        :aria-selected="index === activeIndex">

    <!-- Отображение пользователя или компании -->
        <UserItem v-if="item.type === 'user'" :user="item" />
        <CompanyItem v-else :company="item" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import UserItem from './UserItem.vue';
import CompanyItem from './CompanyItem.vue';

// Интерфейс для элемента саджеста
interface Suggestion {
  id: number;
  type: 'user' | 'company';
  alias: string;
  name?: string;
  avatar?: string;
}

export default Vue.extend({
  components: { UserItem, CompanyItem },
  props: {
    label: {
      type: String,
      default: '',
    },
    apiUrl: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Введите имя или алиас',
    },
    maxSelectedItems: {
      type: Number,
      default: 1, // По умолчанию можно выбрать только один элемент
    },
  },
  data() {
    return {
      searchQuery: '', // Текст в инпуте
      suggestions: [] as Suggestion[], // Список саджестов
      selectedItems: [] as Suggestion[], // Массив выбранных элементов
      isLoading: false, // Состояние загрузки
      error: '', // Сообщение об ошибке
      activeIndex: -1, // Индекс активного элемента в списке
      debounceTimeout: null as number | null, // Таймер для дебаунса
    };
  },
  methods: {
    // Метод для запроса саджестов
    async fetchSuggestions(query: string) {

      // Если запрос меньше 3 символов, очищаем список саджестов и выходим
      if (query.length < 3) {
        this.suggestions = [];
        return;
      }

      // Устанавливаем состояние загрузки и очищаем ошибки
      this.isLoading = true;
      this.error = '';

      try {
        // Выполняем GET-запрос к API с параметром q
        const response = await axios.get(this.apiUrl, { params: { q: query } });
        // Обновляем список саджестов данными из ответа
        this.suggestions = response.data.data;
      } catch (err) {
        // Если произошла ошибка, сохраняем сообщение об ошибке
        this.error = 'Ошибка при загрузке данных';
      } finally {
        // В любом случае снимаем состояние загрузки
        this.isLoading = false;
      }
    },
    handleInput() {
      // Если таймер уже запущен, очищаем его
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      // Устанавливаем новый таймер с задержкой 300 мс
      this.debounceTimeout = setTimeout(() => this.fetchSuggestions(this.searchQuery), 300);
    },

    // Выбор элемента из списка
    selectItem(item?: Suggestion) {
      const selected = item || this.suggestions[this.activeIndex];
      if (selected && this.selectedItems.length < this.maxSelectedItems) {
        this.selectedItems.push(selected); // Добавляем элемент в массив выбранных
        this.searchQuery = '';
        this.suggestions = [];
        this.$emit('change', this.selectedItems); // Уведомляем родительский компонент
      }
    },

    // Очистка выбранного элемента
    removeItem(index: number) {
      this.selectedItems.splice(index, 1); // Удаляем элемент по индексу
      this.$emit('change', this.selectedItems); // Уведомляем родительский компонент
    },

    // Перемещение вниз по списку
    moveDown() {
      if (this.activeIndex < this.suggestions.length - 1) {
        this.activeIndex++;
      }
    },

    // Перемещение вверх по списку
    moveUp() {
      if (this.activeIndex > 0) {
        this.activeIndex--;
      }
    },
  },
});
</script>
  
  <style scoped>
  .suggest-input {
    width: 350px;
  }
  
  .input-container {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    height: 35px;
    padding: 5px;
  }

  .input-label {
    display: flex;
  }
  
  input {
    flex: 1;
    width: 1%;
    border: none;
    outline: none;
  }
  
  .selected-item {
    display: flex;
    align-items: center;
    width: auto;
    background: #f0f0f0;
    padding: 4px 8px;
    margin-left: 8px;
    border-radius: 4px;
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    margin-left: 4px;
  }
  
  .suggestions-list {
    max-height: 200px;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    overflow-y: auto;
  }
  
  .suggestions-list li {
    padding: 8px;
    cursor: pointer;
  }
  
  .suggestions-list li.active {
    background: #f0f0f0;
  }
  
  .loading {
    padding: 8px;
    color: #666;
  }

  .error {
    padding: 8px;
    color: #fb3c3c;
  }
  </style>