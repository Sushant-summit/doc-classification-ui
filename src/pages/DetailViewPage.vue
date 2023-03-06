<template>
  <div class="mainContainer">
    <nav>
      <h2>Detail View</h2>
    </nav>
    <div class="containerDoc">
      <div class="DocDetailViewer">
        <v-expansion-panels>
          <v-expansion-panel v-for="(feature,idx) in this.features" :key="feature.name" @click="scrollToAFeature(feature.coordinates[0], feature.coordinates[1])">

            <v-expansion-panel-title>
              <div style="display:flex; justify-content:space-between; width: 100%; align-items: center;">
                <div>
                  {{ idx + 1 + '. ' + feature.name }}
                </div>

                <div class="text-center">
                  <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                      <v-btn v-if="!feature.action || feature.action==''" v-bind="props" density="comfortable" style="font-size:x-small; color: white !important;; margin: 0 5px;" color="orange" variant="flat">
                        <span>Take action</span>
                      </v-btn>

                      <div v-else :style="{color: feature.action.color}">{{ feature.action.title }}ed</div>

                    </template>

                    <v-list style="padding: 0">
                      <v-list-item v-for="(item, index) in items" :key="index">
                        <v-list-item-title @click="onActionClick(feature,item)" :style="{color: item.color, fontSize: 'small', fontWeight: 'medium'}">{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text class="pa-4">
              <v-progress-linear model-value="100" style="height:1px; color: grey; margin: 5px 0px;"></v-progress-linear>

              <div class="details">
                <h5 style="font-weight:600">Details</h5>
                <v-table style="font-size:smaller">
                  <tbody>
                    <tr v-for="label in Object.keys(feature)" :key="label">
                      <td v-if="label != 'coordinates' && label != 'name' && label != 'action'">{{ label }}</td>
                      <td v-if="label != 'coordinates' && label != 'name' && label != 'action'" style="color: black; font-weight: bold;">{{ feature[label] }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

      </div>
      <div class="DocViewer" >
        <div style="width:100%; overflow: auto;" ref="docViewer">
          <canvas ref='imageCanvas' style="width: 100%"></canvas>
        </div>
        <v-slider v-model="canvasScale" :min="10" :max="100" :step="1" thumb-label style="width: 80%; height: 20px;"></v-slider>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [
      { title: 'Accept', color: 'green' },
      { title: 'Reject', color: 'red' },
      { title: 'Refer', color: 'orange' },
    ],
    canvasScale: 10,
  }),
  props: {
    features: Array,
    image: Object,
  },
  methods: {
    onActionClick(feature, item) {
      feature.action = item;
    },
    createBox(x, y, width, height, color = 'black', idx) {
      const canvas = this.$refs.imageCanvas;
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.font = "700 80px Arial";
      ctx.lineWidth = (15/this.canvasScale)*10;
      ctx.strokeStyle = color;
      ctx.fillStyle = 'black';
      ctx.fillText(idx, x - 80, y + 50);
      ctx.rect(x, y, width, height);
      ctx.stroke();
    },

    scrollToAFeature(x, y) {
      const viewer = this.$refs.docViewer;
      viewer.scrollTop = y;
      viewer.scrollLeft = x;
    },

    setCanvasScale(scale) {
      var canvas = this.$refs.imageCanvas;
      canvas.style.width = `${10*scale}%`;
      this.renderOnCanvas();
    },

    renderOnCanvas(scale = 10) {
      const component = this;
      const features = component.features;
      const createBox = component.createBox;

      console.log(this.image)

      var canvas = component.$refs.imageCanvas;
      var ctx = canvas.getContext('2d');
      var imageObj = new Image();

      imageObj.onload = function () {
        //setting base height and width of canvas so we can scale
        console.log("image obj", imageObj);
        component.canvasHeight = this.height;
        component.canvasWidth = this.width;

        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;

        ctx.drawImage(imageObj, 0, 0, this.width, this.height);

        features.forEach((feature, idx) => {
          let x = feature.coordinates[0];
          let y = feature.coordinates[1];
          let height = feature.coordinates[3] - feature.coordinates[1];
          let width = feature.coordinates[2] - feature.coordinates[0];
          let color = feature.probability < 0.8 ? 'red' : '#7CFC00';
          createBox(x, y, width, height, color, idx + 1);
        })
      };
      imageObj.src = this.image;
    }
  },

  watch: {
    canvasScale(value) {
      this.setCanvasScale(value)
    }
  },


  mounted() {
    this.renderOnCanvas();
  }
}
</script>



<style scoped>
.mainContainer {
  width: 100%;
  background-color: white;
  border-radius: 10px;
}

nav {
  background-color: var(--gray2);
  color: var(--light);
  border-radius: 10px 10px 0px 0px;
  border-bottom: 1px solid grey;
  padding: 10px 20px;
}
.containerDoc {
  width: 100%;
  display: flex;
  padding: 10px;
  max-height: 75vh;
  min-height: 75vh;
}

.DocViewer,
.DocDetailViewer {
  flex: 1;
  background-color: white;
  padding: 20px;
}

.DocViewer {
  display: flex;
  margin-left: 10px;
  flex-direction: column;
  align-items: center;
  background-color: #eef2f5;
  position: relative;
}

.DocViewer {
  border: 2px var(--purple) solid;
  border-radius: 2%;
}

.DocDetailViewer {
  overflow-y: auto;
  background-color: inherit;
  width: 40%;
}

p {
  color: grey;
}

.details {
  margin-top: 10px;
}

.flexRow {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dotted grey;
  padding: 10px 0px;
}

.v-list-item:hover {
  background-color: #eef2f5;
}
</style>