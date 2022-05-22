<template>
  <div class="container">
    <div class="mb-3 d-flex justify-content-center">
      <h1 class="display-4">
        <a href="/" style="text-decoration: none; color: black">HAPPY HOUSE</a>
      </h1>
    </div>
    <div class="mb-3">
      <h2>MyPage</h2>
    </div>

    <div id="userDetail">
      <div class="mb-3">
        <label for="userName">User Name:</label>
        <p>{{ $store.state.myPage.userName }}</p>
      </div>
      <div class="mb-3">
        <label for="userPassword">Password:</label>
        <p>{{ $store.state.myPage.userPassword }}</p>
      </div>
      <div class="mb-3">
        <label for="userEmail">Email:</label>
        <p>{{ $store.state.myPage.userEmail }}</p>
      </div>
      <div class="mb-3">
        <label for="userIsAdmin">Grade (관리자를 원하시면 문의 바랍니다):</label>
        <p>{{ $store.state.myPage.isAdmin }}</p>
      </div>
      <div class="mb-3">
        <label for="userInterestArea">관심지역 : </label>
        <p v-if="$store.state.myPage.interestArea">{{ $store.state.myPage.interestArea }}</p>
      </div>
      <div>
        <button id="btnUserUpdate" class="btn btn-primary">수정하기</button>
        <button id="btnUserExit" class="btn btn-primary">탈퇴하기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("myData");
  },
};
</script>

<style></style>
