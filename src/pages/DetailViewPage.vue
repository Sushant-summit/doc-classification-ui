<template>
  <div class="mainContainer">
    <nav>
      <h2>Detail View</h2>
    </nav>
    <div class="containerDoc">
      <div class="DocDetailViewer">
        <v-expansion-panels>
          <v-expansion-panel v-for="feature in this.features" :key="feature.name" @click="scrollToAFeature(feature.coordinates[0], feature.coordinates[1])">

            <v-expansion-panel-title >
              <div style="display:flex; justify-content:space-between; width: 100%; align-items: center;">
              <div>
                {{ feature.name }}
              </div>

              <div class="text-center">
                <v-menu open-on-hover>
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" density="comfortable" style="font-size:x-small; color: white !important;; margin: 0 5px;" color="orange" variant="flat">
                      Take action
                    </v-btn>
                  </template>

                  <v-list style="padding: 0">
                    <v-list-item v-for="(item, index) in items" :key="index">
                      <v-list-item-title :style="{color: item.color, fontSize: 'small', fontWeight: 'medium'}">{{ item.title }}</v-list-item-title>
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
                      <td v-if="label != 'coordinates' && label != 'name'">{{ label }}</td>
                      <td v-if="label != 'coordinates' && label != 'name'" style="color: black; font-weight: bold;">{{ feature[label] }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div class="DocViewer" ref="docViewer">
        <canvas ref='imageCanvas' style="width: 80%"></canvas>
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
  }),
  props: {
    features: Array,
  },
  methods: {
    createBox(x, y, width, height, color = 'black') {
      const canvas = this.$refs.imageCanvas;
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.lineWidth = 15;
      ctx.strokeStyle = color;
      ctx.rect(x, y, width, height);
      ctx.stroke();
    },

    scrollToAFeature(x, y) {
      const viewer = this.$refs.docViewer;
      viewer.scrollTop = y;
      viewer.scrollLeft = x;
    }
  },

  mounted() {
    const features = this.features;
    const createBox = this.createBox;

    var canvas = this.$refs.imageCanvas;
    var ctx = canvas.getContext('2d');
    var imageObj = new Image();
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    imageObj.onload = function () {
      ctx.canvas.width = this.width;
      ctx.canvas.height = this.height;
      ctx.drawImage(imageObj, 0, 0, this.width, this.height);

      features.forEach(feature => {
        let x = feature.coordinates[0];
        let y = feature.coordinates[1];
        let height = feature.coordinates[3] - feature.coordinates[1];
        let width = feature.coordinates[2] - feature.coordinates[0];
        let color = feature.probability < 0.8 ? 'red' : 'green';
        console.log('res', height, width)
        createBox(x, y, width, height, color);
      })
    };
    imageObj.src = './src/assets/driver-license.jpg';
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
  flex-direction: column;
  align-items: center;
  background-color: #eef2f5;
}

.DocViewer {
  overflow: auto;
  height: max-content;
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