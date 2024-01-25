<template>
  <div id="app">
    <header>
      <h1 class="title">Circle Drawing App</h1>
    </header>
    <main>
      <circle-drawing></circle-drawing>
    </main>
    <footer>
      <p>&copy; 2024 Circle Drawing App</p>
    </footer>
    <button @click="playAudio">Play Audio</button>
    <audio ref="audio" src="/sound.mp3" preload="auto"></audio>
  </div>
</template>

<script>
import CircleDrawing from './components/CircleDrawing.vue';

export default {
  methods: {
    handleUserInteraction() {
    this.$root.hasUserInteracted = true;

    document.body.removeEventListener('click', this.handleUserInteraction);

    this.$refs.audio.play();
  },

  playAudio() {
    const hasUserInteracted = this.$root.hasUserInteracted;

    if (!hasUserInteracted) {
      return;
    }},
}
,
  data() {
  return {
    hasUserInteracted: false,
  };
},
  components: {
    CircleDrawing,
  },
  mounted() {
    document.body.addEventListener('click', this.handleUserInteraction);
  },
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: url('./assets/png.png');
  background-size: cover; 
  min-height: 100vh; 
  position: relative;
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
  flex: 1;
  margin: 20px;
}

footer {
  margin-top: auto;
  background-color: #34495e;
  padding: 10px;
  color: #fff;
}

.title {
  font-size: 2rem;
  color: #fff;
  margin-top: 20px;
  opacity: 0; 
  animation: fadeInTitle 3.5s ease forwards;
}

@keyframes fadeInTitle {
  to {
    opacity: 1; 
  }
}
</style>
