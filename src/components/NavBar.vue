<template>
  <nav>
    <h1><slot></slot></h1>
  </nav>
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
  font-size: 30px;
}
</style>