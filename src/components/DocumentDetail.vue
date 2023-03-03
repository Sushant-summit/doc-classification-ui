<template>
  <div class="containerDocDetail">
    <div class="ImageBox">
      <v-img src="/src/assets/driver-license.jpg"/>
      <div class="ImgOverlay"  @click="$emit('showDetailView', this.documentId)">
        <i class="fa-solid fa-magnifying-glass-plus fa-2xl" style="color:white"></i>
      </div>
    </div>
    <div class="Details">
      <h2>Some Flags are visible here.</h2>
    </div>
  </div>
</template>

<script>
export default {
  props:["documentId"]
}
</script>




<style scoped>
.containerDocDetail{
  width: 100%;
  background-color: #d0dae0;
  display: flex;
  flex-direction: row;
  padding: 10px;
  min-height: 500px;
}

 .Details{
  flex: 1;
  padding: 10px;
}

.ImageBox{
  flex: 1;
  position: relative;
}

.ImgOverlay{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.251);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

</style>