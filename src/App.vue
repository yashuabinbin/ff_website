<template>
  <div id="app" style="height: 100%">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin: 0px;
    padding: 0px;
  }

  html, body {
    margin: 0px;
    padding: 0px;
    height: 100%;
  }
</style>
