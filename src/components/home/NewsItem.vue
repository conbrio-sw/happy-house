<template>
  <div>
    <div
      class="d-flex align-items-center mb-4"
      @click="openLink(item.originallink)"
    >
      <!-- <img
                class="flex-shrink-0 rounded-circle border p-1"
                src="img/testimonial-1.jpg"
                alt=""
              /> -->
      <div class="ms-0">
        <h5 class="mb-0" v-html="item.title"></h5>
      </div>
    </div>
    <p class="mb-0" v-html="item.description" style="font-size: 15px">
      더보기...
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    item: Object,
    index: Number,
  },
  methods: {},
};
</script>

<style></style>
