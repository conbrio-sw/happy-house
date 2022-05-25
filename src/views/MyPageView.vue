<template>
  <div>
    <div
      id="banner"
      class="container-fluid page-header py-6 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <div class="container text-center pt-5 pb-3">
        <h1 class="display-4 text-white animated slideInDown mb-3">My Page</h1>
        <nav aria-label="breadcrumb animated slideInDown"></nav>
      </div>
    </div>
    <!-- About Start -->
    <div class="container-xxl py-6">
      <div class="container">
        <div class="row g-5">
          <div class="col-lg-4 wow fadeInUp pt-5" data-wow-delay="0.5s">
            <div class="h-100">
              <p class="text-primary text-uppercase mb-2">
                관심지역을 설정하시면 관심지역의 추천 매물을 우측에서 확인하실
                수 있습니다.
              </p>
              <br />
              <div class="row g-2 mb-4">
                <div class="col-sm-12">
                  <i class="fa fa-check text-primary me-2"></i
                  ><label for="userName" class="fs-4 fw-bold">User Name </label
                  >&nbsp;&nbsp;&nbsp;
                  <span class="fs-5">{{ $store.state.myPage.userName }}</span>
                </div>
                <div class="col-sm-12">
                  <i class="fa fa-check text-primary me-2"></i
                  ><label for="userName" class="fs-4 fw-bold">Email </label
                  >&nbsp;&nbsp;&nbsp;
                  <span class="fs-5">{{ $store.state.myPage.userEmail }}</span>
                </div>
                <div class="col-sm-12">
                  <i class="fa fa-check text-primary me-2"></i
                  ><label for="userName" class="fs-4 fw-bold">Grade </label
                  >&nbsp;&nbsp;&nbsp;
                  <span class="fs-5">{{ $store.state.myPage.isAdmin }}</span>
                </div>
                <div class="col-sm-12">
                  <i class="fa fa-check text-primary me-2"></i
                  ><label for="userName" class="fs-4 fw-bold">Like Area </label
                  >&nbsp;&nbsp;&nbsp;
                  <span
                    class="fs-5"
                    v-if="
                      $store.state.myPage.interestArea !=
                      'undefined undefined undefined'
                    "
                    >{{ $store.state.myPage.interestArea }}</span
                  ><span class="fs-5" v-else>관심지역을 등록해주세요</span>
                </div>
              </div>
              <router-link
                to="/userUpdate"
                class="btn btn-primary rounded-pill py-3 px-5"
                href=""
                >수정하기</router-link
              >
              &nbsp;
              <button
                class="btn btn-secondary rounded-pill py-3 px-5"
                @click="deleteUser"
                type="button"
              >
                탈퇴하기
              </button>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <div
              class="product-item d-flex flex-column bg-white rounded overflow-hidden h-100"
              style="border: 1px solid orange"
            >
              <div class="text-center p-4">
                <div
                  class="d-inline-block border border-primary rounded-pill px-3 mb-3"
                >
                  ₩{{ this.aptRandom1.recentPrice }}
                </div>
                <h3 class="mb-3">{{ this.aptRandom1.aptName }}</h3>
                <div>면적 : {{ this.aptRandom1.area }}</div>
                <div>건축연도 : {{ this.aptRandom1.buildYear }}</div>
                <div>층수 : {{ this.aptRandom1.floor }}</div>
              </div>
              <div class="position-relative mt-auto">
                <img
                  src="img/aptimg.png"
                  alt=""
                  width="389.98"
                  height="292.48px"
                />
                <div class="product-overlay">
                  <a
                    class="btn btn-lg-square btn-outline-light rounded-circle"
                    href="/house"
                    ><i class="fa fa-eye text-primary"></i
                  ></a>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <div
              class="product-item d-flex flex-column bg-white rounded overflow-hidden h-100"
              style="border: 1px solid orange"
            >
              <div class="text-center p-4">
                <div
                  class="d-inline-block border border-primary rounded-pill px-3 mb-3"
                >
                  ₩{{ this.aptRandom2.recentPrice }}
                </div>
                <h3 class="mb-3">{{ this.aptRandom2.aptName }}</h3>
                <div>면적 : {{ this.aptRandom2.area }}</div>
                <div>건축연도 : {{ this.aptRandom2.buildYear }}</div>
                <div>층수 : {{ this.aptRandom2.floor }}</div>
              </div>
              <div class="position-relative mt-auto">
                <img
                  class="img-fluid"
                  src="img/aptimg2.jpg"
                  alt=""
                  height="50px"
                />
                <div class="product-overlay">
                  <a
                    class="btn btn-lg-square btn-outline-light rounded-circle"
                    href="/house"
                    ><i class="fa fa-eye text-primary"></i
                  ></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- About End -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      aptRandom1: "",
      aptRandom2: "",
    };
  },
  created() {
    this.$store.dispatch("myData");
    this.randomApt();
    this.$store.commit("SET_NOW_MYPAGE");
  },
  methods: {
    deleteUser() {
      console.log("delete");
      this.$store.dispatch("deleteUser");
      this.$router.push("/");
    },
    async randomApt() {
      let dongCode =
        this.$store.state.myPage.dongCode == null
          ? "1153010200"
          : this.$store.state.myPage.dongCode; // 가장 매물많은 서울 구로구 구로동을 default
      console.log("randomApt() dongCode : " + dongCode);
      let params = {
        dong: dongCode,
        key: "aptName",
        word: "",
      };
      await this.$store.dispatch("getHouseList", params);
      if (this.$store.state.houses.length >= 2) {
        let num1 = Math.floor(Math.random() * this.$store.state.houses.length);
        let num2 = Math.floor(Math.random() * this.$store.state.houses.length);
        console.log("randomnum : num1 " + num1 + " num2 " + num2);
        this.aptRandom1 = this.$store.state.houses[num1];
        this.aptRandom2 = this.$store.state.houses[num2];
      } else {
        let params = {
          dong: "1153010200",
          key: "aptName",
          word: "",
        };
        await this.$store.dispatch("getHouseList", params);
        let num1 = Math.floor(Math.random() * this.$store.state.houses.length);
        let num2 = Math.floor(Math.random() * this.$store.state.houses.length);
        console.log("randomnum : num1 " + num1 + " num2 " + num2);
        this.aptRandom1 = this.$store.state.houses[num1];
        this.aptRandom2 = this.$store.state.houses[num2];
      }
    },
  },
};
</script>

<style scoped>
.page-header {
  margin-bottom: 0rem;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(/public/img/house-1.jpeg) center center no-repeat;
  background-size: cover;
}
</style>
