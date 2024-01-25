<template>
  <div class="circle-drawing-container">
    <div class="input-container">
      <div>
        <label><strong>X:</strong></label>
        <input v-model="x" type="number" />
      </div>
      <div>
        <label><strong>Y:</strong></label>
        <input v-model="y" type="number" />
      </div>
    </div>
    <div class="button-container">
    <button @click="submitCircle">Submit</button>
    <button @click="promptForSetId">Load Circles</button>
    <button @click="clearInputFields">Clear Fields</button>
    </div>
    <canvas ref="canvas" @click="drawCircle"></canvas>
    <div class="button-container"> <button @click="clearCanvas">Clear Canvas</button> </div>
    <div class="drawnCircle">
      <strong>Drawn Circle:</strong>
      <div>Diameter: {{ drawnCircle.diameter }}</div>
      <div>Color: {{ drawnCircle.color }}</div>
      <div>Set ID: {{ drawnCircle.setId }}</div>
    </div>
    <div>
  <strong>Drawn Circles in Set:</strong>
  <table class="circle-table">
    <thead>
      <tr>
        <th>Diameter</th>
        <th>Color</th>
        <th>Set ID</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(circle, index) in existingCircles" :key="index">
        <td>{{ circle.diameter }}</td>
        <td>
          <div class="color-circle" :style="{ backgroundColor: circle.color }"></div>
        </td>
        <td>{{ circle.setId }}</td>
      </tr>
    </tbody>
  </table>
  <div class="button-container"><button @click="clearTable">Clear Table</button></div>
</div>

  </div>
</template>

<script>

