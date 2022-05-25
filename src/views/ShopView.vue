<template>
  <div id="SHOP-VIEW" class="m-0 p-0">
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
                @change="[searchClear(), shopList()]"
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
              >
                <option value="SHOP_NAME">상호 명</option>
                <option value="SHOP_KIND">업종</option>
                <option value="ROAD_ADDRESS">도로명</option>
              </select>
            </div>
            <div style="display: inline-block; width: 300px" class="m-2">
              <input
                class="form-control"
                type="text"
                placeholder="Search"
                v-model="word"
              />
            </div>
            <div style="display: inline-block" class="m-2">
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="shopList"
              >
                검색
              </button>
            </div>
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
      <div class="content-all">
        <div class="content-left">
          <div style="height: 1000px; margin-bottom: 2%; overflow: auto">
            <b-container
              v-if="listGetters && listGetters.length > 0"
              class="bv-example-row mt-3"
            >
              <shop-list-item
                v-for="(shop, index) in listGetters"
                :key="index"
                :shop="shop"
                :index="index"
                :currCategory="currCategory"
              />
            </b-container>
            <b-container v-else class="bv-example-row mt-3">
              <b-row>
                <b-col><b-alert show>상가 목록이 없습니다.</b-alert></b-col>
              </b-row>
            </b-container>
          </div>
        </div>
        <div class="content-right">
          <div class="map_wrap" style="height: 100%">
            <div
              id="map"
              style="
                width: 100%;
                height: 100%;
                position: relative;
                overflow: hidden;
              "
            ></div>
            <ul id="category">
              <li id="BK9" data-order="0" @click.self="onClickCategory">
                <button class="category-btn" @click="test">
                  <img
                    src="https://map.pstatic.net/res/category/image/00023-00006.png"
                    alt=""
                    width="20"
                    height="20"
                  />
                  은행
                </button>
              </li>
              <li id="MT1" data-order="1" @click.self="onClickCategory">
                <button class="category-btn" @click="test">
                  <img
                    src="https://map.pstatic.net/res/category/image/00023-00105.png"
                    alt=""
                    width="20"
                    height="20"
                  />
                  마트
                </button>
              </li>
              <li id="PM9" data-order="2" @click.self="onClickCategory">
                <button class="category-btn" @click="test">
                  <img
                    src="https://map.pstatic.net/res/category/image/00023-00087.png"
                    alt=""
                    width="20"
                    height="20"
                  />
                  약국
                </button>
              </li>
              <li id="OL7" data-order="3" @click.self="onClickCategory">
                <button class="category-btn" @click="test">
                  <img
                    src="https://map.pstatic.net/res/category/image/00023-00078.png"
                    alt=""
                    width="20"
                    height="20"
                  />
                  주유소
                </button>
              </li>
              <li id="CE7" data-order="4" @click.self="onClickCategory">
                <button class="category-btn" @click="test">
                  <img
                    src="https://map.pstatic.net/res/category/image/00023-00012.png"
                    alt=""
                    width="20"
                    height="20"
                  />
                  카페
                </button>
              </li>
              <li id="CS2" data-order="5" @click.self="onClickCategory">
                <button class="category-btn" @click="test">
                  <img
                    src="https://map.pstatic.net/res/category/image/00023-00099.png"
                    alt=""
                    width="20"
                    height="20"
                  />
                  편의점
                </button>
              </li>
            </ul>
          </div>
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
      //0524
      contentNode: null,
      placeOverlay: null,
      currCategory: null,
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
        this.shopList();
      }
    },
    test(event) {
      this.CLEAR_SHOP_LIST();
      console.log(event.target.parentElement);
      var el = event.target.parentElement;
      var self = this;
      var id = el.id,
        className = el.className;

      self.placeOverlay.setMap(null);

      if (className === "on") {
        //console.log("on");
        self.currCategory = "";
        self.changeCategoryClass();
        self.removeMarker();
      } else {
        self.currCategory = id;
        //console.log("else");
        self.changeCategoryClass(el);
        self.searchPlaces();
      }
    },
    searchClear() {
      this.currCategory = null;
      this.changeCategoryClass();
      this.removeMarker();
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
      var arrList = [];
      //#checkedList:checked
      document.querySelectorAll(".add").forEach((element) => {
        console.log(element.dataset.param);
        arrList.push(element.dataset.param);
      });
      console.log(arrList);
      if (this.currCategory != null || this.marker == null) {
        console.log(this.currCategory, "yy", this.marker, "zz");
        alert("최적경로를 탐색할 위치(동 검색 후)을 정해주세요");
      } else if (arrList.length == 0) {
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
      this.contentNode = document.createElement("div");
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
      this.ps = new kakao.maps.services.Places(this.map);

      kakao.maps.event.addListener(this.map, "idle", this.searchPlaces);
      // 지도에 idle 이벤트를 등록합니다

      // 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다
      self.contentNode.className = "placeinfo_wrap";

      // 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
      // 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다
      self.addEventHandle(
        self.contentNode,
        "mousedown",
        kakao.maps.event.preventMap
      );
      self.addEventHandle(
        self.contentNode,
        "touchstart",
        kakao.maps.event.preventMap
      );
      self.placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 });
      // 커스텀 오버레이 컨텐츠를 설정합니다
      self.placeOverlay.setContent(self.contentNode);

      // 각 카테고리에 클릭 이벤트를 등록합니다
      self.addCategoryClickEvent();

      // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
      this.infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
      // 커스텀 오버레이를 생성합니다
      this.customOverlay;
      //주소-좌표 변환 객체를 생성합니다
      this.geocoder = new kakao.maps.services.Geocoder();
      this.getUserInfo();
    },
    addEventHandle(target, type, callback) {
      if (target.addEventListener) {
        target.addEventListener(type, callback);
      } else {
        target.attachEvent("on" + type, callback);
      }
    },
    searchPlaces() {
      if (!this.currCategory) {
        return;
      }
      console.log(this.currCategory, this.ps);
      // 커스텀 오버레이를 숨깁니다
      if (this.customOverlay != null) {
        this.customOverlay.setMap(null);
      }

      this.removeMarker();

      this.ps.categorySearch(this.currCategory, this.placesSearchCB, {
        useMapBounds: true,
      });
    },
    async placesSearchCB(data, status, pagination) {
      // console.log(data);
      //  var title = places[i].place_name;
      //   var shopKind = places[i].category_group_name;
      //   var roadAddress = places[i].address_name;
      data.forEach(function (element) {
        element.shopKind = element.category_group_name;
        element.shopName = element.place_name;
        element.roadAddress = element.address_name;
      });
      await this.$store.commit("SET_SHOP_LIST", data);
      if (status === kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
        await this.displayPlaces(data);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        // 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요
      } else if (status === kakao.maps.services.Status.ERROR) {
        // 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요
      }
    },
    async displayPlaces(places) {
      // 몇번째 카테고리가 선택되어 있는지 얻어옵니다
      // 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
      var order = document
        .getElementById(this.currCategory)
        .getAttribute("data-order");
      console.log(places.length);
      var self = this;
      var listItem = document.querySelectorAll(".product-item");
      for (var i = 0; i < places.length; i++) {
        // 마커를 생성하고 지도에 표시합니다
        var marker = this.addMarker_test(
          new kakao.maps.LatLng(places[i].y, places[i].x),
          order
        );
        var title = places[i].place_name;
        var shopKind = places[i].category_group_name;
        var roadAddress = places[i].address_name;
        // 마커와 검색결과 항목을 클릭 했을 때
        // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
        // (function (marker, place) {
        //   kakao.maps.event.addListener(marker, "click", function () {
        //     displayPlaceInfo(place);
        //   });
        // })(marker, places[i]);
        console.log(listItem.length, "??????????");
        (function (marker, title, shopKind, roadAddress, map) {
          kakao.maps.event.addListener(marker, "click", async function () {
            if (self.customOverlay != null) {
              self.customOverlay.setMap(null);
            }
            await self.displayInfowindow(marker, title, shopKind, roadAddress);
            document.querySelector("#close").onclick = function () {
              self.customOverlay.setMap(null);
            };
          });

          listItem[i].onmouseover = async function () {
            if (self.customOverlay != null) {
              self.customOverlay.setMap(null);
            }
            self.displayInfowindow(marker, title, shopKind, roadAddress);
            await setTimeout(function () {}, 1000);
            await self.caller();
            document.querySelector("#close").onclick = function () {
              self.customOverlay.setMap(null);
            };
          };
        })(marker, title, shopKind, roadAddress, this.map);
      }
    },
    caller() {
      document.querySelector("#close").onclick = function () {
        self.customOverlay.setMap(null);
      };
    },
    addMarker_test(position, order) {
      //alert(typeof order);
      console.log(order);
      var src;
      switch (order) {
        case "0":
          src = "https://map.pstatic.net/res/category/image/00023-00004.png";
          break;
        case "1":
          src = "https://map.pstatic.net/res/category/image/00023-00103.png";
          break;
        case "2":
          src = "https://map.pstatic.net/res/category/image/00023-00085.png";
          break;
        case "3":
          src = "https://map.pstatic.net/res/category/image/00023-00076.png";
          break;
        case "4":
          src = "https://map.pstatic.net/res/category/image/00023-00010.png";
          break;
        case "5":
          src = "https://map.pstatic.net/res/category/image/00023-00097.png";
          break;
        default:
          alert("어떤 값인지 파악이 되지 않습니다.");
      }
      if (order)
        var imageSrc = src, // 마커 이미지 url, 스프라이트 이미지를 씁니다
          imageSize = new kakao.maps.Size(27, 28), // 마커 이미지의 크기
          imgOptions = {
            //spriteSize: new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
            //spriteOrigin: new kakao.maps.Point(46, order * 36), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(11, 28), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
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
    addCategoryClickEvent() {
      // var category = document.getElementById("category"),
      //   children = category.children;
      // var self = this;
      // for (var i = 0; i < children.length; i++) {
      //   children[i].onclick = self.onClickCategory(children[i]);
      // }
    },

    // 카테고리를 클릭했을 때 호출되는 함수입니다
    onClickCategory(el) {
      console.log("xxxxxxxxxxxxxxxxx", el.target);
      var self = this;
      var id = el.target.id,
        className = el.target.className;

      self.placeOverlay.setMap(null);
      self.CLEAR_SHOP_LIST();
      if (className === "on") {
        self.currCategory = "";
        self.changeCategoryClass();

        self.removeMarker();
      } else {
        self.currCategory = id;
        //console.log("else");
        self.changeCategoryClass(el.target);
        self.searchPlaces();
      }
    },

    // 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수입니다
    changeCategoryClass(el) {
      //console.log("changeCategoryClass", el);
      var category = document.getElementById("category"),
        children = category.children,
        i;
      console.log(children.length);
      for (i = 0; i < children.length; i++) {
        children[i].className = "";
      }

      if (el) {
        el.className = "on";
      }
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
      var listItem = document.querySelectorAll(".product-item");

      console.log(self);
      for (var i = 0; i < places.length; i++) {
        var placePosition = new kakao.maps.LatLng(places[i].lat, places[i].lng);
        var marker = this.addMarker(placePosition, i);

        //console.log(i);
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        var title = places[i].shopName;
        var shopKind = places[i].shopKind;
        var roadAddress = places[i].roadAddress;
        var map = this.map;
        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다

        //var ii = i;

        (function (marker, title, shopKind, roadAddress, map) {
          kakao.maps.event.addListener(marker, "click", function () {
            if (self.customOverlay != null) {
              self.customOverlay.setMap(null);
            }
            self.displayInfowindow(marker, title, shopKind, roadAddress);
            document.querySelector("#close").onclick = function () {
              self.customOverlay.setMap(null);
            };
          });

          listItem[i].onmouseover = function () {
            if (self.customOverlay != null) {
              self.customOverlay.setMap(null);
            }
            self.displayInfowindow(marker, title, shopKind, roadAddress);
            document.querySelector("#close").onclick = function () {
              self.customOverlay.setMap(null);
            };
          };
        })(marker, title, shopKind, roadAddress, this.map);
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
      console.log("마커제거중 -- ", this.markers.length);
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers = [];
    },

    displayInfowindow(marker, title, shopKind, roadAddress) {
      var content = `
      <!-- Profile Image -->
    <div class="card card-primary card-outline" style="width: 300px">
      <div class="card-body box-profile">
        <div class="text-center" style="height: 200px">
          <img
            class="profile-user-img img-fluid img-circle"
            src="/img/shop/info.jpg"
            alt="User profile picture"
            style="height: 190px"
          />
        </div>

        <h3 class="profile-username text-center" style="overflow:hidden">${title}</h3>

        <p class="text-muted text-center">come on!</p>

        <ul class="list-group list-group-unbordered mb-3" style="overflow:hidden">
          <li class="list-group-item">
            <b>업종</b> <a class="float-right">${shopKind}</a>
          </li>
          <li class="list-group-item">
            <b>주소</b> <a class="float-right">${roadAddress.substr(
              roadAddress.indexOf(" ")
            )}</a>
          </li>
          <li class="list-group-item">
            <b>Friends</b> <a class="float-right">13,287</a>
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

      var self = this;

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

.content-right >>> .map_wrap {
  position: relative;
  width: 100%;
  height: 350px;
}
.content-right >>> #category {
  /* padding: 0; */
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 5px;
  /* border: 1px solid #909090; */
  /* box-shadow: 0 1px 1px rgba(0, 0, 0, 0.4); */
  display: inline-block;
  padding: 0 11px;
  white-space: nowrap;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%);
  background: #fff;

  overflow: hidden;
  z-index: 2;
}

.content-right >>> #category li {
  float: left;
  list-style: none;

  display: inline-block;
  vertical-align: top;
  margin: 0;
  padding: 0;

  /* width: 50px;
  border-right: 1px solid #acacac;
  padding: 6px 0;
  text-align: center; */
  cursor: pointer;
}
.content-right >>> #category button {
  position: relative;
  padding: 19px 11px 17px;
  line-height: 19px;
  font-size: 15px;
  font-weight: 600;
  color: #242424;
  border-radius: 0;
  appearance: none;
  background-color: transparent;
  margin: 0;
  border: 0;
}
.content-right >>> #category li.on {
  background: #eee;
}
.content-right >>> #category li:hover {
  background: #ffe6e6;
  border-left: 1px solid #acacac;
  margin-left: -1px;
}
.content-right >>> #category li:last-child {
  margin-right: 0;
  border-right: 0;
}
.content-right >>> #category li span {
  display: block;
  margin: 0 auto 3px;
  width: 27px;
  height: 28px;
}
.content-right >>> #category li .category_bg {
  background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png)
    no-repeat;
}
.content-right >>> #category li .bank {
  background-position: -10px 0;
}
.content-right >>> #category li .mart {
  background-position: -10px -36px;
}
.content-right >>> #category li .pharmacy {
  background-position: -10px -72px;
}
.content-right >>> #category li .oil {
  background-position: -10px -108px;
}
.content-right >>> #category li .cafe {
  background-position: -10px -144px;
}
.content-right >>> #category li .store {
  background-position: -10px -180px;
}
.content-right >>> #category li.on .category_bg {
  background-position-x: -46px;
}
.content-right >>> .placeinfo_wrap {
  position: absolute;
  bottom: 28px;
  left: -150px;
  width: 300px;
}
.content-right >>> .placeinfo {
  position: relative;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #ccc;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
  background: #fff;
}
.content-right >>> .placeinfo:nth-of-type(n) {
  border: 0;
  box-shadow: 0px 1px 2px #888;
}
.content-right >>> .placeinfo_wrap .after {
  content: "";
  position: relative;
  margin-left: -12px;
  left: 50%;
  width: 22px;
  height: 12px;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png");
}
.content-right >>> .placeinfo a,
.content-right >>> .placeinfo a:hover,
.content-right >>> .placeinfo a:active {
  color: #fff;
  text-decoration: none;
}
.content-right >>> .placeinfo a,
.content-right >>> .placeinfo span {
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.content-right >>> .placeinfo span {
  margin: 5px 5px 0 5px;
  cursor: default;
  font-size: 13px;
}
.content-right >>> .placeinfo .title {
  font-weight: bold;
  font-size: 14px;
  border-radius: 6px 6px 0 0;
  margin: -1px -1px 0 -1px;
  padding: 10px;
  color: #fff;
  background: #d95050;
  background: #d95050
    url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png)
    no-repeat right 14px center;
}
.content-right >>> .placeinfo .tel {
  color: #0f7833;
}
.content-right >>> .placeinfo .jibun {
  color: #999;
  font-size: 11px;
  margin-top: 0;
}
</style>
