<template>
  <div>
    <div class="container-fluid box-all p-0">
      <div class="search-all">
        <div class="search-left">
          <div class="mt-2 mb-2 text-center mx-auto">
            <div style="display: inline-block; width: 110px; margin-right: 5px">
              <b-form-select
                class="form-select"
                v-model="sidoCode"
                :options="sidos"
                @change="gugunList"
              ></b-form-select>
            </div>
            <div style="display: inline-block; width: 110px; margin-right: 5px">
              <b-form-select
                class="form-select"
                v-model="gugunCode"
                :options="guguns"
                @change="dongList"
              ></b-form-select>
            </div>
            <div style="display: inline-block; width: 160px">
              <b-form-select
                class="form-select"
                v-model="dongCode"
                :options="dongs"
                @change="[searchClear(), searchApt()]"
              ></b-form-select>
            </div>
          </div>
        </div>
        <div class="search-right">
          <div class="mt-2 mb-2 text-center">
            <div style="display: inline-block; width: 120px" class="m-2">
              <select
                class="form-select"
                aria-label="Default select example"
                v-model="key"
                @change="searchClear"
              >
                <option value="aptName">아파트 명</option>
                <option value="buildyear">건축년도</option>
                <option value="dealAmount">거래금액</option>
                <option value="area">넓이</option>
              </select>
            </div>
            <div
              v-if="searchTypeIsText"
              style="display: inline-block; width: 300px"
              class="m-2"
            >
              <input
                class="form-control"
                type="text"
                placeholder="Search"
                v-model="word"
              />
            </div>
            <div v-else style="display: inline-block; width: 300px" class="m-2">
              <input
                class="form-control"
                type="number"
                placeholder="최소"
                v-model="minValue"
                style="display: inline-block; width: 145px; margin-right: 10px"
              />
              <input
                class="form-control"
                type="number"
                placeholder="최대"
                v-model="maxValue"
                style="display: inline-block; width: 145px"
              />
            </div>
            <div style="display: inline-block" class="m-2">
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="searchApt"
                style="width: 100%"
              >
                검색
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="content-all">
        <div class="content-left">
          <div style="height: 1000px; margin-bottom: 2%; overflow: auto">
            <house-list />
          </div>
        </div>
        <div class="content-right">
          <div id="map" style="width: 100%; height: 1000px"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import HouseList from "@/components/house/HouseList.vue";
