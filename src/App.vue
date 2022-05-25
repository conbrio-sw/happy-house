<template>
  <div id="app" class="content-box">
    <navi-bar />
    <router-view />
  </div>
</template>

<script>
import NaviBar from "@/components/layout/HeaderNaviBar.vue";

export default {
  name: "App",
  components: {
    NaviBar,
  },
};
</script>

<style>
/* a {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
  font-weight: bold;
  color: chartreuse;
}

a.router-link-exact-active {
  color: #3aa4ca;
} */
.content-all h3 {
  font-family: 맑은 고딕;
  color: #eaa636;
  font-weight: 600;
}
.content-right h3 {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
