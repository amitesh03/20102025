<template>
  <div class="hello-world">
    <h1>{{ message }}</h1>
    <button @click="increment">Count: {{ count }}</button>
    <input v-model="inputValue" placeholder="Type something..." />
    <p>You typed: {{ inputValue }}</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      message: 'Hello Vue.js!',
      count: 0,
      inputValue: ''
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<style scoped>
.hello-world {
  padding: 20px;
  text-align: center;
}

button {
  margin: 10px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input {
  padding: 8px;
  margin: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>