<template>
  <div>
    <div
      id="banner"
      class="container-fluid page-header py-6 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <div class="container text-center pt-5 pb-3">
        <h1 class="display-4 text-white animated slideInDown mb-3">Login</h1>
        <nav aria-label="breadcrumb animated slideInDown"></nav>
      </div>
    </div>
    <div class="container-xxl py-6">
      <div class="container">
        <div
          class="text-center mx-auto mb-5 wow fadeInUp"
          data-wow-delay="0.1s"
          style="max-width: 500px"
        >
          <!-- <h1 class="display-6 mb-4">LOGIN</h1> -->
        </div>
        <div class="row g-0 justify-content-center">
          <div class="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
            <form>
              <div class="row g-3">
                <div class="col-12">
                  <div class="form-floating">
                    <input
                      type="email"
                      class="form-control"
                      v-model="$store.state.login.userEmail"
                      placeholder="Email"
                    />
                    <label>Email</label>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating">
                    <input
                      type="password"
                      class="form-control"
                      v-model="$store.state.login.userPassword"
                      placeholder="Password"
                    />
                    <label>Password</label>
                  </div>
                </div>
                <div class="col-12 text-center">
                  <button
                    class="btn btn-primary rounded-pill py-3 px-5"
                    type="button"
                    @click="login"
                  >
                    Login
                  </button>
                  &nbsp;&nbsp;&nbsp;
                  <router-link
                    to="/register"
                    class="btn btn-secondary rounded-pill py-3 px-5"
                    >Sing Up</router-link
                  >
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueAlertify from "vue-alertify";
Vue.use(VueAlertify);

import http from "@/api/http.js";

export default {
  name: "Login",
  methods: {
    async login() {
      let loginObj = {
        userEmail: this.$store.state.login.userEmail,
        userPassword: this.$store.state.login.userPassword,
      };

      try {
        let { data } = await http.post("/login", loginObj);

        console.log("LoginVue: data : ");
        console.log(data);

        // isLogin 포함 mutator 호출
        this.$store.commit("SET_LOGIN", {
          isLogin: true,
          userName: data.userName,
          userProfileImageUrl: data.userProfileImageUrl,
        });
        this.$store.dispatch("myData");
        // board 로 이동
        this.$router.push("/");
      } catch (error) {
        console.log("LoginVue: error : ");
        console.log(error);
        if (error.response.status == "404") {
          this.$alertify.error("이메일 또는 비밀번호를 확인하세요.");
        } else {
          this.$alertify.error("Opps!! 서버에 문제가 발생했습니다.");
        }
      }
    },
  },
  created() {
    this.$store.commit("SET_NOW_LOGIN");
  },
};
</script>
<style scoped>
.page-header {
  margin-bottom: 6rem;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(/public/img/house-1.jpeg) center center no-repeat;
  background-size: cover;
}
#banner {
  margin-bottom: 0;
}
</style>