//import HouseDetail from "@/components/house/HouseDetail.vue";
export default {
  name: "HouseSearchBar",
  components: {
    HouseList,
    // HouseDetail,
  },
  data() {
    return {
      sidoCode: null,
      gugunCode: null,
      dongCode: null,
      markers: [],
      map: null,
      ps: null,
      infowindow: null,
      customOverlay: null,
      geocoder: null,
      key: "aptName",
      word: "",
      minValue: "",
      maxValue: "",

      //0524
      lat_min: "",
      lat_max: "",
      lng_min: "",
      lng_max: "",
      bounds: null,
    };
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
      console.log("mounted if");
    } else {
      const script = document.createElement("script");
      const appkey = process.env.VUE_APP_KAKAO_MAP_API_KEY;
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=" +
        appkey +
        "&libraries=services";
      document.head.appendChild(script);
      console.log("mounted else");
    }
  },
  updated() {
    console.log("updated");
  },
  computed: {
    ...mapState(["sidos", "guguns", "houses", "dongs"]),
    // sidos() {
    //   return this.$store.state.sidos;
    // },
    searchTypeIsText() {
      if (this.key == "aptName") return true;
      else return false;
    },
  },
  created() {
    // this.$store.dispatch("getSido");
    // this.sidoList();
    this.CLEAR_SIDO_LIST();
    this.getSido();
    this.CLEAR_GUGUN_LIST();
    this.CLEAR_DONG_LIST();
    this.gugunCode = null;
    this.dongCode = null;
    console.log("created", this.$store.getters.getUserDong);
  },
  methods: {
    getUserInfo() {
      if (
        this.$store.state.myPage.dongCode != null &&
        this.$store.state.myPage.dongCode != ""
      ) {
        console.log("유저정보가져오기 ---------");
        console.log("카카오정보", window.kakao);
        this.sidoCode = this.$store.state.myPage.sidoCode;
        this.getGugun(this.sidoCode);
        this.gugunCode = this.$store.state.myPage.gugunCode;
        this.getDong(this.gugunCode);
        this.dongCode = this.$store.state.myPage.dongCode;
        this.searchApt();
      }
    },
    ...mapActions([
      "getSido",
      "getGugun",
      "getDong",
      "getHouseList",
      "getHouseAll",
    ]),
    ...mapMutations(["CLEAR_SIDO_LIST", "CLEAR_GUGUN_LIST", "CLEAR_DONG_LIST"]),
    // sidoList() {
    //   this.getSido();
    // },
    searchClear() {
      this.word = "";
      this.minValue = "";
      this.maxValue = "";
    },
    gugunList() {
      console.log(this.sidoCode);
      this.CLEAR_GUGUN_LIST();
      this.CLEAR_DONG_LIST();
      this.gugunCode = null;
      this.dongCode = null;
      if (this.sidoCode) this.getGugun(this.sidoCode);
    },
    dongList() {
      console.log(this.gugunCode, "??");
      this.CLEAR_DONG_LIST();
      console.log(this.gugunCode, "??");
      this.dongCode = null;
      if (this.gugunCode) {
        this.getDong(this.gugunCode);
      }
    },
    async searchApt() {
      const params = {
        dong: this.dongCode,
        key: this.key,
        word: this.word,
        minValue: this.minValue,
        maxValue: this.maxValue,
      };
      if (this.dongCode) {
        await this.getHouseList(params);
        this.displayMarkers(this.$store.getters.getAptList);
        this.map.setBounds(this.bounds);
      }
    },
    async initMap() {
      // 마커를 담을 배열입니다
      //var markers = [];

      var mapContainer = document.getElementById("map"); // 지도를 표시할 div
      var mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };

      // 지도를 생성합니다
      this.map = new kakao.maps.Map(mapContainer, mapOption);

      // 장소 검색 객체를 생성합니다
      this.ps = new kakao.maps.services.Places();
      kakao.maps.event.addListener(this.map, "idle", this.searchPlaces);
      // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
      this.infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
      // 커스텀 오버레이를 생성합니다
      this.customOverlay;
      //주소-좌표 변환 객체를 생성합니다
      this.geocoder = new kakao.maps.services.Geocoder();
      this.getUserInfo();
    },
    async searchPlaces() {
      this.lat_min = this.map.getBounds().qa;
      this.lat_max = this.map.getBounds().pa;
      this.lng_max = this.map.getBounds().oa;
      this.lng_min = this.map.getBounds().ha;
      console.log("lat 최소 최대 = ", this.lat_min, this.lat_max);
      console.log("lng 최소 최대 = ", this.lng_min, this.lng_max);
      const params = {
        lat_min: this.lat_min,
        lat_max: this.lat_max,
        lng_max: this.lng_max,
        lng_min: this.lng_min,
        dong: this.dongCode,
        key: this.key,
        word: this.word,
        minValue: this.minValue,
        maxValue: this.maxValue,
      };
      this.removeMarker();
      await this.getHouseAll(params);
      this.displayMarkers(this.$store.getters.getAptList);
    },
    async displayMarkers(places) {
      var fragment = document.createDocumentFragment();
      this.bounds = new kakao.maps.LatLngBounds();
      var listStr = "";
      //console.log(places.length);
      // 지도에 표시되고 있는 마커를 제거합니다
      this.removeMarker();
      var self = this;
      var listItem = document.querySelectorAll(".product-item");
      for (var i = 0; i < places.length; i++) {
        var placePosition = new kakao.maps.LatLng(places[i].lat, places[i].lng);
        var marker = this.addMarker(placePosition, i);
        var itemEl = this.getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다
        //console.log(i);
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        this.bounds.extend(placePosition);
        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        console.log(places[i]);
        var title = places[i].aptName;
        var code = places[i].shopKind;
        var place = places[i];
        var map = this.map;

        (function (marker, title, code, place, map) {
          kakao.maps.event.addListener(marker, "click", function () {
            if (self.customOverlay != null) {
              self.customOverlay.setMap(null);
            }
            self.displayInfowindow(marker, title, place);
          });

          itemEl.onmouseover = function () {
            self.displayInfowindow(marker, title);
          };

          itemEl.onmouseout = function () {
            if (self.customOverlay != null) {
              self.customOverlay.setMap(null);
            }
          };
          listItem[i].onmouseover = function () {
            if (self.customOverlay != null) {
              self.customOverlay.setMap(null);
            }
            self.displayInfowindow(marker, title, place);
          };
        })(marker, places[i].aptName, places[i].shopKind, places[i], this.map);

        fragment.appendChild(itemEl);
      }
      // 마커를 생성하고 지도에 표시합니다

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    },
    addMarker(position, idx, title) {
      var imageSrc =
          //"https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
          "img/marker/house.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
        imgOptions = {
          // spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
          // spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imgOptions
        ),
        marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage,
        });

      marker.setMap(this.map); // 지도 위에 마커를 표출합니다
      this.markers.push(marker); // 배열에 생성된 마커를 추가합니다

      return marker;
    },
    removeMarker() {
      console.log("마커지우는중");
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers = [];
    },

    getListItem(index, place) {
      var el = document.createElement("li");
      var itemStr = `
		<span class="markerbg marker_${index + 1}></span>
		<div class="info"><h5>${place.aptName}</h5> <button>관심등록</button>
		<span>${place.sidoName} ${place.gugunName} ${place.dongName} ${
        place.jibun
      }</span>
	`;
      el.innerHTML = itemStr;
      el.className = "item";

      return el;
    },
    //"/img/house/info.jfif"
    displayInfowindow(marker, title, place) {
      var content = `
      <!-- Profile Image -->
    <div class="card card-primary card-outline" style="width: 300px">
      <div class="card-body box-profile">
        <div class="text-center" style="height: 200px">
          <img
            class="profile-user-img img-fluid img-circle"
            src=${place.img}
            alt="User profile picture"
            style="height: 190px; width: 266px"
          />
        </div>

        <h3 class="profile-username text-center" style="overflow:hidden">${title}</h3>

        <p class="text-muted text-center">${place.buildYear}년 건축</p>

        <ul class="list-group list-group-unbordered mb-3" style="overflow:hidden">
          <li class="list-group-item">
            <b>넓이</b> <a class="float-right">${place.area}m<sup>2</sup></a>
          </li>
          <li class="list-group-item">
            <b>층</b> <a class="float-right">${place.floor}</a>
          </li>
          <li class="list-group-item">
            <b>최근거래금액</b> <a class="float-right">${place.recentPrice}</a>
          </li>
        </ul>

        <a href="#" class="btn btn-primary btn-block"><b>Follow</b></a>
        <div class="close" title="닫기" id="close"></div>
      </div>
      <!-- /.card-body -->

      `;

      var position = new kakao.maps.LatLng(
        marker.getPosition().getLat(),
        marker.getPosition().getLng()
      );
      this.customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
        xAnchor: 0.5,
        yAnchor: 1,
        clickable: true, // 커스텀 오버레이 클릭 시 지도에 이벤트를 전파하지 않도록 설정한다
      });
      this.customOverlay.setMap(this.map);
      var self = this;
      document.querySelector("#close").onclick = function () {
        self.customOverlay.setMap(null);
      };
    },
    removeAllChildNods(el) {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-thumb {
  background-color: #eaa636;
  border-radius: 10px;
  background-clip: padding-box;
  border: 2px solid transparent;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
  box-shadow: inset 0px 0px 5px white;
}
.box-all >>> .search-all {
  flex: 0 0 auto;
  display: flex;
  width: 100%;
  height: 64px;
  border-bottom: 1px solid rgb(205, 205, 205);
  background-color: rgb(255, 255, 255);
  z-index: 900;
}
div >>> .search-left {
  flex: 0 0 auto;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  width: 400px;
  height: 100%;
  padding: 0px;
  border-right: 1px solid rgb(231, 231, 231);
  position: relative;
}
div >>> .search-right {
  -webkit-box-flex: 1;
  flex-grow: 1;
  display: flex;
  -webkit-box-align: center;
  align-items: center;

  height: 100%;
  padding: 0px 12px 0px 8px;
}
.box-all >>> .content-all {
  -webkit-box-flex: 1;
  flex-grow: 1;
  display: flex;
  width: 100%;
  height: calc(100% - 149px);
  position: relative;
}
div >>> .content-left {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 100%;
  border-right: 1px solid rgb(231, 231, 231);
  position: relative;
  overflow: hidden;
}
div >>> .content-right {
  -webkit-box-flex: 1;
  flex-grow: 1;
  position: relative;
  z-index: 10;
}

#map >>> .close {
  position: absolute;
  bottom: 25px;
  right: 10px;
  color: #888;
  width: 17px;
  height: 17px;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png");
  /*  */
}
#map >>> .float-right {
  float: right !important;
}

div >>> box-profile {
  white-space: nowrap;
}
</style>
