<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
  //
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,300&display=swap');

*{
  box-sizing: border-box;
  margin: 0px;
  padding: 0px;
  font-family: "Poppins";
}


::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 10px;
	background-color: #F5F5F5;
}

::-webkit-scrollbar
{
	width: 6px;
  height: 6px;
	background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #555;
}

:root {
  --dark: #082032;
  --dorange: #CF0A0A;
  --lorange: #E94560;
  --light: #EEEEEE;
  --purple: #533483;
  --dblue: #0F3460;
  --gray: #334756;
  --gray2: #2C394B;
  --bgcolor: #F4F8FA;
  --red: #B8252B;
}

</style>