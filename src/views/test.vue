<template>
  <div>
    <!-- Page Header Start -->
    <div
      class="container-fluid page-header py-6 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <div class="container text-center pt-5 pb-3">
        <h1 class="display-4 text-white animated slideInDown mb-3">
          Searching House
        </h1>
        <div style="display: inline-block">
          <select class="form-select" aria-label="Default select example">
            <option value="aptName">아파트 명</option>
            <option value="buildyear">건축년도</option>
            <option value="dealAmount">거래금액</option>
            <option value="area">넓이</option>
          </select>
        </div>
        <div style="display: inline-block">
          <select class="form-select" aria-label="Default select example">
            <option value="aptName">아파트 명</option>
            <option value="buildyear">건축년도</option>
            <option value="dealAmount">거래금액</option>
            <option value="area">넓이</option>
          </select>
        </div>
        <div style="display: inline-block">
          <select class="form-select" aria-label="Default select example">
            <option value="aptName">아파트 명</option>
            <option value="buildyear">건축년도</option>
            <option value="dealAmount">거래금액</option>
            <option value="area">넓이</option>
          </select>
        </div>
      </div>
    </div>
    <!-- Page Header End -->
    <!-- Profile Image -->
    <div class="card card-primary card-outline" style="width: 500px">
      <div class="card-body box-profile">
        <div class="text-center">
          <img
            class="profile-user-img img-fluid img-circle"
            src="/img/team-1.jpg"
            alt="User profile picture"
          />
        </div>

        <h3 class="profile-username text-center">Nina Mcintire</h3>

        <p class="text-muted text-center">Software Engineer</p>

        <ul class="list-group list-group-unbordered mb-3">
          <li class="list-group-item">
            <b>Followers</b> <a class="float-right">1,322</a>
          </li>
          <li class="list-group-item">
            <b>Following</b> <a class="float-right">543</a>
          </li>
          <li class="list-group-item">
            <b>Friends</b> <a class="float-right">13,287</a>
          </li>
        </ul>

        <a href="#" class="btn btn-primary btn-block"><b>Follow</b></a>
      </div>
      <!-- /.card-body -->
    </div>
    <!-- /.card -->
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
                <option value="aptName">아파트 명</option>
                <option value="buildyear">건축년도</option>
                <option value="dealAmount">거래금액</option>
                <option value="area">넓이</option>
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
              @click="searchApt"
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
                @change="[searchClear(), searchApt()]"
              ></b-form-select>
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
    };
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=034dcc5ce4d542a740e6d5514a14db3e&libraries=services";
      document.head.appendChild(script);
    }
  },
  computed: {
    ...mapState(["sidos", "guguns", "houses", "dongs"]),
    // sidos() {
    //   return this.$store.state.sidos;
    // },
  },
  created() {
    // this.$store.dispatch("getSido");
    // this.sidoList();
    this.$store.commit("CLEAR_HOUSE_LIST");
    this.$store.commit("SET_NOW_HOUSE");
    this.CLEAR_SIDO_LIST();
    this.getSido();
  },
  methods: {
    ...mapActions(["getSido", "getGugun", "getDong", "getHouseList"]),
    ...mapMutations(["CLEAR_SIDO_LIST", "CLEAR_GUGUN_LIST", "CLEAR_DONG_LIST"]),
    // sidoList() {
    //   this.getSido();
    // },
    searchClear() {
      console.log(this.word);
      this.word = "";
    },
    gugunList() {
      console.log(this.sidoCode);
      this.CLEAR_GUGUN_LIST();
      this.gugunCode = null;
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
      };
      if (this.dongCode) {
        await this.getHouseList(params);
        this.displayMarkers(this.$store.getters.getAptList);
      }
    },
    initMap() {
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

      // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
      this.infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
      // 커스텀 오버레이를 생성합니다
      this.customOverlay;
      //주소-좌표 변환 객체를 생성합니다
      this.geocoder = new kakao.maps.services.Geocoder();
    },
    async displayMarkers(places) {
      var fragment = document.createDocumentFragment();
      var bounds = new kakao.maps.LatLngBounds();
      var listStr = "";
      //console.log(places.length);
      // 지도에 표시되고 있는 마커를 제거합니다
      this.removeMarker();
      var self = this;
      for (var i = 0; i < places.length; i++) {
        var placePosition = new kakao.maps.LatLng(places[i].lat, places[i].lng);
        var marker = this.addMarker(placePosition, i);
        var itemEl = this.getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다
        //console.log(i);
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);
        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        (function (marker, title, code, place, map) {
          kakao.maps.event.addListener(marker, "click", function () {
            self.displayInfowindow(marker, title, place);
          });

          kakao.maps.event.addListener(map, "click", function () {
            console.log(self.customOverlay);
            self.customOverlay.setMap(null);
          });

          itemEl.onmouseover = function () {
            self.displayInfowindow(marker, title);
          };

          itemEl.onmouseout = function () {
            self.customOverlay.setMap(null);
          };
        })(marker, places[i].shopName, places[i].shopKind, places[i], this.map);

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
};

