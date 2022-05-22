<template>
  <b-row class="mt-2 mb-2">
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
      <div
        class="product-item d-flex flex-column bg-white rounded h-100"
        :class="{ add: isColor }"
        @click="colorClickChange()"
        :data-param="index"
      >
        <div class="p-2">
          <div class="text-center">
            <div
              class="d-inline-block border border-primary rounded-pill px-2 mb-2"
            >
              {{ shop.shopKind }}
            </div>
            <h3 class="mb-3">{{ shop.shopName }}</h3>
          </div>
          <div class="text-left">
            <span>{{ shop.roadAddress }}</span>
          </div>
        </div>
      </div>
    </div>
    <hr />
  </b-row>
</template>

<script>
export default {
  name: "ShopListItem",
  data() {
    return {
      isColor: false,
    };
  },
  props: {
    shop: Object,
    index: Number,
  },
  methods: {
    colorChange(flag) {
      this.isColor = flag;
    },
    colorClickChange() {
      console.log("샵리스트", this.index);
      this.isColor = !this.isColor;
    },
  },
};
</script>

<style scoped>
.apt {
  width: 50px;
}
/*** Product ***/

.product-item.add {
  background: var(--primary) !important;
}

.product-item.add * {
  color: var(--light);
}

.product-item.add .border-primary {
  border-color: var(--light) !important;
}

.product-item.add .product-overlay {
  height: 100%;
  opacity: 1;
}
</style>
