<template>
  <div>
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
        <div class="position-relative mt-auto">
          <!-- class="img-fluid" -->
          <img :src="getCategory" alt="" height="190px" width="365px" />
          <div class="product-overlay">
            <a
              class="btn btn-lg-square btn-outline-light rounded-circle"
              href=""
              ><i class="fa fa-eye text-primary"></i
            ></a>
          </div>
        </div>
      </div>
    </b-row>
    <hr />
  </div>
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
    currCategory: String,
  },
  computed: {
    getCategory() {
      if (this.currCategory == "" || this.currCategory == null) {
        return "img/shop/list.jpg";
      } else if (this.currCategory == "BK9") {
        return "img/shop/list-bk.jpg";
      } else if (this.currCategory == "MT1") {
        return "img/shop/list-mt.jpg";
      } else if (this.currCategory == "PM9") {
        return "img/shop/list-pm.jpg";
      } else if (this.currCategory == "OL7") {
        return "img/shop/list-ol.jpg";
      } else if (this.currCategory == "CE7") {
        return "img/shop/list-ce.jpg";
      } else if (this.currCategory == "CS2") {
        return "img/shop/list-cs.jpg";
      } else {
        return "img/shop/list.jpg";
      }
    },
  },
  methods: {
    colorChange(flag) {
      this.isColor = flag;
    },
    colorClickChange() {
      console.log("샵리스트", this.index);
      console.log(this.currCategory);
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
