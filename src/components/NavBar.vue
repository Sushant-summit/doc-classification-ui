<template>
      <router-link to="/">

  <nav>
    <h1><slot></slot></h1>
  </nav>
  </router-link>
</template>

<style scoped>
nav{
  width: 100vw;
  padding: 10px;
  display: flex;
  justify-content: center;
  height: 70px;
}

h1{
  display: flex;
  align-items: center;
  font-size: 30px;
}
</style>