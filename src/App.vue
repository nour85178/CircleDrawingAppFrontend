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
    // Set the flag to true once there's user interaction
    this.$root.hasUserInteracted = true;

    // Remove the event listener to avoid unnecessary checks
    document.body.removeEventListener('click', this.handleUserInteraction);

    // Play the audio
    this.$refs.audio.play();
  },

  playAudio() {
    // Check if the document has received user interaction
    const hasUserInteracted = this.$root.hasUserInteracted;

    if (!hasUserInteracted) {
      // If not, wait for user interaction to play the audio
      // Note: The actual playing will happen in handleUserInteraction
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
  background-size: cover; /* This will make sure the image covers the entire #app container */
  min-height: 100vh; /* This ensures that the #app container takes at least the full height of the viewport */
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
  opacity: 0; /* Initially set the opacity to 0 */
  animation: fadeInTitle 3.5s ease forwards; /* Animation duration and type */

}

@keyframes fadeInTitle {
  to {
    opacity: 1; /* Fade in by setting opacity to 1 */
  }
}
</style>
