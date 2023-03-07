<template>
  <div class="bggray px-4 py-4">
    <div class="containerDocDetail">
      <div class="Details">
        <p style="font-size:smaller" class="pb-5">Summary for the document uploaded:</p>
        <v-table style="font-size:smaller">
          <tbody>
            <tr v-for="(feature, ind) in features" :key="ind">
              <td>{{ feature.name }} </td>
              <td style="color: black; font-weight: bold;">{{ feature.status }} <span v-if="feature.name=='Label Check'"> - {{ feature.predictedValue }}</span></td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <div class="ImageBox">
        <p style="font-size:smaller" class="pb-5">Click on image to view detailed summary:</p>
        <v-img :src="this.image" />
        <div class="ImgOverlay" @click="$emit('showDetailView', this.documentId)">
          <i class="fa-solid fa-magnifying-glass-plus fa-2xl" style="color:rgba(0, 0, 0, 0.8);"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "documentId",
    "features",
    "image"
  ],
  mounted() {
    console.log(this.image);
  }
}
</script>




<style scoped>
.summaryItem {
  list-style: none;
}
.summaryItem li:before {
  content: "• ";
  color: red;
}

.bggray{
  background-color: #d0dae0;
}
.containerDocDetail {
  width: 100%;
  display: grid;
  grid-template-columns: 0.8fr 1fr;
  align-content: center;
  padding: 10px;
}

.Details {
  flex: 1;
  padding: 10px;
}

.ImageBox {
  flex: 1;
  height: max-content;
  overflow: hidden;
  justify-self: end;
  border-radius: 5%;
  position: relative;
  width: 60%;
  align-self: center;
  margin: 0 20px;
}

.ImageBox:hover .ImgOverlay {
  display: flex;
}

.ImgOverlay {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  color:rgba(0, 0, 0, 0.251);
  /* background-color: rgba(0, 0, 0, 0.251);   */
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>