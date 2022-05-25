<template>
  <div>
    NEWS
    <hr />
    <hr />
    <hr />
    <hr />
    <hr />
    <hr />
    <div v-html="news.title"></div>
    내용 : {{ news.description }}
  </div>
</template>

<script>
import http from "@/api/http.js";
export default {
  data() {
    return {
      news: {},
    };
  },
  async created() {
    console.log("news 가져오기");
    try {
      let data = await http.get("/api/server/news");
      var item = data.data.data; //JSON.parse(data.data.data); //JSON.stringify(data.data.items[0]);
      var items = JSON.parse(item);
      console.log(items.items);
      this.news = items.items[0];
      //   console.log(this.news.title);
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style></style>
