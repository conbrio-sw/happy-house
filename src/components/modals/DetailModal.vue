<template>
  <div class="modal" tabindex="-1" id="detailModal">
    <div
      class="modal-dialog modal-dialog-scrollable modal-xl modal-dialog-centered"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" style="color: #eaa636 !important">
            공지사항
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div
            class="card card-primary card-outline"
            style="vertical-align: baseline"
          >
            <div
              class="card-header row p-0 m-0"
              style="height: 50px; line-height: 60px"
            >
              <div class="col-sm-1" style="text-align: center">
                {{ $store.state.board.boardId }}.
              </div>
              <h3 class="card-title m-0 p-0 col-sm-8" style="line-height: 50px">
                {{ $store.state.board.title }}
              </h3>
              <div class="col-sm-3">
                <div style="text-align: right" class="px-2">
                  {{ $store.state.board.regDate }}
                  {{ $store.state.board.regTime }}
                </div>
              </div>
            </div>
            <!-- /.card-header -->
            <div class="card-body p-0">
              <div class="mailbox-read-info m-2 row" style="line-height: 32px">
                <h5 class="col-sm-6 m-0 p-0">
                  <div class="mx-2">
                    {{ $store.state.board.userName }}
                  </div>
                </h5>
                <h6 class="col-sm-6 m-0 p-0" style="text-align: right">
                  조회수
                  <span class="mailbox-read-time float-right mx-2">{{
                    $store.state.board.readCount
                  }}</span>
                </h6>
              </div>
              <hr class="m-0" />
              <!-- /.mailbox-read-info -->

              <div class="mailbox-read-message" style="min-height: 400px">
                <div class="m-4">
                  <p v-html="$store.state.board.content"></p>
                  <div v-if="$store.state.board.fileList.length > 0">
                    <div
                      v-for="(file, index) in $store.state.board.fileList"
                      :key="index"
                    >
                      <img
                        :src="folder + file.fileUrl"
                        class="img-fluid"
                        max-width="1000px"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- /.mailbox-read-message -->
            </div>
            <!-- /.card-body -->

            <div class="card-footer row px-0 m-0">
              <div class="col-sm-1 fileName" style="line-height: 38px">
                <strong>첨부파일</strong>
              </div>
              <div class="col-sm-11">
                <div v-if="$store.state.board.fileList.length > 0">
                  <div
                    v-for="(file, index) in $store.state.board.fileList"
                    :key="index"
                  >
                    <span class="fileName">{{ file.fileName }}</span>

                    <a
                      class="btn btn-outline btn-default btn-xs"
                      v-bind:href="file.fileUrl"
                      v-bind:download="file.fileName"
                      target="_self"
                      >내려받기</a
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- /.card-footer -->
          </div>
          <!-- /.card -->
        </div>
        <div class="modal-footer">
          <button
            v-show="$store.state.board.sameUser"
            @click="changeToUpdate"
            class="btn btn-sm btn-secondary btn-outline"
            data-dismiss="modal"
            type="button"
          >
            수정하기
          </button>
          <button
            v-show="$store.state.board.sameUser"
            @click="changeToDelete"
            class="btn btn-sm btn-danger btn-outline"
            data-dismiss="modal"
            type="button"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      folder: "http://localhost/",
    };
  },
  methods: {
    changeToUpdate() {
      this.$emit("call-parent-change-to-update");
    },
    changeToDelete() {
      this.$emit("call-parent-change-to-delete");
    },
  },
};
</script>

<style scoped>
#contents {
  height: 400px;
}
.modal * {
  font-family: 맑은 고딕;
}
#card-header >>> .small-content {
  line-height: 1.2;
  vertical-align: baseline;
}
</style>