import apiService from '@/services/apiService';
export default {
  data() {
    return {
      x: 0,
      y: 0,
      drawnCircles: [], // Array to store all circles in the set
      lastSubmission: { x: null, y: null }, 
      drawnCircle: {
        diameter: 0,
        color: '',
        setId: '',
        desiredSetId: ''
      },
      existingCircles: [],
    };
  },
  computed: {
    isValidX() {
      return this.x >= 0; // Adjust validation logic as needed
    },
    isValidY() {
      return this.y >= 0; // Adjust validation logic as needed
    },
    isValidForm() {
      return this.isValidX && this.isValidY;
    },
  },

  watch: {
    $route(to) {
      // Fetch circles when the route changes
      this.getCirclesBySetId(to.params.setId);
    },
  },

  beforeRouteEnter(to, from, next) {
  apiService.getCirclesBySetId(to.params.setId)
    .then(response => {
      const circles = response.data;
      next(vm => {
        vm.existingCircles = circles;
        vm.drawExistingCircles();
      });
    })
    .catch(error => {
      console.error('Error fetching circles:', error);
      next(); 
    });
},


  beforeRouteUpdate(to,  next) {
  this.getCirclesBySetId(to.params.setId);
  next();
},

  methods: {
    

    async generateNewId() {
      console.log(this.$router);
      try {
        const response = await apiService.get('/circles/GenerateNewId');

        const newId = response.data.newId;

        await this.$router.push({ name: 'CircleDrawingWithNewId', params: { newId }});

        return newId;
      } catch (error) {
        console.error('Error generating new ID:', error);
        throw error; 
      }
      },
    
      clearInputFields() {
      this.x = 0;
      this.y = 0;
      },

      clearCanvas() {
      const ctx = this.$refs.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);

      this.drawnCircles = [];
      },

      clearTable() {
      this.existingCircles = [];
      },

      async submitCircle() {
        
        if (this.isValidForm) {
        try {
          this.drawCircle();
          

          const requestData = {
            x: this.x,
            y: this.y,
            diameter: this.drawnCircle.diameter,
            color: this.drawnCircle.color,
            setId: this.drawnCircle.setId,
          };
          console.log('Request Data:', requestData);

          const response = await apiService.submitCircle(requestData);
          
          console.log(response.data);
        
          this.lastSubmission.x = this.x;
          this.lastSubmission.y = this.y;
          this.lastSubmission.setId = this.drawnCircle.setId;
        } catch (error) {
          console.error('Error submitting circle:', error);
        }
        }
        else {
        alert('Invalid input! Please enter positive values for X and Y.');
      }
    },
      async getCirclesBySetId(setId) {
        try {

          const response = await apiService.getCirclesBySetId(setId);
          console.log('Fetched Circles:', response.data);

          const circles = response.data;
          this.existingCircles = Array.isArray(circles) ? circles : [];

          this.drawExistingCircles();
          if (this.existingCircles.length > 0) {
                this.x = this.existingCircles[0].x;
                this.y = this.existingCircles[0].y;
              } else {
                this.x = 0;
                this.y = 0;
              }
            
        } catch (error) {
          console.error('Error fetching circles:', error);
        }
        //this.getCirclesBySetId(this.desiredSetId);
          },
          promptForSetId() {
        this.desiredSetId = prompt('Enter the desired setId:');
        if (this.desiredSetId) {
          this.$router.push({ name: 'CircleDrawing', params: { setId: this.desiredSetId } });
        }
      },
      drawExistingCircles() {
        const ctx = this.$refs.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);

        const sortedCircles = this.existingCircles.slice().sort((a, b) => b.diameter - a.diameter);

        for (const circle of sortedCircles) {
          const { x: centerX, y: centerY, diameter, color } = circle; // Map properties accordingly

          const maxX = this.$refs.canvas.width - diameter;
          const maxY = this.$refs.canvas.height - diameter;

          const circleX = Math.min(maxX, Math.max(0, centerX - diameter / 2));
          const circleY = Math.min(maxY, Math.max(0, centerY - diameter / 2));

          ctx.beginPath();
          ctx.arc(circleX + diameter / 2, circleY + diameter / 2, diameter / 2, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.closePath();

        }
      },
        drawCircle() {
          const ctx = this.$refs.canvas.getContext('2d');

          const centerX = this.x;
          const centerY = this.y;

          const diameter = Math.random() * this.$refs.canvas.width / 2; // Limit diameter to half of the canvas width
          const color = getRandomColor();

          const maxX = this.$refs.canvas.width - diameter;
          const maxY = this.$refs.canvas.height - diameter;

          //const randomX = Math.random() * maxX;
          //const randomY = Math.random() * maxY;

          //const circleX = Math.min(maxX, Math.max(0, centerX + (randomX - centerX)));
          //const circleY = Math.min(maxY, Math.max(0, centerY + (randomY - centerY)));
          
          const circleX = Math.min(maxX, Math.max(0, centerX - diameter / 2));
          const circleY = Math.min(maxY, Math.max(0, centerY - diameter / 2));

          const setId = this.generateSetId(this.x, this.y);

          if (this.lastSubmission.x === this.x && this.lastSubmission.y === this.y) {
            this.drawnCircle.setId = this.lastSubmission.setId;
          } else {
            this.drawnCircle.setId = setId;
          }

          ctx.beginPath();
          ctx.arc(circleX + diameter / 2, circleY + diameter / 2, diameter / 2, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.closePath();

          this.drawnCircle.diameter = diameter;
          this.drawnCircle.color = color;
          this.drawnCircle.setId = setId;

        },
        generateSetId(x, y) {
        return `${x}-${y}`;
    },
        
      },
};

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
</script>

<style scoped>
.circle-drawing-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.input-container {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

label {
  margin-right: 10px;
}

label strong {
  font-weight: bold;
}

input {
  margin-bottom: 10px;
}

button {
  background-color: #3498db;
  color: white;
  padding: 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}

canvas {
  border: 1px solid #ddd;
  margin-top: 20px;
}

.circle-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.circle-table th, .circle-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
}

.color-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-block;
}
.button-container {
  margin-top: 10px; 
}
.button-container button {
  margin-right: 10px; 
}

.circle-table {
  margin-top: 20px; 
}

.drawnCircle{
  margin-top: 20px; 
  margin-bottom: 20px;
}


</style>