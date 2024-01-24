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
  // Fetch circles before the component is created
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
      next(); // proceed with component creation even if there's an error
    });
},


  beforeRouteUpdate(to,  next) {
  // Fetch circles before the route is updated
  this.getCirclesBySetId(to.params.setId); // eslint-disable-line no-unused-vars
  next();
},

  methods: {
    

    async generateNewId() {
      console.log(this.$router);
      try {
        // Make a request to the backend API to generate a new ID
        const response = await apiService.get('/circles/GenerateNewId');

        // Extract the new ID from the response
        const newId = response.data.newId;

        await this.$router.push({ name: 'CircleDrawingWithNewId', params: { newId }});

        return newId;
      } catch (error) {
        // Handle errors appropriately (e.g., log, throw, etc.)
        console.error('Error generating new ID:', error);
        throw error; // Propagate the error or handle it as needed
      }
      },
    
      clearInputFields() {
      // Clear the input fields
      this.x = 0;
      this.y = 0;
      },

      clearCanvas() {
      // Clear the canvas by redrawing it with no circles
      const ctx = this.$refs.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);

      // Clear the drawn circles data
      this.drawnCircles = [];
      },

      clearTable() {
      // Clear the table by emptying the existingCircles array
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
          
          console.log(response.data); // Log the server response
        
          // Update the last submission
          this.lastSubmission.x = this.x;
          this.lastSubmission.y = this.y;
          this.lastSubmission.setId = this.drawnCircle.setId;
        } catch (error) {
          console.error('Error submitting circle:', error);
        }
        }
        else {
        // Display an alert for invalid form
        alert('Invalid input! Please enter positive values for X and Y.');
      }
    },
      async getCirclesBySetId(setId) {
        try {

          // Pass the setId parameter to the API service method
          const response = await apiService.getCirclesBySetId(setId);
          console.log('Fetched Circles:', response.data);
          //this.existingCircles = response.data;

          const circles = response.data;
          // Ensure existingCircles is an array
          this.existingCircles = Array.isArray(circles) ? circles : [];

          this.drawExistingCircles();
          // Set the X and Y values directly based on the coordinates of the first circle
          if (this.existingCircles.length > 0) {
                this.x = this.existingCircles[0].x;
                this.y = this.existingCircles[0].y;
              } else {
                // Default values if no circles are found
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
          // Use Vue Router to navigate to the route with the desired Set ID
          this.$router.push({ name: 'CircleDrawing', params: { setId: this.desiredSetId } });
        }
      },
      drawExistingCircles() {
        const ctx = this.$refs.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);

        // Sort circles by diameter (largest to smallest)
        const sortedCircles = this.existingCircles.slice().sort((a, b) => b.diameter - a.diameter);

        for (const circle of sortedCircles) {
          const { x: centerX, y: centerY, diameter, color } = circle; // Map properties accordingly

          // Ensure the circle stays entirely within the canvas boundaries
          const maxX = this.$refs.canvas.width - diameter;
          const maxY = this.$refs.canvas.height - diameter;

          // Calculate the actual position of the circle within the canvas
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
          // Draw circle on the canvas based on user input
          const ctx = this.$refs.canvas.getContext('2d');

          // Calculate a random diameter and color
          const diameter = Math.random() * this.$refs.canvas.width / 2; // Limit diameter to half of the canvas width
          const color = getRandomColor();

          // Calculate the center position of the circle
          const centerX = this.$refs.canvas.width / 2;
          const centerY = this.$refs.canvas.height / 2;

          // Ensure the circle stays entirely within the canvas boundaries
          const maxX = this.$refs.canvas.width - diameter;
          const maxY = this.$refs.canvas.height - diameter;

          // Calculate random positions within the canvas
          const randomX = Math.random() * maxX;
          const randomY = Math.random() * maxY;


          // Calculate the actual position of the circle within the canvas
          const circleX = Math.min(maxX, Math.max(0, centerX + (randomX - centerX)));
          const circleY = Math.min(maxY, Math.max(0, centerY + (randomY - centerY)));

          const setId = this.generateSetId(this.x, this.y);

          if (this.lastSubmission.x === this.x && this.lastSubmission.y === this.y) {
            // If current x and y are the same as the last submission, use the same setId
            this.drawnCircle.setId = this.lastSubmission.setId;
          } else {
            // If x and y are different, use the newly generated setId
            this.drawnCircle.setId = setId;
          }

          ctx.beginPath();
          ctx.arc(circleX, circleY, diameter / 2, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.closePath();

          // Store drawn circle information
          this.drawnCircle.diameter = diameter;
          this.drawnCircle.color = color;
          this.drawnCircle.setId = setId;

        },
        generateSetId(x, y) {
        // Generate a unique setId using a combination of x and y
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
  margin-top: 10px; /* Add margin between buttons */
}
.button-container button {
  margin-right: 10px; /* Add right margin to each button */
}

.circle-table {
  margin-top: 20px; /* Add margin between the canvas and the table */
}

.drawnCircle{
  margin-top: 20px; 
  margin-bottom: 20px;
}


</style>