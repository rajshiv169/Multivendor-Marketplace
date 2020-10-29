<template>
  <div id="app">
    <Navbar />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
export default {
  components : {
    Navbar,
    Footer
  }
}
</script>

<style>

html, body {
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

</style>
