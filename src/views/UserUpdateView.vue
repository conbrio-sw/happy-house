<template>
  <div>
    <div id="banner" class="container-fluid page-header py-6 wow fadeIn" data-wow-delay="0.1s">
      <div class="container text-center pt-5 pb-3">
        <h1 class="display-4 text-white animated slideInDown mb-3">User Update</h1>
        <nav aria-label="breadcrumb animated slideInDown"></nav>
      </div>
    </div>
    <div class="container-xxl py-5">
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
                      type="name"
                      class="form-control"
                      placeholder="Enter User Name"
                      :class="{
                        'is-valid': isUserNameFocusAndValid,
                        'is-invalid': isUserNameFocusAndInvalid,
                      }"
                      v-model="userName"
                      @input="validateUserName"
                      @focus="isUserNameFocus = true"
                      @click="validateUserName"
                    />
                    <label>User Name</label>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">올바른 이름을 입력해 주세요.</div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating">
                    <input
                      type="email"
                      class="form-control"
                      placeholder="Enter Email"
                      :class="{
                        'is-valid': isUserEmailFocusAndValid,
                        'is-invalid': isUserEmailFocusAndInValid,
                      }"
                      v-model="userEmail"
                      @input="validateEmail"
                      @focus="isUserEmailFocus = true"
                      @click="validateEmail"
                    />
                    <label>Email</label>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">올바른 Email 을 입력해 주세요.</div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating">
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Enter Password"
                      :class="{
                        'is-valid': isUserPasswordFocusAndValid,
                        'is-invalid': isUserPasswordFocusAndInvalid,
                      }"
                      v-model="userPassword"
                      @input="validatePassword"
                      @focus="isUserPasswordFocus = true"
                      @click="validatePassword"
                    />
                    <div class="form-check" style="margin-left: auto">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="checked"
                        @click="onClickCheckboxHandler()"
                        id="useRecommendPassword"
                      />
                      <label class="form-check-label" for="flexCheckDefault">
                        Recommend Password
                      </label>
                    </div>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">현재 비밀번호를 입력해주세요.</div>
                    <label>Password</label>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating">
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Conform Password"
                      :class="{
                        'is-valid': isUserPassword2FocusAndValid,
                        'is-invalid': isUserPassword2FocusAndInvalid,
                      }"
                      v-model="userPassword2"
                      @input="validatePassword2"
                      @focus="isUserPassword2Focus = true"
                      @click="validatePassword2"
                    />
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">비밀번호가 일치하지 않습니다.</div>
                    <label>Password Confirm</label>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating">
                    <div class="form-group form-inline justify-content-center">
                      <b-row class="mt-4 mb-4 text-center">
                        <b-col class="sm-3">
                          <b-form-select
                            class="form-control"
                            v-model="sidoCode"
                            :options="sidos"
                            @change="gugunList"
                          ></b-form-select>
                        </b-col>
                        <b-col class="sm-3">
                          <b-form-select
                            class="form-control"
                            v-model="gugunCode"
                            :options="guguns"
                            @change="dongList"
                          ></b-form-select>
                        </b-col>
                        <b-col class="sm-3">
                          <b-form-select
                            class="form-control"
                            v-model="dongCode"
                            :options="dongs"
                          ></b-form-select>
                        </b-col>
                      </b-row>
                    </div>
                  </div>
                </div>
                <div class="col-12 text-center">
                  <button
                    class="btn btn-primary rounded-pill py-3 px-5"
                    type="button"
                    @click="userUpdate"
                  >
                    수정</button
                  >&nbsp;
                  <router-link
                    class="btn btn-secondary rounded-pill py-3 px-5"
                    type="button"
                    to="/myPage"
                  >
                    취소
                  </router-link>
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
import { mapState, mapActions, mapMutations } from "vuex";
Vue.use(VueAlertify);

import http from "@/api/http.js";

