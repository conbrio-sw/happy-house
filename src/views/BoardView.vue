<template>
  <div>
    <div
      class="container-fluid page-header py-6 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <div class="container text-center pt-5 pb-3">
        <h1 class="display-4 text-white animated slideInDown mb-3">Notice</h1>
      </div>
    </div>
    <div class="container">
      <div class="input-group mb-3">
        <!-- store 사용 -->
        <!-- <input v-model="searchWord" @keydown.enter="boardList" type="text" class="form-control"> -->
        <button class="btn btn-sm btn-secondary col-1" @click="showInsertModal">
          글쓰기
        </button>
        <input
          v-model="$store.state.board.searchWord"
          @keydown.enter="boardList"
          type="text"
          class="form-control"
          placeholder="검색어를 입력해주세요."
        />
        <button @click="boardList" class="btn btn-primary" type="button">
          <img src="img/magnifying-glass (1).png" width="20" />
        </button>
        <!-- <button class="btn btn-sm btn-secondary col-1" @click="showInsertModal">글쓰기</button> -->
      </div>

      <table class="table table-hover table">
        <thead class="table-secondary">
          <tr>
            <th class="col-sm-2" scope="col">글번호</th>
            <th class="col-sm-5" scope="col">제목</th>
            <th class="col-sm-2" scope="col">작성자</th>
            <th class="col-sm-2" scope="col">작성일시</th>
            <th class="col-sm-1" scope="col">조회수</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <!-- store 사용 -->

          <!-- 직접 store 에 접근해도 된다. -->
          <!-- <tr v-for="(board, index) in $store.state.board.list" @click="boardDetail(board.boardId)" v-bind:key="index"> -->

          <!-- getters 를 이용하는 코드 -->
          <!-- computed - listGetters - getBoardList  -->
          <tr
            style="cursor: pointer"
            v-for="(board, index) in listGetters"
            @click="boardDetail(board.boardId)"
            v-bind:key="index"
          >
            <td scope="row">{{ board.boardId }}</td>
            <td>{{ board.title }}</td>
            <td>{{ board.userName }}</td>
            <td>{{ board.regDt.date | makeDateStr(".") }}</td>
            <td>{{ board.readCount }}</td>
          </tr>
        </tbody>
      </table>

      <!-- props 사용 X -->
      <!-- <pagination 
      v-bind:listRowCount="listRowCount"
      v-bind:pageLinkCount="pageLinkCount"
      v-bind:currentPageIndex="currentPageIndex"
      v-bind:totalListItemCount="totalListItemCount"
      v-on:call-parent="movePage"
    ></pagination> -->
      <pagination v-on:call-parent="movePage"></pagination>

      <insert-modal v-on:call-parent-insert="closeAfterInsert"></insert-modal>
      <!-- props 제거 -->
      <detail-modal
        v-on:call-parent-change-to-update="changeToUpdate"
        v-on:call-parent-change-to-delete="changeToDelete"
      ></detail-modal>
      <update-modal v-on:call-parent-update="closeAfterUpdate"></update-modal>
    </div>
  </div>
</template>

<script>
import InsertModal from "@/components/modals/InsertModal.vue";
import DetailModal from "@/components/modals/DetailModal.vue";
import UpdateModal from "@/components/modals/UpdateModal.vue";

import { Modal } from "bootstrap";

import http from "@/api/http.js";
import util from "@/common/util.js";

import Pagination from "../components/Pagination.vue";

// 삭제
import Vue from "vue";
import VueAlertify from "vue-alertify";
Vue.use(VueAlertify);