//     var content2 = `
// 	<div class="overlaybox">
// 		<div class="boxtitle">${title}
//     </div>
// 		<div class="first"><img src="/img/shop/info.jpg" style="width:247px; height:136px;" alt=""></div>
// 		<ul>
// 			<li class="up">
// 				<span class="title">이름</span>
// 				<span class="count">${place.buildYear}</span>
// 			</li>
// 			<li>
// 				<span class="title">주소</span>
// 				<span class="count">${place.roadAddress}</span>
// 			</li>
// 			<li>
// 				<span class="title">최신거래금액</span>
// 				<span class="count">${place.recentPrice}</span>
// 			</li>
// 			<li>
// 				<span class="last" id="recenthistor" data-toggle="modal" data-target="#myModal">아파트정보 update</span>
// 			</li>
// 		</ul>
// 	</div>
// `;
// var content =
// '<div class="wrap">' +
// '    <div class="info">' +
// '        <div class="title">' +
// title +
// '            <div class="close" title="닫기" id="close"></div>' +
// "        </div>" +
// '        <div class="body">' +
// '            <div class="img">' +
// '                <img src="/img/shop/info.jpg" width="123" height="120">' +
// "           </div>" +
// '            <div class="desc">' +
// '                <div class="ellipsis">' +
// place.roadAddress +
// "</div>" +
// '                <div><a href="#" target="_blank" class="link">' +
// place.shopKind +
// "</a></div>" +
// "            </div>" +
// "        </div>" +
// "    </div>" +
// "</div>";
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
/* 


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

*/
</style>

#map >>> .wrap { position: absolute; left: 0; bottom: 40px; width: 388px; /* +
100*/ height: 232px; /* + 100*/ margin-left: -144px; text-align: left; overflow:
hidden; font-size: 12px; font-family: "Malgun Gothic", dotum, "돋움",
sans-serif; line-height: 1.5; } #map >>> .wrap * { padding: 0; margin: 0; } #map
>>> .wrap .info { width: 386px; /* + 100*/ height: 220px; /* + 100*/
border-radius: 5px; border-bottom: 2px solid #ccc; border-right: 1px solid #ccc;
overflow: hidden; background: #fff; } #map >>> .wrap .info:nth-child(1) {
border: 0; box-shadow: 0px 1px 2px #888; } #map >>> .info .title { /* padding:
5px 0 0 10px; */ width: 100%; padding-left: 10px; height: 60px; /* + 30*/
line-height: 60px; background: #e9a841; /* #eee */ border-bottom: 1px solid
#ddd; font-size: 25px; /* 18px */ font-weight: bold; /* */ color: #ffffff; }
#map >>> .info .close:hover { cursor: pointer; } #map >>> .info .body {
position: relative; /* overflow: hidden; */ height: 160px; } #map >>> .info
.desc { position: relative; margin: 13px 0 0 145px; height: 100%; font-size:
19px; } #map >>> .desc .ellipsis { width: 100%; text-overflow: clip; } #map >>>
.desc .jibun { font-size: 11px; color: #888; margin-top: -2px; } #map >>> .info
.img { position: absolute; /* top: 6px; left: 5px; width: 73px; height: 71px; */
top: 16px; left: 15px; width: 123px; height: 121px; border: 1px solid #ddd;
color: #888; overflow: hidden; } #map >>> .info:after { content: ""; position:
absolute; margin-left: -12px; left: 50%; bottom: 0; width: 22px; height: 12px;
background:
url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png");
} #map >>> .info .link { color: #5085bb; }
