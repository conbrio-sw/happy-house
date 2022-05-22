<template>
  <div class="container">
    <h2 class="mb-3 mt-3">Login</h2>
    <div class="mb-3">
      <input
        type="email"
        class="form-control"
        v-model="$store.state.login.userEmail"
        placeholder="Email"
      />
    </div>
    <div class="mb-3">
      <input
        type="password"
        class="form-control"
        v-model="$store.state.login.userPassword"
        placeholder="Password"
      />
    </div>
    <div>
      <button @click="login" class="btn btn-primary">로그인</button>
      <router-link to="/register" class="btn btn-success float-end"
        >회원가입</router-link
      >
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
};
</script>
