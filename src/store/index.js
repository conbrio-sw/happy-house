import Vue from "vue";
import Vuex from "vuex";
import http from "@/api/http";
import util from "@/common/util.js";
import createPersistedState from "vuex-persistedstate";
import router from "@/router/index.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 0520수정
    isHome: true,
    isHouse: false,
    isShop: false,
    isNotice: false,
    isLogin: false,
    isMyPage: false,
    isRegister: false,

    // 0520 수정
    map: null,
    makers: [],

    sidos: [{ value: null, text: "시/도" }],
    guguns: [{ value: null, text: "구/군" }],
    dongs: [{ value: null, text: "동" }],
    houses: [],
    house: null,


    shop: {
      list: [],
    },
    // login, NavBar
    login: {
      // NavBar
      isLogin: false,
      userName: "",
      userProfileImageUrl: "",
      // Login
      userEmail: "admin@naver.com",
      userPassword: "admin",
    },
    //
    board: {
      // list
      list: [],
      limit: 10,
      offset: 0,
      searchWord: "",

      // pagination
      listRowCount: 10,
      pageLinkCount: 10,
      currentPageIndex: 1,

      totalListItemCount: 0,

      // detail, update, delete

      boardId: 0,
      title: "",
      content: "",
      userName: "",
      regDate: "",
      regTime: "",
      readCount: 0,
      fileList: [],
      sameUser: false,
    },

    myPage: {
      userName: "",
      userPassword: "",
      userEmail: "",
      isAdmin: "",
      interestArea: "", // 한글 출력
      sidoCode: "",
      gugunCode: "",
      dongCode: "",
    },

    main: {
      news: [],
    },
  },
  getters: {
    getUserSido(state) {
      console.log(state.myPage.sido);
      return state.myPage.sido;
    },
    getUserGugun(state) {
      console.log(state.myPage.gugun);
      return state.myPage.gugun;
    },
    getUserDong(state) {
      console.log(state.myPage.dong);
      return state.myPage.dong;
    },

    completedTodosCount(state) {
      return state.todos.filter((todo) => {
        return todo.completed === true;
      }).length;
    },
    unCompletedTodosCount(state) {
      return state.todos.filter((todo) => {
        return todo.completed === false;
      }).length;
    },
    getShopList: function (state) {
      return state.shop.list;
    },
    getAptList: function (state) {
      return state.houses;
    },
    isLogin: function (state) {
      return state.login.isLogin;
    },

    getBoardList: function (state) {
      return state.board.list;
    },

    // pagination
    getPageCount: function (state) {
      return Math.ceil(
        state.board.totalListItemCount / state.board.listRowCount
      );
    },
    getStartPageIndex: function (state) {
      if (state.board.currentPageIndex % state.board.pageLinkCount == 0) {
        //10, 20...맨마지막
        return (
          (state.board.currentPageIndex / state.board.pageLinkCount - 1) *
            state.board.pageLinkCount +
          1
        );
      } else {
        return (
          Math.floor(state.board.currentPageIndex / state.board.pageLinkCount) *
            state.board.pageLinkCount +
          1
        );
      }
    },
    getEndPageIndex: function (state, getters) {
      let ret = 0;
      if (state.board.currentPageIndex % state.board.pageLinkCount == 0) {
        //10, 20...맨마지막
        ret =
          (state.board.currentPageIndex / state.board.pageLinkCount - 1) *
            state.board.pageLinkCount +
          state.board.pageLinkCount;
      } else {
        ret =
          Math.floor(state.board.currentPageIndex / state.board.pageLinkCount) *
            state.board.pageLinkCount +
          state.board.pageLinkCount;
      }
      // 위 오류나는 코드를 아래와 같이 비교해서 처리
      return ret > getters.getPageCount ? getters.getPageCount : ret;
    },
    getPrev: function (state) {
      if (state.board.currentPageIndex <= state.board.pageLinkCount) {
        return false;
      } else {
        return true;
      }
    },
    getNext: function (state, getters) {
      if (
        Math.floor(getters.getPageCount / state.board.pageLinkCount) *
          state.board.pageLinkCount <
        state.board.currentPageIndex
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  mutations: {

    SET_NOW_HOME(state) {
      //console.log("현재 홈 화면 입니다");
      state.isHome = true;
      state.isHouse = false;
      state.isShop = false;
      state.isNotice = false;
      state.isLogin = false;
      state.isMyPage = false;
      state.isRegister = false;
    },
    SET_NOW_HOUSE(state) {
      //console.log("현재 하우스 화면 입니다");
      state.isHome = false;
      state.isHouse = true;
      state.isShop = false;
      state.isNotice = false;
      state.isLogin = false;
      state.isMyPage = false;
      state.isRegister = false;
    },
    SET_NOW_SHOP(state) {
      //console.log("현재 샵 화면 입니다");
      state.isHome = false;
      state.isHouse = false;
      state.isShop = true;
      state.isNotice = false;
      state.isLogin = false;
      state.isMyPage = false;
      state.isRegister = false;
    },
    SET_NOW_NOTICE(state) {
      //console.log("현재 공지 화면 입니다");
      state.isHome = false;
      state.isHouse = false;
      state.isShop = false;
      state.isNotice = true;
      state.isLogin = false;
      state.isMyPage = false;
      state.isRegister = false;
    },

    // login, mypage, sugnup 추가
    SET_NOW_LOGIN(state) {
      //console.log("현재 공지 화면 입니다");
      state.isHome = false;
      state.isHouse = false;
      state.isShop = false;
      state.isNotice = false;
      state.isLogin = true;
      state.isMyPage = false;
      state.isRegister = false;
    },
    SET_NOW_MYPAGE(state) {
      //console.log("현재 공지 화면 입니다");
      state.isHome = false;
      state.isHouse = false;
      state.isShop = false;
      state.isNotice = false;
      state.isLogin = false;
      state.isMyPage = true;
      state.isRegister = false;
    },
    SET_NOW_REGISTER(state) {
      //console.log("현재 공지 화면 입니다");
      state.isHome = false;
      state.isHouse = false;
      state.isShop = false;
      state.isNotice = false;
      state.isLogin = false;
      state.isMyPage = false;
      state.isRegister = true;
    },
    SET_SHOP_LIST(state, list) {
      state.shop.list = list;
    },
     /////////////////////////////// House start /////////////////////////////////////
    SET_SIDO_LIST(state, sidos) {
      sidos.forEach((sido) => {
        state.sidos.push({ value: sido.sidoCode, text: sido.sidoName });
      });
    },
    SET_GUGUN_LIST(state, guguns) {
      guguns.forEach((gugun) => {
        state.guguns.push({ value: gugun.gugunCode, text: gugun.gugunName });
      });
    },
    SET_DONG_LIST(state, dongs) {
      dongs.forEach((dong) => {
        state.dongs.push({ value: dong.dongCode, text: dong.dongName });
      });
    },
    CLEAR_SIDO_LIST(state) {
      state.sidos = [{ value: null, text: "시/도" }];
    },
    CLEAR_GUGUN_LIST(state) {
      state.guguns = [{ value: null, text: "구/군" }];
    },
    CLEAR_DONG_LIST(state) {
      state.dongs = [{ value: null, text: "동" }];
    },
    CLEAR_HOUSE_LIST(state) {
      console.log("집초기화");
      state.houses = [];
      state.house = null;
    },
    CLEAR_SHOP_LIST(state) {
      state.shop.list = [];
    },
    SET_HOUSE_LIST(state, houses) {
      state.houses = houses;
      console.log(houses);
    },
    SET_DETAIL_HOUSE(state, house) {
      console.log("Mutations", house);
      state.house = house;
    },
    /////////////////////////////// House end /////////////////////////////////////


    //찬비님//
    SET_LOGIN(state, payload) {
      state.login.isLogin = payload.isLogin;
      state.login.userName = payload.userName;
      state.login.userProfileImageUrl = payload.userProfileImageUrl;
    },

    SET_LOGOUT(state) {
      state.login.isLogin = false;
      state.login.userName = "";
      state.login.userProfileImageUrl = "";
    },

    SET_BOARD_LIST(state, list) {
      state.board.list = list;
    },

    SET_BOARD_TOTAL_LIST_ITEM_COUNT(state, count) {
      state.board.totalListItemCount = count;
    },

    SET_BOARD_MOVE_PAGE(state, pageIndex) {
      state.board.offset = (pageIndex - 1) * state.board.listRowCount;
      state.board.currentPageIndex = pageIndex;
    },

    SET_BOARD_DETAIL(state, payload) {
      state.board.boardId = payload.boardId;
      state.board.title = payload.title;
      state.board.content = payload.content;
      state.board.userName = payload.userName;
      state.board.regDate = util.makeDateStr(
        payload.regDt.date.year,
        payload.regDt.date.month,
        payload.regDt.date.day,
        "."
      );
      state.board.regTime = util.makeTimeStr(
        payload.regDt.time.hour,
        payload.regDt.time.minute,
        payload.regDt.time.second,
        ":"
      );
      state.board.readCount = payload.readCount;
      state.board.fileList = payload.fileList;
      state.board.sameUser = payload.sameUser;
    },
    // for UpdateModal title v-modal
    SET_BOARD_TITLE(state, title) {
      state.board.title = title;
    },

    SET_MYDATA(state, payload) {
      state.myPage.userName = payload.userName;
      state.myPage.userPassword = payload.userPassword;
      state.myPage.userEmail = payload.userEmail;
      state.myPage.isAdmin = payload.isAdmin;
      state.myPage.interestArea = payload.interestArea;
      state.myPage.sidoCode = payload.sidoCode;
      state.myPage.gugunCode = payload.gugunCode;
      state.myPage.dongCode = payload.dongCode;
      state.login.userName = payload.userName;
      state.login.userPassword = payload.userPassword;
      state.login.userEmail = payload.userEmail;
    },
    SET_NEWS_LIST(state, list) {
      state.main.news = list;
    },
  },
  actions: {
    /////////////////////////////// House start /////////////////////////////////////
    async shopList(context, params) {

      console.log(params);
      try {
        let { data } = await http.get("/shops", { params }); // params: params shorthand property, let response 도 제거
        console.log("BoardMainVue: data : ");
        console.log(data);
        context.commit("SET_SHOP_LIST", data);
      } catch (error) {
        console.error(error);
      }
    },

    async mst(context, data) {
      console.log("index.js: mst", data);
      context.commit("SET_SHOP_LIST", data);
    },
    getSido({ commit }) {
      http
        .get(`/map/sido`)
        .then(({ data }) => {
          // console.log(data);
          commit("SET_SIDO_LIST", data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getGugun({ commit }, sidoCode) {
      console.log("getGugun");
      const params = { sido: sidoCode };
      http
        .get(`/map/gugun`, { params })
        .then(({ data }) => {
          // console.log(commit, response);
          commit("SET_GUGUN_LIST", data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getDong({ commit }, gugunCode) {
      const params = { gugun: gugunCode };
      http
        .get(`/map/dong`, { params })
        .then(({ data }) => {
          // console.log(commit, response);
          //console.log(data);
          commit("SET_DONG_LIST", data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getHouseAll({ commit }, params) {
      await http
        .get(`/map/aptAll`, { params })
        .then(({ data }) => {
          // console.log(commit, data);
          commit("SET_HOUSE_LIST", data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    ,
    async getHouseList({ commit }, params) {
      // vue cli enviroment variables 검색
      //.env.local file 생성.
      // 반드시 VUE_APP으로 시작해야 한다.
      // const SERVICE_KEY = "ll4XZIl2q/Lbq3oW4OOtKvgZddpzKjC46pwslkRCVHgKhlgPOxSuj/Ur5QwNWhfOSNJkO1WDc2LFXQSivp4kHA==";
      // const SERVICE_KEY =
      //   "9Xo0vlglWcOBGUDxH8PPbuKnlBwbWU6aO7%2Bk3FV4baF9GXok1yxIEF%2BIwr2%2B%2F%2F4oVLT8bekKU%2Bk9ztkJO0wsBw%3D%3D";
      // const SERVICE_URL =
      //   "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev";


      await http
        .get(`/map/apt`, { params })
        .then(({ data }) => {
          // console.log(commit, data);
          commit("SET_HOUSE_LIST", data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    detailHouse({ commit }, house) {
      // 나중에 house.일련번호를 이용하여 API 호출
      // console.log(commit, house);
      commit("SET_DETAIL_HOUSE", house);
    },
    /////////////////////////////// House end /////////////////////////////////////

    /// 찬비님
    async boardList(context) {
      let params = {
        limit: this.state.board.limit,
        offset: this.state.board.offset,
        searchWord: this.state.board.searchWord,
      };

      try {
        let { data } = await http.get("/boards", { params }); // params: params shorthand property, let response 도 제거
        console.log("BoardMainVue: data : ");
        console.log(data);
        if (data.result == "login") {
          router.push("/login");
        } else {
          context.commit("SET_BOARD_LIST", data.list);
          context.commit("SET_BOARD_TOTAL_LIST_ITEM_COUNT", data.count);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async myData(context) {
      // myPage 조회
      var userEmail = this.state.login.userEmail;

      try {
        let { data } = await http.get("/user/" + userEmail);

        if (data.result == "login") {
          router.push("/login");
        } else {
          let interestArea = await this.dispatch("getDongName", data.dongCode);
          let params = {
            userName: data.userName,
            userPassword: data.userPassword,
            userEmail: data.userEmail,
            isAdmin: data.isAdmin == 1 ? "Admin" : "Guest",
            interestArea: interestArea,
            sidoCode: data.dongCode == null ? null : data.dongCode.substr(0, 2),
            gugunCode: data.dongCode == null ? null : data.dongCode.substr(0, 5),
            dongCode: data.dongCode == null ? null : data.dongCode,
          };

          context.commit("SET_MYDATA", params);
          //getDongName(data.dongCode);

          //sessionStorage.setItem("userName", data.userName);
          //sessionStorage.setItem("userEmail", data.userEmail);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getDongName(context, dongCode) {
      try {
        let { data } = await http.get("/shops/getDongCodes/" + dongCode);

        var str = data.sidoName + " " + data.gugunName + " " + data.dongName;
        console.log(str);
        return str;
      } catch (error) {
        console.error(error);
      }
    },
    async deleteUser(context) {
      let params = {
        userName: this.state.login.userName,
        userEmail: this.state.login.userEmail,
      };
      try {
        let { data } = await http.delete("/user", { params });
        sessionStorage.clear();
        context.commit("SET_LOGOUT");
        console.log(data.result);
      } catch (error) {
        console.error(error);
      }
    },
    logout(context) {
      try {
        http.get("/logout"); // params: params shorthand property, let response 도 제거
        sessionStorage.clear();
        context.commit("SET_LOGOUT");
      } catch (error) {
        console.error(error);
      }
    },
    async getNews(context) {
      console.log("news 가져오기");
      try {
        let data = await http.get("/api/server/news");
        var item = data.data.data; //JSON.parse(data.data.data); //JSON.stringify(data.data.items[0]);
        var items = JSON.parse(item);
        //this.news = items.items;
        console.log(items.items);
        var tmp = [];
        // console.log(this.news);
        //.substr(0, 50)
        for (var i = 0; i < 10; i++) {
          tmp.push({
            title: items.items[i].title,
            description:
              items.items[i].description + "<b style='font-size:10px'>더보기</b>",
            originallink: items.items[i].originallink,
          });
          //console.log("original " + tmp[i].originallink);
        }
        //console.log(tmp.title);

        await context.commit("SET_NEWS_LIST", tmp);
      } catch (error) {
        console.log(error);
      }
    },
  },
  modules: {},
  plugins: [
    createPersistedState({
      // 브라우저 종료시 제거하기 위해 localStorage가 아닌 sessionStorage로 변경. (default: localStorage)
      storage: sessionStorage,
    }),
  ],
});
