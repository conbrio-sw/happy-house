import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "@/store/index.js";
import BoardMain from "@/views/BoardView.vue";
import Login from "@/views/LoginView.vue";
import Register from "@/views/RegisterView.vue";
import MyPage from "@/views/MyPageView.vue";

import UserUpdate from "@/views/UserUpdateView.vue";

// news
import News from "@/components/News.vue";

Vue.use(VueRouter);

const routes = [
  { 
    path: "/",
    name: "Home",
    component: HomeView,
  },

  {
    path: "/board",
    name: "Board",
    component: BoardMain,
    beforeEnter: (to, from, next) => {
      if (!store.state.login.isLogin) {
        next("/login");
      } else {
        return next();
      }
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/myPage",
    name: "MyPage",
    component: MyPage,
  },
  {
    path: "/shop",
    name: "Shop",
    component: () => import("@/views/ShopView.vue"),
  },
  {
    path: "/house",
    name: "House",
    component: () => import("@/views/HouseView.vue"),
  },
  {
    path: "/userUpdate",
    name: "UserUpdate",
    component: UserUpdate,
  },
  {
    path: "/news",
    name: "News",
    component: News,
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
