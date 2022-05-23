<template>
  <b-row
    class="mt-2 mb-2"
    @click="selectHouse"
    @mouseover="colorChange(true)"
    @mouseout="colorChange(false)"
    :class="{ 'mouse-over-bgcolor': isColor }"
  >
    <!-- <b-col cols="2" class="text-center align-self-center">
      <b-img
        thumbnail
        src="https://picsum.photos/250/250/?image=58"
        alt="Image 1"
      ></b-img>
    </b-col>
    <b-col cols="10" class="align-self-center">
      [{{ house.aptCode }}] {{ house.aptName }}
      {{ house.floor }}
    </b-col> -->

    <div>
      <div class="product-item d-flex flex-column bg-white rounded h-100">
        <div class="p-2">
          <div class="text-center">
            <div
              class="d-inline-block border border-primary rounded-pill px-2 mb-2"
            >
              {{ house.aptName }}
            </div>
            <h3 class="mb-3">{{ house.recentPrice }} 만원</h3>
          </div>
          <div class="text-left">
            <span
              >{{ house.area }}m<sup>2</sup>, {{ house.floor }}층, <br />{{
                house.buildYear
              }}년 건축</span
            >
          </div>
        </div>
        <div class="position-relative mt-auto">
          <img class="img-fluid" src="img/product-1.jpg" alt="" />
          <div class="product-overlay">
            <a
              class="btn btn-lg-square btn-outline-light rounded-circle"
              href=""
              ><i class="fa fa-eye text-primary"></i
            ></a>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-2"></div>
    <hr />
  </b-row>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "HouseListItem",
  data() {
    return {
      isColor: false,
    };
  },
  props: {
    house: Object,
  },
  methods: {
    ...mapActions(["detailHouse"]),
    selectHouse() {
      console.log("listRow : ", this.house);
      // this.$store.dispatch("getHouse", this.house);
      this.detailHouse(this.house);
    },
    colorChange(flag) {
      this.isColor = flag;
    },
  },
};
</script>

<style scoped>
.apt {
  width: 50px;
}
</style>
