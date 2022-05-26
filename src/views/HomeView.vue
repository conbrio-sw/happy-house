<template>
  <div>
    <div
      id="banner"
      class="container-fluid page-header py-6 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <div class="container text-center pt-5 pb-3">
        <h1 class="display-4 text-white animated slideInDown mb-3">
          HAPPY HOUSE
        </h1>
        <nav aria-label="breadcrumb animated slideInDown"></nav>
      </div>
    </div>
    <div class="row container-fluid pb-5">
      <!-- 뉴스 부분  -->
      <div class="container-xxl py-6 pb-0 col-6 mt-0">
        <div class="container" style="width: 50%">
          <div
            class="text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style="max-width: 600px"
          >
            <!-- <p class="text-primary text-uppercase mb-2">오늘의 뉴스를 확인해보세요.</p> -->
            <h1 class="display-6 mb-4">Today's News</h1>
          </div>
          <!-- 뉴스 -->
          <div
            id="carouselExampleDark"
            class="carousel carousel-dark slide"
            data-bs-ride="carousel"
          >
            <div class="carousel-inner">
              <div
                v-for="(item, index) in listGetters"
                :key="index"
                class="carousel-item"
                data-bs-interval="10000"
                :class="{ active: index == 0 }"
              >
                <img
                  src="img/home/bg-test01.png"
                  width="30%"
                  height="450px"
                  class="d-block w-100"
                  alt="..."
                />
                <div
                  class="d-none d-md-block carousel-caption"
                  @click="openLink(item.originallink)"
                >
                  <h2
                    class="mb-5"
                    style="
                      font-family: 맑은 고딕;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      width: 100%;
                      color: #eaa636;
                    "
                    v-html="item.title"
                  ></h2>
                  <h4
                    class="mb-0"
                    v-html="item.description"
                    style="
                      font-size: 20px;
                      font-family: 맑은 고딕;
                      line-height: 1.88;
                    "
                  ></h4>
                </div>
              </div>
            </div>

            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleDark"
              data-bs-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleDark"
              data-bs-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
          <!-- <div
            class="owl-carousel testimonial-carousel wow fadeInUp"
            data-wow-delay="0.1s"
          >
            <div
              v-for="(item, index) in listGetters"
              :key="index"
              class="testimonial-item bg-white rounded p-4"
              style="border: 1px solid orange; height: 300px; width: 200px"
            >
              <div
                class="d-flex align-items-center mb-4"
                @click="openLink(item.originallink)"
              >

                <div class="ms-0">
                  <h5 class="mb-0" v-html="item.title"></h5>
                </div>
              </div>
              <p class="mb-0" v-html="item.description" style="font-size: 15px">
                더보기...
              </p>
            </div>
          </div> -->
        </div>
      </div>
      <!-- Testimonial End -->
      <!-- Facts Start -->
      <div class="container-xxl py-6 pb-0 col-6">
        <div class="container">
          <div
            class="text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style="max-width: 500px"
          >
            <h1 class="display-6 mb-4">Today's Weather</h1>
            <div class="row g-4 py-6">
              <div class="col-lg-6 col-md-6 wow fadeIn" data-wow-delay="0.1s">
                <div class="fact-item bg-light rounded text-center h-100 p-5">
                  <!-- <img :src="`${weatherIcon}`" class="f mb-4" width="30%" /> -->
                  <div v-if="this.$store.state.main.weatherIcon != ''">
                    <p>현재 위치</p>
                    <i
                      :class="this.$store.state.main.weatherIcon"
                      class="fa-4x mb-4"
                      style="color: orange"
                    />
                    <p class="mb-2">
                      {{ this.$store.state.main.weather.name }}
                    </p>
                    <h1 class="display-5 mb-0">
                      {{
                        Math.round(this.$store.state.main.weather.main.temp)
                      }}°C
                    </h1>
                    <p class="mb-2 fw-bold">
                      {{
                        Math.round(this.$store.state.main.weather.main.temp_min)
                      }}
                      /
                      {{
                        Math.round(this.$store.state.main.weather.main.temp_max)
                      }}
                    </p>
                  </div>
                  <div v-else>
                    <p>현재 위치</p>
                    <img src="img/question.png" class="mb-4" />
                    <p>위치를 허용하고 날씨를 확인해보새요!</p>
                    <a href="/" class="display-6 mb-0">REFRESH</a>
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6 wow fadeIn" data-wow-delay="0.1s">
                <div class="fact-item bg-light rounded text-center h-100 p-5">
                  <div
                    v-if="
                      this.$store.state.login.isLogin &&
                      this.$store.state.myPage.dongCode != null
                    "
                  >
                    <!-- <img :src="`${weatherIcon}`" class="f mb-4" width="30%" /> -->
                    <p>관심 지역</p>
                    <i
                      :class="this.$store.state.main.likeWeatherIcon"
                      class="fa-4x mb-4"
                      style="color: orange"
                    />
                    <p class="mb-2">
                      {{ this.$store.state.main.likeWeather.name }}
                    </p>
                    <h1 class="display-5 mb-0">
                      {{
                        Math.round(
                          this.$store.state.main.likeWeather.main.temp
                        )
                      }}°C
                    </h1>
                    <p class="mb-2 fw-bold">
                      {{
                        Math.round(
                          this.$store.state.main.likeWeather.main.temp_min
                        )
                      }}
                      /
                      {{
                        Math.round(
                          this.$store.state.main.likeWeather.main.temp_max
                        )
                      }}
                    </p>
                  </div>
                  <div v-else-if="this.$store.state.login.isLogin">
                    <p>관심 지역</p>
                    <img src="img/question.png" class="mb-4" />
                    <p>관심지역을 설정하고 날씨를 확인해보새요!</p>
                    <a href="/myPage" class="display-5 mb-0">CLICK</a>
                  </div>
                  <div v-else href="/login">
                    <p>관심 지역</p>
                    <img src="img/question.png" class="mb-4" />
                    <p>로그인하고 날씨를 확인해보새요!</p>
                    <a href="/login" class="display-5 mb-0">LOGIN</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Facts End -->
    </div>

    <footer id="footer" class="pt-5">
      <hr />
      <div class="container">
        <div class="row">
          <div class="footer">
            <ul>
              <li><a href="#">사이트 도움말</a></li>
              <li><a href="#">사이트 이용약관</a></li>
              <li><a href="#">사이트 운영원칙</a></li>
              <li>
                <a href="#"><strong>개인정보취급방침</strong></a>
              </li>
              <li><a href="#">책임의 한계와 법적고지</a></li>
              <li><a href="#">게시중단요청서비스</a></li>
              <li><a href="#">고객센터</a></li>
            </ul>
            <address>
              Copyright ©
              <a href="#"><strong>happyhouse</strong></a>
              All Rights Reserved.
            </address>
          </div>
        </div>
      </div>
    </footer>
    <!-- <div
      id="footer"
      style="
        position: absolute;
        bottom: 0;

        height: 100px;
      "
    >
      <div class="row" style="overflow: hidden">
        <div class="col-sm-2 text-center">
          <img
            src="img/logo/footer.png"
            class="img-fluid"
            height="100px"
            alt=""
          />
        </div>
        <div
          class="col-sm-8 row"
          style="
            line-height: 36px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            min-width: 680px;
          "
        >
          <div class="col-sm-6 text-start" style="min-width: 310px">
            Copyright © www.happyhouse.com All rights reserved.
          </div>
          <div class="col-sm-6 text-end" style="min-width: 310px">
            오늘 방문자 수 : 1,557명
          </div>
          <hr class="p-0 m-0" />
          <div class="col-sm-6 text-start" style="min-width: 310px">
            해피하우스 운영팀: help@happyhouse.com
          </div>
          <div
            class="col-sm-6 text-end"
            style="overflow: hidden; min-width: 310px"
          >
            이용약관 | 문의/신고 | 개인정보처리방침
          </div>
        </div>
        <div class="col-sm-2 text-center">
          <img
            src="img/logo/footer.png"
            class="img-fluid"
            height="100px"
            alt=""
          />
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "HomeView",
  props: {
    msg: String,
  },
  data() {
    return {
      weather: "",
      weatherIcon: "",
    };
  },
  created() {
    this.$store.commit("SET_NOW_HOME");
    console.log(this.$store.state.main.news);
    console.log("geolocation" in navigator);
    navigator.geolocation.getCurrentPosition((position) => {
      this.$store.dispatch("getWeather", {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        weatherState: "basic",
      });
      this.$store.dispatch("getLocation");

      //console.log(position.coords.latitude);
      //this.myArea = { lat: position.coords.latitude, lon: position.coords.longitude };
    });
  },
  async mounted() {
    this.$store.commit("SET_NOW_HOME");
    await this.$store.dispatch("getNews");
    console.log(this.$store.state.main.news);

    console.log("mounted : " + process.env.VUE_APP_OPENWEATHER_API_KEY);
    console.log("mounted env: ", process.env);
  },
  computed: {
    listGetters() {
      return this.$store.state.main.news; // no getBoardList()
    },
  },
  methods: {
    openLink(link) {
      console.log(link);
      window.open(link, "_blank");
    },
  },
};
</script>

<style scoped>
.page-header {
  margin-bottom: 2rem;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(/public/img/house-1.jpeg) center center no-repeat;
  background-size: cover;
}
.carousel-caption {
  top: 1.25rem;
}
.footer {
  text-align: center;
  padding: 30px 50px;
}
.footer li {
  position: relative;
  display: inline;
  padding: 0 7px 0 10px;
  white-space: nowrap;
}
.footer li:before {
  content: "";
  width: 1px;
  height: 12px;
  background-color: #dbdbdb;
  position: absolute;
  left: 0;
  top: 2px;
}
.footer li:first-child:before {
  width: 0;
}
.footer address {
  padding-top: 15px;
}
/* #footer {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url("../../public/img/logo/footer.png");

  background-size: contain;
} */
</style>
