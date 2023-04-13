<template>
  <router-link to="/">
    <nav class="shadow" style="display: flex; justify-content:space-between">
      <img src="/src/assets/logo2.svg"  style="padding: 4px;"/>
      <router-link to="/zip">
        <v-btn style="background-color:#B8252B; color:white;" class="mr-4">
          Zip Mode
        </v-btn>
      </router-link>
    </nav>
  </router-link>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
    }
  },
  methods: {
    // changeUrl() {
    //   console.log('I ran')
    //   this.$router.push(
    //     {
    //       name: "ZIP_MODE",
    //     }
    //   );
    // }
  }
}
</script>

<style scoped>
nav {
  width: 100vw;
  padding: 10px;
  display: flex;
  /* justify-content: center; */
  height: 70px;
  color: white;
  background-color: white;
  border-bottom: 2px solid #E1E9EE;
  /* border-bottom: 1px solid grey; */
}

.shodow {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}

h1 {
  display: flex;
  align-items: center;
  font-size: 30px;
}
</style>