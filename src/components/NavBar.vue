<template>
  <router-link to="/">
    <nav class="shadow">
      <img src="/src/assets/logo.svg" />
    </nav>
  </router-link>
</template>

<style scoped>
nav {
  width: 100vw;
  padding: 10px;
  display: flex;
  /* justify-content: center; */
  height: 70px;
  background-color: #E1E9EE;
  color: white;
  /* border-bottom: 1px solid grey; */
}

.shodow{
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}

h1 {
  display: flex;
  align-items: center;
  font-size: 30px;
}
</style>