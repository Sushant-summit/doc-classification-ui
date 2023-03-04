<template>
  <div class="containerDocDetail">
    <div class="ImageBox">
      <v-img src="/src/assets/driver-license.jpg"/>
      <div class="ImgOverlay"  @click="$emit('showDetailView', this.documentId)">
        <i class="fa-solid fa-magnifying-glass-plus fa-2xl" style="color:white"></i>
      </div>
    </div>
    <div class="Details">
      <ul class="summaryItem">
        <li v-for="feature in features">
        {{ feature.name }} - {{ feature.status }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "documentId",
    "features"
  ]
}
</script>




<style scoped>

.summaryItem{
  list-style: none;
}
.summaryItem li:before {
    content: "• ";
    color: red;
}
.containerDocDetail{
  width: 100%;
  background-color: #d0dae0;
  display: grid;
  grid-template-columns: 0.8fr 1fr;
  align-content: center;
  padding: 10px;
}

 .Details{
  flex: 1;
  padding: 10px;
}

.ImageBox{
  flex: 1;
  height: max-content;
  overflow: hidden;
  border-radius: 5%;
  position: relative;
  width: 60%;
  align-self: center;
  margin: 0 20px;
}

.ImageBox:hover .ImgOverlay{
  display: flex;
}

.ImgOverlay{
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.251);
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

</style>