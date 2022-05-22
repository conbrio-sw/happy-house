<template>
  <div id="SHOP-VIEW">
    <!-- Page Header Start -->
    <div
      class="container-fluid page-header py-6 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <div class="container text-center pt-5 pb-3">
        <h1 class="display-4 text-white animated slideInDown mb-3">
          Searching Shops
        </h1>
      </div>
    </div>
    <!-- Page Header End -->

    <div class="container-fluid box-all p-0">
      <div class="search-all">
        <div class="search-left">
          <b-row class="mt-2 mb-2 text-center">
            <div class="col-sm-4">
              <select
                class="form-select"
                aria-label="Default select example"
                v-model="key"
              >
                <option value="SHOP_NAME">상호 명</option>
                <option value="SHOP_KIND">업종</option>
                <option value="ROAD_ADDRESS">도로명</option>
              </select>
            </div>
            <div class="col-sm-5">
              <input
                class="form-control"
                type="text"
                placeholder="Search"
                v-model="word"
              />
            </div>
            <button
              type="button"
              class="btn btn-outline-primary col-sm-3"
              @click="shopList"
            >
              검색
            </button>
          </b-row>
        </div>
        <div class="search-right">
          <div class="mt-2 mb-2 text-center">
            <div style="display: inline-block" class="m-2">
              <b-form-select
                class="form-select"
                v-model="sidoCode"
                :options="sidos"
                @change="gugunList"
              ></b-form-select>
            </div>
            <div style="display: inline-block" class="m-2">
              <b-form-select
                class="form-select"
                v-model="gugunCode"
                :options="guguns"
                @change="dongList"
              ></b-form-select>
            </div>
            <div style="display: inline-block" class="m-2">
              <b-form-select
                class="form-select"
                v-model="dongCode"
                :options="dongs"
                @change="[searchClear(), shopList()]"
              ></b-form-select>
            </div>
            <div style="display: inline-block" class="m-2">
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="mst"
                v-if="!condition"
              >
                최적경로탐색
              </button>
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="shopList"
                v-if="condition"
              >
                원래대로
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="content-all">
        <div class="content-left">
          <div style="height: 1000px; margin-bottom: 2%; overflow: auto">
            <div v-if="listGetters && listGetters.length > 0">
              <shop-list-item
                v-for="(shop, index) in listGetters"
                :key="index"
                :shop="shop"
                :index="index"
              />
              <!-- <table>
                <colgroup>
                  <col width="50" />
                </colgroup>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style="cursor: pointer"
                    v-for="(shop, index) in listGetters"
                    v-bind:key="index"
                  >
                    <td>
                      <input
                        type="checkbox"
                        id="checkedList"
                        name="isSearch"
                        :data-param="index"
                      />
                    </td>
                    <shop-list-item :shop="shop" />
                  </tr>
                </tbody>
              </table> -->
            </div>
            <div v-else>상가 목록을 검색해주세요</div>
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
import http from "@/api/http";
import "url-search-params-polyfill";
import KakaoMap from "@/components/Map/KakaoMap.vue";
import ShopListItem from "@/components/shop/ShopListItem.vue";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "MyArea",
  components: {
    KakaoMap,
    ShopListItem,
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
      condition: false,
      key: "SHOP_NAME",
      word: "",
      //0521
      marker: null,
    };
  },
  created() {
    this.CLEAR_SIDO_LIST();
    this.CLEAR_GUGUN_LIST();
    this.CLEAR_DONG_LIST();
    this.gugunCode = null;
    this.dongCode = null;
    this.getSido();
    this.$store.state.shop.list = [];
    this.$store.commit("SET_NOW_SHOP");
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
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
    }
    console.log(this.sidos);
  },

  methods: {
    ...mapActions(["getSido", "getGugun", "getDong"]),
    ...mapMutations([
      "CLEAR_SIDO_LIST",
      "CLEAR_GUGUN_LIST",
      "CLEAR_DONG_LIST",
      "CLEAR_SHOP_LIST",
    ]),
    test(event) {
      alert(event);
      console.log(event);
    },
    searchClear() {
      console.log(this.word);
      this.word = "";
    },
    func() {
      this.displayMarkers(this.$store.getters.getShopList);
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
    async mst() {
      console.log(
        this.marker.getPosition().getLat(),
        this.marker.getPosition().getLng()
      );
      var arrList = [];
      //#checkedList:checked
      document.querySelectorAll(".add").forEach((element) => {
        console.log(element.dataset.param);
        arrList.push(element.dataset.param);
      });
      console.log(arrList);
      if (arrList.length == 0) {
        alert("가고 싶은 상점을 체크하세요");
      } else {
        var obj = {
          dong: this.dongCode,
          arr: arrList,
          key: this.key,
          word: this.word,
          lat: this.marker.getPosition().getLat(),
          lng: this.marker.getPosition().getLng(),
        };

        try {
          let { data } = await http.post("/shops/MST", obj);
          console.log(data);
          await this.$store.dispatch("mst", data);
          // document.querySelectorAll("#checkedList").forEach((element) => {
          //   element.checked = true;
          //   element.disabled = true;
          // });
          document.querySelectorAll(".product-item").forEach((element) => {
            element.className += "add";
          });
          this.displayMarkers(this.$store.getters.getShopList);
          this.condition = true;
        } catch (error) {
          console.error(error);
        }
      }
    },
    // async getDongName() {
    //   var dong = this.$store.state.user.dongCode;

    //   try {
    //     let { data } = await http.get("/shops/getDongCodes/" + dong); // params: params shorthand property, let response 도 제거
    //     console.log(data);
    //     var str =
    //       " " + data.sidoName + " " + data.gugunName + " " + data.dongName;
    //     document.querySelector("#myAreaName").innerHTML = str;
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
    async shopList() {
      this.CLEAR_SHOP_LIST();
      this.condition = false;
      document.querySelectorAll("#checkedList").forEach((element) => {
        element.checked = false;
        element.disabled = false;
      });
      console.log(this.dongCode, "샵리스트");
      const params = {
        dong: this.dongCode,
        key: this.key,
        word: this.word,
      };
      if (this.dongCode) {
        await this.$store.dispatch("shopList", params);
        this.displayMarkers(this.$store.getters.getShopList);
      }
      this.createMarker();
    },
    //0521
    createMarker() {
      if (this.marker != null) {
        this.marker.setMap(null);
        this.marker = null;
      }
      this.marker = new kakao.maps.Marker({
        position: this.map.getCenter(),
      });
      this.marker.setMap(this.map);
      //alert(this.marker.getPosition());
    },
    initMap() {
      var mapContainer = document.getElementById("map"); // 지도를 표시할 div
      var mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };

      // 지도를 생성합니다
      this.map = new kakao.maps.Map(mapContainer, mapOption);
      var self = this;
      kakao.maps.event.addListener(this.map, "click", function (mouseEvent) {
        // 클릭한 위도, 경도 정보를 가져옵니다
        var latlng = mouseEvent.latLng;

        var message = "클릭한 위치의 위도는 " + latlng.getLat() + " 이고, ";
        message += "경도는 " + latlng.getLng() + " 입니다";
        if (self.marker != null) {
          self.marker.setPosition(latlng);
        }
      });

      // 장소 검색 객체를 생성합니다
      this.ps = new kakao.maps.services.Places();

      // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
      this.infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
      // 커스텀 오버레이를 생성합니다
      this.customOverlay;
      //주소-좌표 변환 객체를 생성합니다
      this.geocoder = new kakao.maps.services.Geocoder();
    },
    async displayMarkers(places) {
      console.log("displayMarkers", this.markers);
      var fragment = document.createDocumentFragment();
      var bounds = new kakao.maps.LatLngBounds();
      var listStr = "";
      //console.log(places.length);
      // 지도에 표시되고 있는 마커를 제거합니다
      this.removeMarker();
      console.log(this);
      var self = this;
      console.log("===================");
      console.log(self);
      for (var i = 0; i < places.length; i++) {
        var placePosition = new kakao.maps.LatLng(places[i].lat, places[i].lng);
        var marker = this.addMarker(placePosition, i);
        var itemEl = this.getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다
        //console.log(i);
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        var title = places[i].shopName;
        var code = places[i].shopKind;
        var place = places[i];
        var map = this.map;
        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다

        (function (marker, title, code, place, map) {
          kakao.maps.event.addListener(marker, "click", function () {
            self.displayInfowindow(marker, title, place);
          });

          kakao.maps.event.addListener(map, "click", function () {
            if (self.customOverlay != null) {
              self.customOverlay.setMap(null);
            }
          });

          itemEl.onmouseover = function () {
            self.displayInfowindow(marker, title);
          };

          itemEl.onmouseout = function () {
            if (self.customOverlay != null) {
              self.customOverlay.setMap(null);
            }
          };
        })(marker, places[i].shopName, places[i].shopKind, places[i], this.map);

        // kakao.maps.event.addListener(marker, "click", function () {
        //   self.displayInfowindow(marker, title, place);
        // });

        // kakao.maps.event.addListener(map, "click", function () {
        //   if (self.customOverlay != null) {
        //     self.customOverlay.setMap(null);
        //   }
        // });

        // itemEl.onmouseover = function () {
        //   self.displayInfowindow(marker, title);
        // };

        // itemEl.onmouseout = function () {
        //   self.customOverlay.setMap(null);
        // };

        fragment.appendChild(itemEl);
      }
      // 마커를 생성하고 지도에 표시합니다

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      this.map.setBounds(bounds);
    },
    addMarker(position, idx, title) {
      var imageSrc =
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
        imgOptions = {
          spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
          spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
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

    displayInfowindow(marker, title, place) {
      console.log("displayinfo");
      var content = `
		<div class="overlaybox">
			<div class="boxtitle">${title}</div>
			<div class="first"><img src="/img/apt.png" style="width:247px; height:136px;" alt=""></div>
			<ul>
				<li class="up">
					<span class="title">이름</span>
					<span class="count">${place.buildYear}</span>
				</li>
				<li>
					<span class="title">주소</span>
					<span class="count">${place.roadAddress}</span>
				</li>
				<li>
					<span class="title">최신거래금액</span>
					<span class="count">${place.recentPrice}</span>
				</li>
				<li>
					<span class="last" id="recenthistor" data-toggle="modal" data-target="#myModal">아파트정보 update</span>
				</li>
			</ul>
		</div>
	`;
      var position = new kakao.maps.LatLng(
        marker.getPosition().getLat() + 0.00033,
        marker.getPosition().getLng() - 0.00003
      );
      this.customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
        xAnchor: 0.3,
        yAnchor: 0.91,
      });
      this.customOverlay.setMap(this.map);
    },
    removeAllChildNods(el) {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    },
  },
  computed: {
    // gttters 이용
    ...mapState(["sidos", "guguns", "dongs"]),
    listGetters() {
      return this.$store.getters.getShopList; // no getBoardList()
    },
  },
};
</script>
<style scoped>
.page-header {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(/public/img/shop.jpg) center center no-repeat;
  background-size: cover;
  margin-bottom: 1rem;
}