export default {
  // data 사용 X
  data() {
    return {
      userName: this.$store.state.myPage.userName,
      userEmail: this.$store.state.myPage.userEmail,
      userPassword: this.$store.state.myPage.userPassword,
      userPassword2: this.$store.state.myPage.userPassword,
      // focus
      isUserNameFocus: false,
      isUserEmailFocus: false,
      isUserPasswordFocus: false,
      isUserPassword2Focus: false,

      // validation
      isUserNameValid: false,
      isUserEmailValid: false,
      isUserPasswordValid: false,
      isUserPassword2Valid: false,

      // 회원 구분
      groupCode: "001",
      codeList: [],
      userClsf: "001", // 일반회원 default

      checked: false,

      // 관심지역
      sidoCode: this.$store.state.myPage.sidoCode,
      gugunCode: this.$store.state.myPage.gugunCode,
      dongCode: this.$store.state.myPage.dongCode,
    };
  },
  computed: {
    isUserNameFocusAndValid() {
      return this.isUserNameFocus && this.isUserNameValid;
    },
    isUserNameFocusAndInvalid() {
      return this.isUserNameFocus && !this.isUserNameValid;
    },
    isUserEmailFocusAndValid() {
      return this.isUserEmailFocus && this.isUserEmailValid;
    },
    isUserEmailFocusAndInValid() {
      return this.isUserEmailFocus && !this.isUserEmailValid;
    },
    isUserPasswordFocusAndValid() {
      return this.isUserPasswordFocus && this.isUserPasswordValid;
    },
    isUserPasswordFocusAndInvalid() {
      return this.isUserPasswordFocus && !this.isUserPasswordValid;
    },
    isUserPassword2FocusAndValid() {
      return this.isUserPassword2Focus && this.isUserPassword2Valid;
    },
    isUserPassword2FocusAndInvalid() {
      return this.isUserPassword2Focus && !this.isUserPassword2Valid;
    },
    ...mapState(["sidos", "guguns", "dongs"]),
  },
  created() {
    this.CLEAR_SIDO_LIST();
    this.CLEAR_GUGUN_LIST();
    this.CLEAR_DONG_LIST();
    this.getSido();
    if (this.sidoCode != null) {
      this.gugunList();
      this.dongList();
    }
  },
  methods: {
    validateUserName() {
      this.isUserNameValid = this.userName.length > 0 ? true : false;
      console.log(this.isUserNameValid);
    },
    validateEmail() {
      // ^ 시작일치, $ 끝 일치
      // {2, 3} 2개 ~ 3개
      // * 0회 이상, + 1회 이상
      // [-_.] - 또는 _ 또는 .
      // ? 없거나 1회
      let regexp =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      this.isUserEmailValid = regexp.test(this.userEmail) ? true : false;
      console.log(this.isUserEmailValid);
    },
    validatePassword() {
      console.log("vailidatePassword");
      let patternEngAtListOne = new RegExp(/[a-zA-Z]+/); // + for at least one
      let patternSpeAtListOne = new RegExp(/[~!@#$%^&*()_+|<>?:{}]+/); // + for at least one
      let patternNumAtListOne = new RegExp(/[0-9]+/); // + for at least one

      this.isUserPasswordValid =
        patternEngAtListOne.test(this.userPassword) &&
        patternSpeAtListOne.test(this.userPassword) &&
        patternNumAtListOne.test(this.userPassword) &&
        this.userPassword.length >= 8
          ? true
          : false;
    },
    validatePassword2() {
      this.isUserPassword2Valid = this.userPassword == this.userPassword2 ? true : false;
    },
    async userUpdate() {
      // 회원 정보 수정하기
      if (!this.isUserEmailValid || !this.isUserPasswordValid || !this.isUserPassword2Valid) {
        this.$alertify.error("유효성 검사를 해주세요");
        return;
      }

      let params = {
        userName: this.userName,
        userEmail: this.userEmail,
        userPassword: this.userPassword,
        dongCode: this.dongCode,
      };
      console.log(params);
      try {
        let { data } = await http.put("/user", params);
        console.log(data);

        if (data.result == "success") {
          // sessionStorage.setItem("userName", data.userName);
          // sessionStorage.setItem("userEmail", data.userEmail);
          let $this = this;
          this.$alertify.alertWithTitle("수정 완료", "회원 정보가 수정되었습니다.", function () {
            $this.$router.push("/myPage");
          });
        } else {
          console.log("RegisterVue: error : ");
          this.$alertify.error("서버에 문제가 발생했습니다.");
        }
      } catch (error) {
        console.log("RegisterVue: error : ");
        console.log(error);
        this.$alertify.error("서버에 문제가 발생했습니다.");
      }
    },
    onClickCheckboxHandler() {
      if (!this.checked) {
        //alert("체크됨");
        let recPwd = this.recPwdMake();
        // alert("추천 비밀번호: " + recPwd);
        var $this = this;
        this.$alertify.confirmWithTitle(
          "추천 비밀번호",
          recPwd + " 을 사용하시겠습니까?",
          function () {
            $this.userPassword = recPwd;
            $this.userPassword2 = recPwd;
            $this.validatePassword();
            $this.isUserPasswordFocus = true;
            $this.validatePassword2();
            $this.isUserPassword2Focus = true;
          },
          function () {
            $this.checked = false;
          }
        );
      } else {
        //alert("체크 해제됨");
        this.userPassword = "";
        this.userPassword2 = "";
      }
    },

    //추천 암호 만들기
    recPwdMake() {
      //특문 몇개 뽑아오기, 숫자 몇개 뽑아오기, 알파벳 몇개 뽑기
      var starNum = Math.floor(Math.random() * 8) + 2; //랜덤으로 특문에서 몇개 뽑아올지 정하기
      var numberNum = Math.floor(Math.random() * 8) + 2; //랜덤으로 숫자에서 몇개 뽑아올지 정하기(0~10)
      var alpaNum = 8; // 랜덤으로 알파벳 중에 8개 뽑기

      var starText = [
        "~",
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "_",
        "+",
        "|",
        "<",
        ">",
        "?",
        ":",
        "{",
        "}",
        "]",
        "+",
        "/",
      ];
      var alpaArr = [];
      for (var a = 65; a <= 90; a++) {
        alpaArr.push(a);
        alpaArr.push(a + 32);
      }

      //랜덤으로 정해진 개수만큼 뽑아오기
      var pwdArr = [];
      for (var i = 0; i < alpaNum; i++) {
        pwdArr.push(String.fromCharCode(alpaArr[Math.floor(Math.random() * 10)]));
      }
      for (var i = 0; i < numberNum; i++) {
        pwdArr.push(Math.floor(Math.random() * 10));
      }
      for (var i = 0; i < starNum; i++) {
        pwdArr.push(starText[Math.floor(Math.random() * starText.length)]);
      }

      //분할정복으로 비밀번호 정하기
      var pwd = this.divideConquer(pwdArr);
      return pwd.join("");
    },

    divideConquer(pwdArr) {
      if (pwdArr.length == 1) return pwdArr;

      var middleIdx = pwdArr.length / 2; //나눌 인덱스
      var conquerPwd = []; //나누고 합칠 배열

      var onePwd = this.divideConquer(pwdArr.slice(0, middleIdx)); //나눴을 때의 첫번째 배열
      var twoPwd = this.divideConquer(pwdArr.slice(middleIdx)); //나눴을 때의 두번째 배열

      var type = Math.floor(Math.random() * 2); //0이면 순서 그대로, 1이면 순서 뒤집기

      if (type == 0) return onePwd.concat(twoPwd);
      else return twoPwd.concat(onePwd);
    },

    ...mapActions(["getSido", "getGugun", "getDong"]),
    ...mapMutations(["CLEAR_SIDO_LIST", "CLEAR_GUGUN_LIST", "CLEAR_DONG_LIST"]),
    gugunList() {
      console.log(this.sidoCode);
      this.CLEAR_GUGUN_LIST();
      this.gugunCode = this.$store.state.myPage.gugunCode;
      if (this.sidoCode) this.getGugun(this.sidoCode);
    },
    dongList() {
      console.log(this.gugunCode, "??");
      this.CLEAR_DONG_LIST();
      console.log(this.gugunCode, "??");
      this.dongCode = this.$store.state.myPage.dongCode;
      if (this.gugunCode) {
        this.getDong(this.gugunCode);
      }
    },
  },
};
</script>
<style scoped>
.page-header {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(/public/img/house-1.jpeg) center center no-repeat;
  background-size: cover;
}
#banner {
  margin-bottom: 0px;
}
</style>