export default {
  name: "BoardMain",
  components: { InsertModal, DetailModal, UpdateModal, Pagination },
  data() {
    return {
      // modal
      insertModal: null,
      detailModal: null,
      updateModal: null,
    };
  },
  computed: {
    // gttters 이용
    listGetters() {
      return this.$store.getters.getBoardList; // no getBoardList()
    },
  },
  methods: {
    // list
    // store actions 에 구현
    // 가능한 한 가지 방법
    boardList() {
      this.$store.dispatch("boardList");
    },

    // pagination
    movePage(pageIndex) {
      console.log("BoardMainVue : movePage : pageIndex : " + pageIndex);

      // store commit 으로 변경
      // this.offset = (pageIndex - 1) * this.listRowCount;
      // this.currentPageIndex = pageIndex;
      this.$store.commit("SET_BOARD_MOVE_PAGE", pageIndex);

      this.boardList();
    },

    // util
    makeDateStr: util.makeDateStr,

    // insert
    showInsertModal() {
      if (this.$store.state.myPage.isAdmin != "Admin") {
        this.$alertify.alertWithTitle(
          "등록 불가",
          "관리자만 공지 등록이 가능합니다."
        );
        return;
      }
      this.insertModal.show();
    },

    closeAfterInsert() {
      this.insertModal.hide();
      this.boardList();
    },

    // detail
    async boardDetail(boardId) {
      // store 변경
      // this.boardId = boardId;
      // this.$store.commit('mutateSetBoardBoardId', boardId);

      try {
        let { data } = await http.get("/boards/" + boardId);
        console.log(data);

        if (data.result == "login") {
          this.doLogout(); // this.$router.push("/login"); 에서 변경
        } else {
          let { dto } = data;
          this.$store.commit("SET_BOARD_DETAIL", dto);

          this.detailModal.show();
        }
      } catch (error) {
        console.log("BoardMainVue: error : ");
        console.log(error);
      }
    },

    changeToUpdate() {
      // board parameter 필요 없음.
      // data update 사용 X
      // this.board = board;
      this.detailModal.hide();
      this.updateModal.show();
    },

    closeAfterUpdate() {
      this.updateModal.hide();
      this.boardList();
    },

    changeToDelete() {
      this.detailModal.hide();

      var $this = this; // alertify.confirm-function()에서 this 는 alertify 객체
      this.$alertify.confirmWithTitle(
        "삭제 확인",
        "이 글을 삭제하시겠습니까?",
        function () {
          // board.boardId 사용 X
          $this.boardDelete(); // $this 사용
        },
        function () {
          console.log("cancel");
        }
      );
    },
    async boardDelete() {
      // parameter 사용 X

      try {
        let { data } = await http.delete(
          "/boards/" + this.$store.state.board.boardId
        );
        console.log(data);

        if (data.result == "login") {
          this.doLogout();
        } else {
          this.$alertify.success("글이 삭제되었습니다.");
          this.boardList();
        }
      } catch (error) {
        console.log("BoardMainVue: error : ");
        console.log(error);
      }
    },
    // logout 처리 별도 method
    doLogout() {
      this.$store.commit("SET_LOGIN", {
        isLogin: false,
        userName: "",
        userProfileImageUrl: "",
      });
      this.$router.push("/login");
    },
  },
  created() {
    this.boardList();
    this.$store.commit("SET_NOW_NOTICE");
  },
  mounted() {
    this.insertModal = new Modal(document.getElementById("insertModal"));
    this.detailModal = new Modal(document.getElementById("detailModal"));
    this.updateModal = new Modal(document.getElementById("updateModal"));
  },
  filters: {
    makeDateStr: function (date, separator) {
      return (
        date.year +
        separator +
        (date.month < 10 ? "0" + date.month : date.month) +
        separator +
        (date.day < 10 ? "0" + date.day : date.day)
      );
    },
  },
};
</script>

<style scoped>
.page-header {
  margin-bottom: 6rem;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(/public/img/notice/header.jpg) center center no-repeat;
  background-size: cover;
}
/* #detailModal >>> .modal-lg {
  width: 800px;
}
#detailModal >>> .modal-xl {
  width: 1140px;
} */
</style>