.underline-orange {
  display: inline-block;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 70%,
    rgba(231, 149, 27, 0.3) 30%
  );
}
#logo {
  width: 400px;
}

#map >>> .overlaybox {
  position: relative;
  width: 360px;
  height: 350px;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/box_movie.png")
    no-repeat;
  padding: 15px 10px;
}
#map >>> .overlaybox div,
ul {
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#map >>> .overlaybox li {
  list-style: none;
}
#map >>> .overlaybox .boxtitle {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png")
    no-repeat right 120px center;
  margin-bottom: 8px;
}
#map >>> .overlaybox .first {
  position: relative;
  width: 247px;
  height: 136px;
  margin-bottom: 8px;
}
#map >>> .first .text {
  color: #fff;
  font-weight: bold;
}
#map >>> .first .triangle {
  position: absolute;
  width: 48px;
  height: 48px;
  top: 0;
  left: 0;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/triangle.png")
    no-repeat;
  padding: 6px;
  font-size: 18px;
}
#map >>> .first .movietitle {
  position: absolute;
  width: 100%;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  padding: 7px 15px;
  font-size: 14px;
}
#map >>> .overlaybox ul {
  width: 247px;
}
#map >>> .overlaybox li {
  position: relative;
  margin-bottom: 2px;
  background: #2b2d36;
  padding: 5px 10px;
  color: #aaabaf;
  line-height: 1;
}
#map >>> .overlaybox li span {
  display: inline-block;
}
#map >>> .overlaybox li .number {
  font-size: 16px;
  font-weight: bold;
}
#map >>> .overlaybox li .title {
  font-size: 13px;
}
#map >>> .overlaybox li .last {
  font-size: 12px;
  margin-right: 15px;
}
#map >>> .overlaybox ul .arrow {
  position: absolute;
  margin-top: 8px;
  right: 25px;
  width: 5px;
  height: 3px;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/updown.png")
    no-repeat;
}
#map >>> .overlaybox li .up {
  background-position: 0 -40px;
}
#map >>> .overlaybox li .down {
  background-position: 0 -60px;
}
#map >>> .overlaybox li .count {
  position: absolute;
  margin-top: 5px;
  right: 15px;
  font-size: 10px;
}
#map >>> .overlaybox li:hover {
  color: #fff;
  background: #d24545;
}
#map >>> .overlaybox li:hover .up {
  background-position: 0 0px;
}
#map >>> .overlaybox li:hover .down {
  background-position: 0 -20px;
}
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
div >>> .search-all {
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
  padding: 0px 20px;
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
div >>> .content-all {
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
#SHOP-VIEW >>> #box-all {
  -webkit-box-flex: 1;
  flex-grow: 1;
  display: flex;
  width: 100%;
  height: calc(100% - 149px);
  position: relative;
}
</style>
