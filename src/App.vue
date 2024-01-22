<template>
  <div id="app">
    <header>
      <h1>Circle Drawing App</h1>
    </header>
    <main>
      <circle-drawing></circle-drawing>
    </main>
    <footer>
      <p>&copy; 2024 Circle Drawing App</p>
    </footer>
  </div>
</template>

<script>
import CircleDrawing from './components/CircleDrawing.vue';

export default {
  components: {
    CircleDrawing,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

header {
  background-color: #3498db;
  padding: 20px;
  color: #fff;
}

header h1 {
  margin: 0;
  font-size: 2em;
}

main {
  margin: 20px;
}

footer {
  margin-top: 20px;
  background-color: #34495e;
  padding: 10px;
  color: #fff;
}
</style>
