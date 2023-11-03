<template>
  <div class="wrapper">
    <div style="height: 60px"></div>
    <nav class="nav">
      <Header></Header>
    </nav>
    <main>
      <router-view></router-view>
      <Footer></Footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from "@/views/layout/header.vue";
import Footer from "@/views/layout/footer.vue";
</script>

<style scoped lang="scss">
.wrapper {
  // width: 100%;
  // height: 100vh;

  .nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }
}
</style>
