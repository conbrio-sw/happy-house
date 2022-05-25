<template>
  <!-- End Header -->

  <!-- End Footer -->

  <!-- Topbar Start -->
  <div id="topNav">
    <div
      class="container-fluid top-bar bg-dark text-light px-0 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <div class="row gx-0 align-items-center d-none d-lg-flex">
        <div class="col-lg-6 px-4 text-start">
          <img src="img/logo/logo_transparent.jpg" height="44px" alt="" />
        </div>
        <div class="col-lg-6 px-5 text-end">
          <small>Follow us:</small>
          <div class="h-100 d-inline-flex align-items-center">
            <a
              class="btn-lg-square text-primary border-end rounded-0"
              href="https://www.facebook.com/"
              ><i class="fab fa-facebook-f"></i
            ></a>
            <a
              class="btn-lg-square text-primary border-end rounded-0"
              href="https://twitter.com/?lang=ko"
              ><i class="fab fa-twitter"></i
            ></a>
            <a
              class="btn-lg-square text-primary border-end rounded-0"
              href="https://github.com/"
              ><i class="fab fa-github"></i
            ></a>
            <a
              class="btn-lg-square text-primary pe-0"
              href="https://www.instagram.com/"
              ><i class="fab fa-instagram"></i
            ></a>
          </div>
        </div>
      </div>
    </div>
    <!-- Topbar End -->

    <!-- Navbar Start -->
    <nav
      class="navbar navbar-expand-lg navbar-dark fixed-top py-lg-0 px-lg-5 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <a href="/" class="navbar-brand ms-4 ms-lg-0">
        <h1 class="text-primary m-0">HappyHouse</h1>
      </a>
      <button
        type="button"
        class="navbar-toggler me-4"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <div class="navbar-nav mx-auto p-4 p-lg-0">
          <a href="/" class="nav-item nav-link" :class="{ active: isHome }"
            >Home</a
          >
          <a
            href="/house"
            class="nav-item nav-link"
            :class="{ active: isHouse }"
            >House</a
          >
          <a href="/shop" class="nav-item nav-link" :class="{ active: isShop }"
            >Shop</a
          >
          <a
            href="/board"
            class="nav-item nav-link"
            :class="{ active: isNotice }"
            >Notice</a
          >
          <a
            v-if="!this.$store.state.login.isLogin"
            href="/login"
            class="nav-item nav-link"
            :class="{ active: isLogin }"
            >Login</a
          >
          <a
            v-if="!this.$store.state.login.isLogin"
            href="/register"
            class="nav-item nav-link"
            :class="{ active: isRegister }"
            >SignUp</a
          >
          <a
            v-if="this.$store.state.login.isLogin"
            href="/myPage"
            class="nav-item nav-link"
            :class="{ active: isMyPage }"
            >MyPage</a
          >
          <span
            style="cursor: pointer"
            v-if="this.$store.state.login.isLogin"
            @click="logout"
            class="nav-item nav-link"
            >Logout</span
          >
        </div>
        <div class="d-none d-lg-flex">
          <div
            class="flex-shrink-0 btn-lg-square border border-light rounded-circle"
          >
            <i class="fa fa-phone text-primary"></i>
          </div>
          <div class="ps-3">
            <small class="text-primary mb-0">Call Us</small>
            <p class="text-light fs-5 mb-0">02-3429-5100</p>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "HeaderNaviBar",
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
  mounted() {
    console.log(this.isPage);
  },
  computed: {
    ...mapState([
      "isHome",
      "isHouse",
      "isShop",
      "isNotice",
      "isLogin",
      "isMyPage",
      "isRegister",
    ]),
  },
};
</script>

<style scoped></style>
